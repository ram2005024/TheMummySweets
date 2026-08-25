export interface MenuProduct {
  id: string;
  main_image: string;
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
enum GroupedUnits {
  LTR = "ltr",
  ML = "ml",
  PCS = "pcs",
  NA = "na",
}
export interface SingleProductType {
  id: string;
  main_image: string;
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
  side_images: string[];
  is_available: string;
}
