export type UploadStatus =
  | "idle"
  | "uploading"
  | "done"
  | "error"
  | "cancelled";

export interface ImageFile {
  id: string;
  file: File;
  preview: string; // local blob URL for instant preview
  progress: number; // 0–100
  status: UploadStatus;
  url: string | null; // returned from server after upload
  abortController: AbortController; // for cancel
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  prepTime: number;
  category: string;
  isAvailable: boolean;
  mainImage: string;
  sideImages: string[];
}
