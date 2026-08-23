"use client";

import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";
import CategoriesLinks from "./categories-section/categories-links";
import CategorySearch from "./categories-section/category-search";
import NoCategories from "./categories-section/no-categories-to-show";

const CategorySection = () => {
  const { data: categories } = useGetMenuCategories();
  return (
    <section className="border-y-2 border-surface-2 ">
      <div className="sm:max-w-[80%]  w-full mx-auto  py-10">
        {/* For categories links */}
        {categories && categories?.data.length > 0 ? (
          <div className="flex flex-col ">
            <CategoriesLinks />
            <CategorySearch />
          </div>
        ) : (
          <NoCategories />
        )}
      </div>
    </section>
  );
};

export default CategorySection;
