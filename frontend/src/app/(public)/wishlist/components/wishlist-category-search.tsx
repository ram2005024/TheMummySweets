"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWishlistStore } from "@/store/wishlist.store";
import { Search } from "lucide-react";

const WishlistCategorySearch = () => {
  const {
    set_wishlist_most_rated,
    set_wishlist_sort_by,
    set_wishlist_search_by,
    wishlist_search_by,
    wishlist_sort_by,
    wishlist_most_rated,
  } = useWishlistStore();
  return (
    <div className="flex  gap-4 w-full sm:mt-8 mt-5">
      {/* Search input */}
      <div className="flex items-center gap-2 flex-1 rounded-md  w-full max-w-1/2 border border-input bg-background px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search this category..."
          value={wishlist_search_by || ""}
          onChange={(e) => set_wishlist_search_by(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm "
        />
      </div>

      {/* Sort dropdown using shadcn Select */}
      <Select
        value={wishlist_most_rated ? "popular" : (wishlist_sort_by ?? "")}
        onValueChange={(val) => {
          if (val === "popular") {
            set_wishlist_most_rated(true);
            set_wishlist_sort_by(null);
          } else if (val === "all") {
            set_wishlist_most_rated(false);
            set_wishlist_sort_by(null);
          } else {
            set_wishlist_most_rated(false);
            set_wishlist_sort_by(val);
          }
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All categories</SelectItem>
          <SelectItem value="popular">Most popular</SelectItem>
          <SelectItem value="+created_at">Newest first</SelectItem>
          <SelectItem value="-created_at">Oldest first</SelectItem>
          <SelectItem value="+price">Price: Low to High</SelectItem>
          <SelectItem value="-price">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WishlistCategorySearch;
