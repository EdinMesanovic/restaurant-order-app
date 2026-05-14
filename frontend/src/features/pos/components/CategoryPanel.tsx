import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CategoryFilter, CategoryOption } from "@/features/pos/types";
import { Separator } from "@/components/ui/separator";

type CategoryPanelProps = {
  categories: CategoryOption[];
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
};

export function CategoryPanel({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPanelProps) {
  return (
    <section className="min-w-0 overflow-hidden">
      <Card className="mt-0 md:mt-0 flex h-full min-h-0 flex-col overflow-hidden py-3">
        <CardHeader className="px-3 pb-2">
          <CardTitle className="text-sm">Kategorije</CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="min-h-0 flex-1 overflow-y-auto px-3">
          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => onSelectCategory(category.key)}
                className={cn(
                  "relative z-10 block w-full cursor-pointer rounded-xl border p-4 text-left transition-colors min-h-[88px]",

                  selectedCategory === category.key
                    ? "border-primary bg-foreground text-background"
                    : "border-border bg-background hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <div className="pointer-events-none">
                  <div className="font-medium">{category.label}</div>
                  <div
                    className={cn(
                      "mt-1 text-xs",
                      selectedCategory === category.key
                        ? "text-background/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {category.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
