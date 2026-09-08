import { DeliverySchemaType } from "@/schemas/order/delivery_schema";

export enum PaymentStatus {
  FAILED = "failed",
  PENDING = "pending",
  CANCELED = "canceled",
  PAID = "paid",
  REFUNDED = "refunded",
}
export enum OrderStatus {
  PLACED = "placed",
  PENDING_PAYMENT = "pending_payment",
  PREPARING = "preparing",
  SHIPPED = "shipped",
  ARRIVING = "arriving",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}
export interface ProductImage {
  thumbnail: string;
  original: string;
  medium: string;
}

export interface Product {
  id: string;
  main_image: ProductImage;
  product_name: string;
  is_best_seller: boolean;
  price: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface CartItem {
  price: number;
  quantity: number;
  product: Product;
}

export type OrderResponse = {
  payment_method: string;
  client_secret?: string;
  order_id: string;
  payment_status: PaymentStatus;
  amount: number;
  calculation: {
    total: number;
    sub_total: number;
    delivery_fee: number | string;
    vat_amount: number;
    coupen_applied?: string;
  };
  order_status: OrderStatus;
  order_items: CartItem[];
  delivery_details: DeliverySchemaType;
};
