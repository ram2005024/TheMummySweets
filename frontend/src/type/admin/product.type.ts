// Matches backend: ImageResponse
export interface ImageResponse {
  thumbnail: string;
  original: string;
  medium: string;
}

// Matches backend: QuantizedUnit enum
export type QuantizedUnit = "ltr" | "ml" | "pcs" | "na";

// Matches backend: ProductCreate
export interface ProductCreatePayload {
  product_name: string;
  product_description?: string;
  category_label: string;
  category_ids: string[];
  discount_percentage?: number;
  price?: number;
  ingredients?: string[];
  stock_quantity?: number;
  average_preparation_time?: number;
  grouped_unit?: QuantizedUnit;
  grouped_quantity?: number;
  main_image: ImageResponse;
  side_images?: ImageResponse[];
}

// Image slot state — local UI only
export type UploadStatus = "uploading" | "done" | "error" | "cancelled";

export interface ImageSlot {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: UploadStatus;
  imageResponse: ImageResponse | null; // set after upload success
  abortController: AbortController;
}
