import { serverAPI } from "@/libs/server_api";
import { SingleProductType } from "@/type/menu.type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const product = response?.data;
  if (!product) {
    return notFound();
  }
  return (
    <div className="min-h-screen flex flex-col sm:max-w-[80%] w-full mx-auto px-6 space-y-4 my-4 ">
      {/* Label */}
      <span className="text-sm text-gray-500">
        Home &gt; Menu &gt; {product.category_label} &gt;{" "}
        <span className="text-gray-800">{name}</span>
      </span>
      {/* Product Client showcase */}
    </div>
  );
}
