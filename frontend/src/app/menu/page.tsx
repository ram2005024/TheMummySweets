"use client";
import CategorySection from "@/components/menu/category-section";
import HeadingSection from "@/components/menu/heading-section";
import ProductSection from "@/components/menu/product-section";
import SplashScreen from "@/components/SplashLoading";
import {
  useGetMenuCategories,
  useGetMenuProducts,
} from "@/hooks/menu/useMenuItems";

const Menu = () => {
  const { isLoading: categoryLoading } = useGetMenuCategories();

  const { isLoading: menuLoading } = useGetMenuProducts();
  return (
    <div className="min-h-screen  flex flex-col">
      {menuLoading || categoryLoading ? (
        <SplashScreen />
      ) : (
        <div>
          <HeadingSection />
          <CategorySection />
          <ProductSection />
        </div>
      )}
    </div>
  );
};

export default Menu;
