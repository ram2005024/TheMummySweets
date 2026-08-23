"use client";
import HeadingSection from "@/components/menu/heading-section";
import SplashScreen from "@/components/SplashLoading";
import {
  useGetMenuCategories,
  useGetMenuProducts,
} from "@/hooks/menu/useMenuItems";

const Menu = () => {
  const { isLoading: categoryLoading } = useGetMenuCategories();

  const { isLoading: menuLoading } = useGetMenuProducts();
  return (
    <div className="min-h-screen sm:max-w-[80%] w-full mx-auto flex flex-col">
      {menuLoading && categoryLoading ? <SplashScreen /> : <HeadingSection />}
    </div>
  );
};

export default Menu;
