import api, { publicAPI } from "@/libs/api";
import { ImageResponse, ProductCreatePayload } from "@/type/admin/product.type";
import { SuccessResponse } from "@/type/common.type";
export class ProductService {
  static async uploadProductImage(
    file: File,
    signal: AbortSignal,
    onProgress: (percent: number) => void,
  ): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await publicAPI.post<SuccessResponse<ImageResponse>>(
      `/admin/image/upload/product`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        signal,
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        },
      },
    );

    return res.data.data;
  }

  static async createProduct(payload: ProductCreatePayload): Promise<void> {
    await api.post(`/product/`, payload);
  }
}
