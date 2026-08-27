"use client";

import { SingleProductType } from "@/type/menu.type";
import { Clock, Star } from "lucide-react";

const ProductDescriptionHeader = ({
  product,
}: {
  product: SingleProductType;
}) => {
  return (
    <div className="space-y-5">
      {/* Tags */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          Hot
        </span>

        {product.is_best_seller && (
          <span className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">
            🔥 Bestseller
          </span>
        )}
      </div>

      {/* Product Title */}
      <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
        {product.product_name}
      </h2>

      {/* Rating + Preparation Time */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star
            className="h-4 w-4 fill-amber-400 text-amber-400"
            strokeWidth={1.5}
          />

          <span className="font-medium text-foreground">
            {product.rating.toFixed(1)}
          </span>

          <span className="text-muted-foreground">
            ({product.review_count} reviews)
          </span>
        </div>

        {/* Preparation Time */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" strokeWidth={1.7} />

          <span>Ready in {product.average_preparation_time} min</span>
        </div>
      </div>

      {/* Description */}
      <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
        {product.product_description}
      </p>

      {/* Price */}
      <div className="pt-1">
        <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
          Rs. {product.price}
        </div>

        {/* Availability */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              product.is_available ? "bg-green-500 animate-pulse" : "bg-red-500"
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
