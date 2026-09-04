import { ImageResponse } from "./admin/product.type";
import { PaginatedResponse } from "./common.type";

enum GroupedUnits {
  LTR = "ltr",
  ML = "ml",
  PCS = "pcs",
  NA = "na",
}
export interface MenuProduct {
  id: string;
  main_image: ImageResponse;
  is_best_seller: boolean;
  category_label: string;
  product_name: string;
  product_description: string;
  rating: number;
  review_count: number;
  average_preparation_time: number;
  price: number;
  grouped_unit: GroupedUnits;
  total_amount: number;
  discount_percentage: number;
}

export interface MenuParams {
  page: number;
  fast_prepare: boolean;
  most_rated: boolean;
  sort_by: string | null;
  search_by: string | null;
  category: string | null;
  limit: number;
}

export interface CategoryReadBasic {
  id: string;
  category_name: string;
  product_count: number;
}
// ENUM FOR GROUPED UNITS
export interface SingleProductType {
  id: string;
  main_image: ImageResponse;
  is_best_seller: boolean;
  category_label: string;
  product_name: string;
  product_description: string;
  rating: number;
  review_count: number;
  average_preparation_time: number;
  price: number;
  total_amount: number;
  discount_percentage: number;
  ingredients: string[];
  grouped_quantity: number;
  grouped_unit: GroupedUnits;
  side_images: ImageResponse[];
  is_available: string;
}

export interface Comment {
  comment: string;
  user: {
    id: string;
    profile: {
      full_name: string;
      image: string;
      rank: string;
    };
    role: string;
    is_active: boolean;
    is_authenticated: boolean;
    email: string;
    phone_no: string;
  };
  review_id: string;
  id: string;
}
export interface ProductReview {
  like_count: number;
  rating: number;
  review_title: string;
  review_description: string;
  user: {
    id: string;
    profile: {
      full_name: string;
      image: string;
      rank: string;
    };
    role: string;
    is_active: boolean;
    is_authenticated: boolean;
    email?: string;
    phone_no?: string;
  };
  comments: Comment[];
  product_id: string;
  created_at: string;
}

export interface ReviewParam {
  page: number;
  limit: number;
}

export interface ReviewResponse extends PaginatedResponse<ProductReview[]> {
  stats: {
    avg_rating: number;
    distribution: Record<number, number>;
  };
}

export interface CartProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  main_image: ImageResponse;
  quantized_unit: string;
}

export interface CartResponseType {
  items: CartProduct[];
  total: number;
  sub_total: number;
  tax_amount: number;
  delivery_fee: number;
}

export interface Wishlist {
  wishlist_id: string;
  products: PaginatedResponse<MenuProduct[]>;
}

export interface WishlistStatusIDS {
  wishlisted_ids: string[];
}
