"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

const CategorySearch = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  return (
    <div className="flex items-center gap-4 w-full sm:mt-8 mt-5">
      {/* Search input */}
      <div className="flex items-center gap-2 flex-1 rounded-md  w-full max-w-1/2 border border-input bg-background px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search this category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm "
        />
      </div>

      {/* Sort dropdown using shadcn Select */}
      <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Most popular</SelectItem>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySearch;
