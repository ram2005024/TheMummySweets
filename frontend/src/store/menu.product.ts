import { create } from "zustand";

interface menuStoreInterface {
  fast_prepare: boolean;
  setFastPrepare: (val: boolean) => void;
  most_rated: boolean;
  setMostRated: (val: boolean) => void;
  sort_by: string | null;
  setSortBy: (val: string | null) => void;
  search_by: string | null;
  setSearchBy: (val: string | null) => void;
  category: string | null;
  setCategory: (val: string | null) => void;
  limit: number;
  setLimit: (val: number) => void;
}

// Menu store
export const menuStore = create<menuStoreInterface>((set) => ({
  fast_prepare: false,
  setFastPrepare: (val) => set({ fast_prepare: val }),
  most_rated: false,
  setMostRated: (val) => set({ most_rated: val }),
  sort_by: null,
  setSortBy: (val) => set({ sort_by: val }),
  search_by: null,
  setSearchBy: (val) => set({ search_by: val }),
  category: null,
  setCategory: (val) => set({ category: val }),
  limit: 10,
  setLimit: (val) => set({ limit: val }),
}));
