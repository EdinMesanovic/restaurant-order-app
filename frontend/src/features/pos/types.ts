import type { Product } from "@/lib/api-products";

export type CategoryFilter = "burger" | "side" | "sauce" | "drink";

export type CategoryOption = {
  key: CategoryFilter;
  label: string;
  description: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  category: Product["category"];
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  removedIngredients: string[];
  addedIngredients: string[];
  note: string;
};
