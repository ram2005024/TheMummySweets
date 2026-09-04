import { serverAPI } from "@/libs/server_api";
import { SingleProductType } from "@/type/menu.type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionSection from "./components/action-section";
import ImageShowcase from "./components/image-showcase";
import IngredientDetails from "./components/ingredients-detail";
import ProductDescriptionHeader from "./components/product-description-header";
import ProductQuality from "./components/product-quality";
import ProductReviews from "./components/product-reviews";

type Props = {
  params: Promise<{
    name: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  return {
    title: name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { name, id } = await params;
  const response = await serverAPI<SingleProductType>({
    apiString: `/product/${id}`,
  });
  const product = response;
  if (!product) {
    return notFound();
  }
  return (
    <div className="min-h-screen flex flex-col sm:max-w-[80%] w-full mx-auto px-6 space-y-4 my-4 ">
      {/* Label */}
      <span className="text-sm text-gray-500">
        Home &gt; Menu &gt; {product.category_label} &gt;{" "}
        <span className="text-gray-800 font-semibold uppercase">{name}</span>
      </span>
      <div className="flex flex-row max-sm:flex-col justify-around">
        {/* Image showcase */}
        <ImageShowcase product={product} />
        <div className="flex flex-col gap-3">
          <ProductDescriptionHeader product={product} />
          <ActionSection
            price={product.price}
            id={product.id}
            value={response}
          />
          <div className="flex flex-col gap-7 mt-3">
            <ProductQuality />
            <IngredientDetails ingredients={product.ingredients} />
          </div>
        </div>
      </div>
      {/* Reviews and comments section for product */}
      <ProductReviews product_id={product.id} />
    </div>
  );
}
