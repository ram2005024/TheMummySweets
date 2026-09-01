import { ImageSlot } from "@/type/admin/product.type";
import { create } from "zustand";
interface ProductImageStore {
  mainImage: ImageSlot | null;
  sideImages: ImageSlot[];

  // main image
  setMainImage: (img: ImageSlot) => void;
  updateMainImage: (id: string, updates: Partial<ImageSlot>) => void;
  removeMainImage: () => void;

  // side images
  addSideImages: (imgs: ImageSlot[]) => void;
  updateSideImage: (id: string, updates: Partial<ImageSlot>) => void;
  removeSideImage: (id: string) => void;

  resetImages: () => void;
}

export const useProductStore = create<ProductImageStore>((set) => ({
  mainImage: null,
  sideImages: [],

  setMainImage: (img) => set({ mainImage: img }),

  updateMainImage: (id, updates) =>
    set((s) =>
      s.mainImage?.id === id
        ? { mainImage: { ...s.mainImage, ...updates } }
        : {},
    ),

  removeMainImage: () =>
    set((s) => {
      s.mainImage?.abortController.abort();
      return { mainImage: null };
    }),

  // slice to max 5 always
  addSideImages: (imgs) =>
    set((s) => ({
      sideImages: [...s.sideImages, ...imgs].slice(0, 5),
    })),

  updateSideImage: (id, updates) =>
    set((s) => ({
      sideImages: s.sideImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img,
      ),
    })),

  removeSideImage: (id) =>
    set((s) => {
      s.sideImages.find((i) => i.id === id)?.abortController.abort();
      return { sideImages: s.sideImages.filter((i) => i.id !== id) };
    }),

  resetImages: () => set({ mainImage: null, sideImages: [] }),
}));
