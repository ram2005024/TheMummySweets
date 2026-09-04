import NoCategories from "@/components/menu/categories-section/no-categories-to-show";
import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";
import WishlistCategoryLink from "./category-link";

const WishListCategoryAndFilter = () => {
  const { data: categories } = useGetMenuCategories();
  return (
    <section className="border-y-2  border-surface-2 sticky top-20 backdrop-blur-lg z-20">
      <div className="sm:max-w-[80%]  w-full mx-auto  py-10">
        {/* For categories links */}
        {categories && categories?.data.length > 0 ? (
          <div className="flex flex-col ">
            <WishlistCategoryLink />
          </div>
        ) : (
          <NoCategories />
        )}
      </div>
    </section>
  );
};

export default WishListCategoryAndFilter;
