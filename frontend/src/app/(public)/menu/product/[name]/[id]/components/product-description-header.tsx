"use client";

import { SingleProductType } from "@/type/menu.type";
import { Clock, Star } from "lucide-react";

const ProductDescriptionHeader = ({
  product,
}: {
  product: SingleProductType;
}) => {
  const hasDiscount = product.discount_percentage > 0;

  const originalPrice = product.price;
  const finalPrice = hasDiscount ? product.total_amount : product.price;

  return (
    <div className="space-y-5">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          {product.category_label}
        </span>

        {product.is_best_seller && (
          <span className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">
            🔥 Bestseller
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground">
        {product.product_name}
      </h1>

      {/* Rating + Preparation */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Star
            className="h-4 w-4 fill-amber-400 text-amber-400"
            strokeWidth={1.5}
          />

          <span className="font-medium text-foreground">
            {product.rating.toFixed(1)}
          </span>

          <span>({product.review_count} reviews)</span>
        </div>

        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" strokeWidth={1.7} />

          <span>Ready in {product.average_preparation_time} min</span>
        </div>
      </div>

      {/* Description */}
      <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-[17px]">
        {product.product_description}
      </p>

      {/* Price */}
      <div className="pt-1">
        <div className="flex flex-wrap items-baseline gap-3">
          {/* Final / Selling Price */}
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
            Rs. {finalPrice.toFixed(2)}
          </span>

          {/* Original Price + Discount */}
          {hasDiscount && (
            <>
              <span className="font-mono text-base font-medium text-muted-foreground line-through">
                Rs. {originalPrice.toFixed(2)}
              </span>

              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                -{product.discount_percentage}%
              </span>
            </>
          )}
        </div>

        {/* Availability */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              product.is_available ? "animate-pulse bg-green-500" : "bg-red-500"
            }`}
          />

          <span
            className={`text-sm font-medium ${
              product.is_available ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.is_available ? "Available today" : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionHeader;
