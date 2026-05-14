import axios from "axios";
import { api } from "@/lib/axios";
import type { Product } from "@/lib/api-products";

export type CreateOrderItemPayload = {
  product: string;
  variantName?: string;
  quantity: number;
  removedIngredients: string[];
  addedIngredients: string[];
  note: string;
};

export type CreateOrderPayload = {
  items: CreateOrderItemPayload[];
  note: string;
};

export type OrderStatus = "in_progress" | "done";

export type OrderItemResponse = {
  product: Pick<
    Product,
    "_id" | "name" | "category" | "price" | "variants" | "isAvailable"
  >;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  removedIngredients: string[];
  addedIngredients: string[];
  note: string;
};

export type OrderResponse = {
  _id: string;
  orderNumber: number;
  items: OrderItemResponse[];
  totalAmount: number;
  status: OrderStatus;
  createdBy: {
    _id: string;
    username: string;
    role: string;
  };
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type OrdersQuery = {
  status?: OrderStatus;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function createOrderRequest(payload: CreateOrderPayload) {
  try {
    const response = await api.post<OrderResponse>("/orders", payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to create order";
      throw new Error(message);
    }

    throw new Error("Unexpected error while creating order");
  }
}

export async function getOrdersRequest(query?: OrdersQuery) {
  try {
    const response = await api.get<OrderResponse[]>("/orders", {
      params: query,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to load orders";
      throw new Error(message);
    }

    throw new Error("Unexpected error while loading orders");
  }
}

export async function updateOrderStatusRequest(
  orderId: string,
  status: OrderStatus,
) {
  try {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to update order status";
      throw new Error(message);
    }

    throw new Error("Unexpected error while updating order status");
  }
}
