export interface MenuProduct {
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
}
