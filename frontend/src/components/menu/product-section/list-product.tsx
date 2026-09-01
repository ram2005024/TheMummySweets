"use client";

import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";
import { MenuProduct } from "@/type/menu.type";
import { Clock3, Heart, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "./../../../utils/slugify";

const ListProducts = () => {
  const { data } = useGetMenuProducts();

  const products: MenuProduct[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const router = useRouter();

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((item) => (
        <article
          key={item.id}
          className="group overflow-hidden rounded-2xl border border-[#eadfd4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#e8cbb4] hover:shadow-[0_18px_45px_-20px_rgba(130,70,25,0.28)]"
        >
          {/* ── IMAGE ── */}
          <div
            onClick={() =>
              router.push(
                `/menu/product/${slugify(item.product_name)}/${item.id}`,
              )
            }
            className="relative aspect-4/3 overflow-hidden bg-[#f7eee5] cursor-pointer"
          >
            {/* use thumbnail for cards — small + fast */}
            <Image
              src={item.main_image.medium}
              alt={item.product_name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />

            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent opacity-70" />

            {item.is_best_seller && (
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#b95f16] shadow-sm backdrop-blur-sm">
                Bestseller
              </span>
            )}

            {item.discount_percentage > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-[#8b1a1a] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                -{item.discount_percentage}%
              </span>
            )}

            <button
              type="button"
              aria-label={`Add ${item.product_name} to wishlist`}
              className="absolute bottom-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#5f5047] shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#d9534f] hover:shadow-md"
            >
              <Heart size={17} strokeWidth={1.8} />
            </button>
          </div>

          {/* ── CONTENT ── */}
          <div className="p-5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#d87520]">
              {item.category_label}
            </p>

            <h3 className="line-clamp-1 text-[18px] font-semibold tracking-[-0.02em] text-[#2d1b12]">
              {item.product_name}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-10 text-[12px] leading-5 text-[#8b7a6e]">
              {item.product_description}
            </p>

            {/* ── META ── */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 rounded-full bg-[#fff5df] px-2 py-1">
                  <Star
                    size={13}
                    fill="currentColor"
                    strokeWidth={1.5}
                    className="text-[#e7a528]"
                  />
                  <span className="text-[11px] font-semibold text-[#5d493b]">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[11px] text-[#a2948b]">
                  ({item.review_count})
                </span>
              </div>

              <span className="h-3.5 w-px bg-[#e7ddd4]" />

              <div className="flex items-center gap-1.5 text-[11px] text-[#8c7d73]">
                <Clock3 size={14} strokeWidth={1.7} />
                <span>{item.average_preparation_time} min</span>
              </div>
            </div>

            {/* ── BOTTOM ── */}
            <div className="mt-5 flex items-end justify-between gap-3">
              <div className="leading-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-[19px] font-bold tracking-[-0.02em] text-[#2b1710]">
                    Rs. {item.total_amount}
                  </span>
                  {item.discount_percentage > 0 && (
                    <span className="text-[11px] text-[#a99a91] line-through">
                      Rs. {item.price}
                    </span>
                  )}
                </div>
                {item.discount_percentage > 0 && (
                  <p className="mt-1.5 text-[9px] font-medium text-[#4b9b5d]">
                    You save{" "}
                    {Math.round(Number(item.price) - Number(item.total_amount))}{" "}
                    Rs.
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label={`Add ${item.product_name} to cart`}
                className="group/add flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#e8832a] px-4 text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#d8731d] hover:shadow-[0_7px_18px_-8px_rgba(232,131,42,0.7)] active:scale-95"
              >
                <Plus
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 group-hover/add:rotate-90"
                />
                <span>Add</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ListProducts;
