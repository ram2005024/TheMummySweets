import { ProductService } from "@/services/product.service";
import { useProductStore } from "@/store/product_store";
import { ImageSlot } from "@/type/admin/product.type";
import axios from "axios";

export function useImageUpload() {
  const {
    mainImage,
    sideImages,
    setMainImage,
    updateMainImage,
    removeMainImage,
    addSideImages,
    updateSideImage,
    removeSideImage,
  } = useProductStore();

  // ─── Core upload — calls service, tracks progress, handles cancel ───
  async function uploadSlot(
    slot: ImageSlot,
    onProgress: (p: number) => void,
    onDone: (
      response: import("@/type/admin/product.type").ImageResponse,
    ) => void,
    onError: () => void,
  ) {
    try {
      const imageResponse = await ProductService.uploadProductImage(
        slot.file,
        slot.abortController.signal,
        onProgress,
      );
      onDone(imageResponse);
    } catch (err) {
      if (axios.isCancel(err)) return; // cancelled — silent
      onError();
    }
  }

  // ─── Pick main image ───
  async function pickMainImage(file: File) {
    mainImage?.abortController.abort(); // cancel previous if any

    const slot: ImageSlot = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading",
      imageResponse: null,
      abortController: new AbortController(),
    };

    setMainImage(slot);

    await uploadSlot(
      slot,
      (p) => updateMainImage(slot.id, { progress: p }),
      (imageResponse) =>
        updateMainImage(slot.id, {
          status: "done",
          progress: 100,
          imageResponse, // { thumbnail, original, medium }
        }),
      () => updateMainImage(slot.id, { status: "error" }),
    );
  }

  // ─── Pick multiple side images at once ───
  async function pickSideImages(files: FileList) {
    const remaining = 5 - sideImages.length;
    if (remaining <= 0) return;

    const accepted = Array.from(files).slice(0, remaining);

    const slots: ImageSlot[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading" as const,
      imageResponse: null,
      abortController: new AbortController(),
    }));

    addSideImages(slots); // show all immediately

    // upload all in parallel — each tracks its own progress
    await Promise.allSettled(
      slots.map((slot) =>
        uploadSlot(
          slot,
          (p) => updateSideImage(slot.id, { progress: p }),
          (imageResponse) =>
            updateSideImage(slot.id, {
              status: "done",
              progress: 100,
              imageResponse,
            }),
          () => updateSideImage(slot.id, { status: "error" }),
        ),
      ),
    );
  }

  return {
    mainImage,
    sideImages,
    pickMainImage,
    pickSideImages,
    cancelMainImage: removeMainImage,
    cancelSideImage: removeSideImage,
  };
}
