import NoCategories from "@/components/menu/categories-section/no-categories-to-show";
import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";
import WishlistCategoryLink from "./category-link";
import WishlistCategorySearch from "./wishlist-category-search";

const WishListCategoryAndFilter = () => {
  const { data: categories } = useGetMenuCategories();
  return (
    <section className="sticky top-30 backdrop-blur-lg z-20">
      <div className="  w-full max-w-[80%] mx-auto py-10">
        {/* For categories links */}
        {categories && categories?.data.length > 0 ? (
          <div className="flex flex-col ">
            <WishlistCategoryLink />
            <WishlistCategorySearch />
          </div>
        ) : (
          <NoCategories />
        )}
      </div>
    </section>
  );
};

export default WishListCategoryAndFilter;
