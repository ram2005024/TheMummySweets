"use client";

import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";
import {
  Coffee,
  Drumstick,
  IceCream,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
} from "lucide-react";
import { useState } from "react";

export interface CategoryReadBasic {
  id: string;
  category_name: string;
  product_count: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  Momo: Drumstick,
  Pizza: Pizza,
  Burger: Sandwich,
  Biryani: Utensils,
  Chowmein: Salad,
  Thukpa: Soup,
  Snacks: Sandwich,
  Drinks: Coffee,
  Desserts: IceCream,
  "Main Course": Utensils,
};

const CategoriesLinks = () => {
  const [isDefault, setIsDefault] = useState(true);
  const [activeLinkLabel, setLabel] = useState("");
  const { data: categories } = useGetMenuCategories();

  return (
    <div className="flex gap-2 no-scrollbar overflow-x-auto ">
      {/* Default "All" link */}
      <button
        onClick={() => {
          setIsDefault(true);
          setLabel("");
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${isDefault ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
      >
        All
      </button>

      {/* Category links */}
      {categories?.data.map((item: CategoryReadBasic) => {
        const isActive = item.category_name === activeLinkLabel;
        const Icon = categoryIcons[item.category_name];

        return (
          <button
            key={item.id}
            onClick={() => {
              setLabel(item.category_name);
              setIsDefault(false);
            }}
            className={`flex items-center  gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.category_name}</span>
            <span className="text-xs opacity-70">({item.product_count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoriesLinks;
