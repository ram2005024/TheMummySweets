"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuStore } from "@/store/menu.product";
import { Search } from "lucide-react";

const CategorySearch = () => {
  const {
    setMostRated,
    setSortBy,
    setSearchBy,
    search_by,
    sort_by,
    most_rated,
  } = menuStore();
  return (
    <div className="flex items-center gap-4 w-full sm:mt-8 mt-5">
      {/* Search input */}
      <div className="flex items-center gap-2 flex-1 rounded-md  w-full max-w-1/2 border border-input bg-background px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search this category..."
          value={search_by || ""}
          onChange={(e) => setSearchBy(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm "
        />
      </div>

      {/* Sort dropdown using shadcn Select */}
      <Select
        value={most_rated ? "popular" : (sort_by ?? "")}
        onValueChange={(val) => {
          if (val === "popular") {
            setMostRated(true);
            setSortBy(null);
          } else if (val === "all") {
            setMostRated(false);
            setSortBy(null);
          } else {
            setMostRated(false);
            setSortBy(val);
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

export default CategorySearch;
