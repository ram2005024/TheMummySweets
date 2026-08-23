"use client";
import CategorySection from "@/components/menu/category-section";
import HeadingSection from "@/components/menu/heading-section";
import ProductSection from "@/components/menu/product-section";
import SplashScreen from "@/components/SplashLoading";
import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";

const Menu = () => {
  const { isLoading: categoryLoading } = useGetMenuCategories();

  return (
    <div className="min-h-screen  flex flex-col">
      {categoryLoading ? (
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
