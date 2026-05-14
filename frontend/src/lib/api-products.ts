import axios from "axios";
import { api } from "@/lib/axios";

export type ProductVariant = {
  name: string;
  price: number;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: "burger" | "side" | "sauce" | "drink";
  price: number | null;
  variants: ProductVariant[];
  image: string;
  isAvailable: boolean;
  displayOrder: number;
};

export async function getProductsRequest(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to load products";
      throw new Error(message);
    }

    throw new Error("Unexpected error while loading products");
  }
}
