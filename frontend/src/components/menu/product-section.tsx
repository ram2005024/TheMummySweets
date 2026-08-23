"use client";

import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";
import { MenuProduct } from "@/type/menu.type";
import ListProducts from "./product-section/list-product";
import NoProductToShow from "./product-section/no-product-to-show";

const ProductSection = () => {
  const { data } = useGetMenuProducts();

  // flatten all pages into one array
  const products: MenuProduct[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className="bg-background">
      <div className="sm:max-w-[80%] w-full mx-auto py-10">
        {products.length > 0 ? <ListProducts /> : <NoProductToShow />}
      </div>
    </section>
  );
};

export default ProductSection;
