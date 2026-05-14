import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/api-products";
import { getProductsRequest } from "@/lib/api-products";
import {
  createOrderRequest,
  getOrdersRequest,
  type OrderResponse,
  updateOrderStatusRequest,
} from "@/lib/api-orders";
import { CategoryPanel } from "@/features/pos/components/CategoryPanel";
import { CurrentOrderPanel } from "@/features/pos/components/CurrentOrderPanel";
import { ProductsPanel } from "@/features/pos/components/ProductsPanel";
import { RecentOrdersPanel } from "@/features/pos/components/RecentOrdersPanel";
import type {
  CategoryFilter,
  CategoryOption,
  OrderItem,
} from "@/features/pos/types";

const categoryOptions: CategoryOption[] = [
  { key: "burger", label: "Burgeri", description: "Smash i burgeri" },
  { key: "side", label: "Prilozi", description: "Pomfrit i prilozi" },
  { key: "sauce", label: "Sosovi", description: "Dodatni sosovi" },
  { key: "drink", label: "Pića", description: "Bezalkoholna pića" },
];

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("burger");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);

  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const totalAmount = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
    [orderItems],
  );

  const selectedCategoryMeta = categoryOptions.find(
    (category) => category.key === selectedCategory,
  );

  const loadProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");

    try {
      const response = await getProductsRequest();
      setProducts(response.filter((product) => product.isAvailable));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Neuspješno učitavanje proizvoda.";

      setProductsError(message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");

    try {
      const response = await getOrdersRequest();
      setRecentOrders(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Neuspješno učitavanje narudžbi.";

      setOrdersError(message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    void loadProducts();
    void loadOrders();
  }, []);

  function addBurgerProductToOrder(
    product: Product,
    variantName: string,
    removedIngredients: string[],
  ) {
    const selectedVariant = product.variants.find(
      (variant) => variant.name === variantName,
    );

    if (!selectedVariant) {
      toast.error("Odaberi varijantu burgera.");
      return;
    }

    setOrderItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: product._id,
        productName: product.name,
        category: product.category,
        variantName: selectedVariant.name,
        quantity: 1,
        unitPrice: selectedVariant.price,
        totalPrice: selectedVariant.price,
        removedIngredients,
        addedIngredients: [],
        note:
          removedIngredients.length > 0
            ? `Bez: ${removedIngredients.join(", ")}`
            : "",
      },
    ]);

    toast.success(`${product.name} - ${selectedVariant.name} je dodan.`);
  }

  function addDirectProductToOrder(product: Product) {
    const unitPrice = product.price ?? 0;

    setOrderItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: product._id,
        productName: product.name,
        category: product.category,
        variantName: "",
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice,
        removedIngredients: [],
        addedIngredients: [],
        note: "",
      },
    ]);

    toast.success(`${product.name} je dodan u narudžbu.`);
  }

  function updateItemQuantity(itemId: string, nextQuantity: number) {
    if (nextQuantity < 1) return;

    setOrderItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: nextQuantity,
              totalPrice: item.unitPrice * nextQuantity,
            }
          : item,
      ),
    );
  }

  function removeOrderItem(itemId: string) {
    setOrderItems((current) => current.filter((item) => item.id !== itemId));
  }

  function clearOrder() {
    setOrderItems([]);
    setOrderNote("");
  }

  async function sendOrder() {
    if (orderItems.length === 0) {
      toast.error("Dodaj barem jednu stavku prije slanja narudžbe.");
      return;
    }

    setSendingOrder(true);

    try {
      await createOrderRequest({
        items: orderItems.map((item) => ({
          product: item.productId,
          variantName: item.variantName,
          quantity: item.quantity,
          removedIngredients: item.removedIngredients,
          addedIngredients: item.addedIngredients,
          note: item.note,
        })),
        note: orderNote.trim(),
      });

      clearOrder();
      await loadOrders();
      toast.success("Narudžba je uspješno poslana.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Slanje narudžbe nije uspjelo.";

      toast.error(message);
    } finally {
      setSendingOrder(false);
    }
  }

  async function markOrderAsDone(orderId: string) {
    setUpdatingOrderId(orderId);

    try {
      await updateOrderStatusRequest(orderId, "done");
      await loadOrders();
      toast.success("Narudžba je označena kao gotova.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Promjena statusa narudžbe nije uspjela.";

      toast.error(message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div className="box-border flex h-full min-h-0 w-full flex-col overflow-hidden">
      <section className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden lg:grid lg:grid-cols-[calc(10%-6px)_calc(30%-6px)_calc(30%-6px)_calc(30%-6px)]">
          <CategoryPanel
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductsPanel
            products={products}
            selectedCategory={selectedCategory}
            selectedCategoryMeta={selectedCategoryMeta}
            loading={loadingProducts}
            error={productsError}
            onRefresh={() => void loadProducts()}
            onAddBurgerProduct={addBurgerProductToOrder}
            onAddDirectProduct={addDirectProductToOrder}
          />

          <CurrentOrderPanel
            items={orderItems}
            orderNote={orderNote}
            totalAmount={totalAmount}
            sendingOrder={sendingOrder}
            onOrderNoteChange={setOrderNote}
            onRemoveItem={removeOrderItem}
            onUpdateQuantity={updateItemQuantity}
            onClearOrder={clearOrder}
            onSendOrder={() => void sendOrder()}
          />

          <RecentOrdersPanel
            orders={recentOrders}
            loading={loadingOrders}
            error={ordersError}
            updatingOrderId={updatingOrderId}
            onRefresh={() => void loadOrders()}
            onMarkDone={(orderId) => void markOrderAsDone(orderId)}
          />
        </div>
      </section>
    </div>
  );
}
