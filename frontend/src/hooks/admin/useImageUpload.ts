import axios from "axios";
import { useProductStore } from "../store/productStore";
import { ImageFile } from "../types/product.types";

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

  // ─── Core: upload one file, report progress, support cancel ───
  async function uploadFile(imageFile: ImageFile) {
    const formData = new FormData();
    formData.append("image", imageFile.file);

    try {
      const res = await axios.post<{ url: string }>(
        "/api/products/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },

          // signal ties this request to the AbortController
          // calling abortController.abort() cancels this axios call
          signal: imageFile.abortController.signal,

          onUploadProgress: (event) => {
            if (!event.total) return;
            const percent = Math.round((event.loaded * 100) / event.total);

            // push live progress to zustand → UI re-renders
            if (imageFile === mainImage || mainImage?.id === imageFile.id) {
              updateMainImage(imageFile.id, { progress: percent });
            } else {
              updateSideImage(imageFile.id, { progress: percent });
            }
          },
        },
      );

      return res.data.url; // success → return the uploaded URL
    } catch (err) {
      if (axios.isCancel(err)) {
        return null; // cancelled — not an error
      }
      throw err; // real error — let caller handle
    }
  }

  // ─── Pick main image ───
  async function pickMainImage(file: File) {
    // cancel previous main image upload if exists
    mainImage?.abortController.abort();

    const newImage: ImageFile = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file), // instant local preview
      progress: 0,
      status: "uploading",
      url: null,
      abortController: new AbortController(),
    };

    setMainImage(newImage); // show immediately in UI

    try {
      const url = await uploadFile(newImage);
      if (url) {
        updateMainImage(newImage.id, { status: "done", url, progress: 100 });
      } else {
        updateMainImage(newImage.id, { status: "cancelled" });
      }
    } catch {
      updateMainImage(newImage.id, { status: "error" });
    }
  }

  // ─── Pick side images (multiple at once) ───
  async function pickSideImages(files: FileList) {
    const remaining = 5 - sideImages.length;
    if (remaining <= 0) return;

    // slice to only what fits
    const accepted = Array.from(files).slice(0, remaining);

    // build all image objects immediately
    const newImages: ImageFile[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading" as const,
      url: null,
      abortController: new AbortController(),
    }));

    addSideImages(newImages); // show all immediately in UI

    // upload all in parallel — each has its own progress tracking
    await Promise.allSettled(
      newImages.map(async (img) => {
        try {
          const url = await uploadFile(img);
          if (url) {
            updateSideImage(img.id, { status: "done", url, progress: 100 });
          } else {
            updateSideImage(img.id, { status: "cancelled" });
          }
        } catch {
          updateSideImage(img.id, { status: "error" });
        }
      }),
    );
  }

  // ─── Cancel a specific side image upload ───
  function cancelSideImage(id: string) {
    removeSideImage(id); // abort() is called inside the store action
  }

  function cancelMainImage() {
    removeMainImage(); // abort() is called inside the store action
  }

  return {
    mainImage,
    sideImages,
    pickMainImage,
    pickSideImages,
    cancelMainImage,
    cancelSideImage,
    removeSideImage,
    removeMainImage,
  };
}
