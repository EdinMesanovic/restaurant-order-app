import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/api-products";
import type { CategoryFilter, CategoryOption } from "@/features/pos/types";
import { formatPrice } from "@/features/pos/utils";
import { cn } from "@/lib/utils";

type ProductsPanelProps = {
  products: Product[];
  selectedCategory: CategoryFilter;
  selectedCategoryMeta?: CategoryOption;
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onAddBurgerProduct: (
    product: Product,
    variantName: string,
    removedIngredients: string[],
  ) => void;
  onAddDirectProduct: (product: Product) => void;
};

function getIngredients(description?: string) {
  if (!description) return [];

  return description
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function BurgerProductCard({
  product,
  onAddBurgerProduct,
}: {
  product: Product;
  onAddBurgerProduct: (
    product: Product,
    variantName: string,
    removedIngredients: string[],
  ) => void;
}) {
  const defaultVariant =
    product.variants.find((variant) => variant.name === "Double") ??
    product.variants[0];

  const ingredients = useMemo(
    () => getIngredients(product.description),
    [product.description],
  );

  const [selectedVariant, setSelectedVariant] = useState(
    defaultVariant?.name ?? "",
  );

  const [selectedIngredients, setSelectedIngredients] =
    useState<string[]>(ingredients);

  function toggleIngredient(ingredient: string) {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient],
    );
  }

  function handleAdd() {
    const removedIngredients = ingredients.filter(
      (ingredient) => !selectedIngredients.includes(ingredient),
    );

    onAddBurgerProduct(product, selectedVariant, removedIngredients);
  }

  return (
    <div className="rounded-xl border bg-background p-3 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="font-medium">{product.name}</div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>

        <Badge variant="outline">burger</Badge>
      </div>

      <div className="mt-3">
        <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
          Veličina
        </div>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <Button
              key={variant.name}
              type="button"
              variant={selectedVariant === variant.name ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-full"
              onClick={() => setSelectedVariant(variant.name)}
            >
              <span>{variant.name}</span>
              <span
                className={cn(
                  selectedVariant === variant.name
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {formatPrice(variant.price)}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {ingredients.length > 0 ? (
        <div className="mt-3">
          <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
            Sastojci
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient);

              return (
                <Button
                  key={ingredient}
                  type="button"
                  variant={isSelected ? "secondary" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 rounded-full text-xs",
                    !isSelected && "opacity-50 line-through",
                  )}
                  onClick={() => toggleIngredient(ingredient)}
                >
                  {ingredient}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      <Button type="button" className="mt-4 w-full" onClick={handleAdd}>
        <Plus className="mr-2 size-4" />
        Dodaj
      </Button>
    </div>
  );
}

export function ProductsPanel({
  products,
  selectedCategory,
  selectedCategoryMeta,
  loading,
  error,
  onRefresh,
  onAddBurgerProduct,
  onAddDirectProduct,
}: ProductsPanelProps) {
  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === selectedCategory),
    [products, selectedCategory],
  );

  return (
    <section className="min-w-0 overflow-hidden">
      <Card className="mt-0 flex h-full min-h-0 flex-col overflow-hidden py-3 md:mt-0">
        <CardHeader className="px-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{selectedCategoryMeta?.label}</CardTitle>
            </div>

            <Button variant="outline" size="sm" onClick={onRefresh}>
              Osvježi
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Učitavanje proizvoda...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nema artikala u ovoj kategoriji.
            </div>
          ) : selectedCategory === "burger" ? (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <BurgerProductCard
                  key={product._id}
                  product={product}
                  onAddBurgerProduct={onAddBurgerProduct}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => onAddDirectProduct(product)}
                  className="rounded-xl border bg-background p-4 text-left shadow-sm transition hover:border-primary/40 hover:bg-accent/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {product.description || "Bez dodatnog opisa."}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      {formatPrice(product.price ?? 0)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
