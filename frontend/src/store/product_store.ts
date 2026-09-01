import { create } from "zustand";
import { ImageFile } from "../types/product.types";

interface ProductImageStore {
  mainImage: ImageFile | null;
  sideImages: ImageFile[]; // max 5

  // main image actions
  setMainImage: (img: ImageFile) => void;
  updateMainImage: (id: string, updates: Partial<ImageFile>) => void;
  removeMainImage: () => void;

  // side image actions
  addSideImages: (imgs: ImageFile[]) => void; // multiple at once
  updateSideImage: (id: string, updates: Partial<ImageFile>) => void;
  removeSideImage: (id: string) => void;

  // reset everything
  resetImages: () => void;
}

export const useProductStore = create<ProductImageStore>((set) => ({
  mainImage: null,
  sideImages: [],

  setMainImage: (img) => set({ mainImage: img }),

  updateMainImage: (id, updates) =>
    set((state) =>
      state.mainImage?.id === id
        ? { mainImage: { ...state.mainImage, ...updates } }
        : {},
    ),

  removeMainImage: () =>
    set((state) => {
      // cancel upload if still in progress
      state.mainImage?.abortController.abort();
      return { mainImage: null };
    }),

  // accepts array — user can pick multiple side images at once
  addSideImages: (imgs) =>
    set((state) => ({
      sideImages: [...state.sideImages, ...imgs].slice(0, 5), // never exceed 5
    })),

  updateSideImage: (id, updates) =>
    set((state) => ({
      sideImages: state.sideImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img,
      ),
    })),

  removeSideImage: (id) =>
    set((state) => {
      const img = state.sideImages.find((i) => i.id === id);
      img?.abortController.abort(); // cancel if uploading
      return {
        sideImages: state.sideImages.filter((i) => i.id !== id),
      };
    }),

  resetImages: () => set({ mainImage: null, sideImages: [] }),
}));
