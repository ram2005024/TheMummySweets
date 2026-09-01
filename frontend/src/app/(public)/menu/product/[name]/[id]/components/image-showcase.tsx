"use client";

import { ImageResponse } from "@/type/admin/product.type";
import { SingleProductType } from "@/type/menu.type";
import { useState } from "react";

const ImageShowcase = ({ product }: { product: SingleProductType }) => {
  // combine main + side into one flat array
  const images: ImageResponse[] = [
    product.main_image,
    ...(product.side_images ?? []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex];

  return (
    <div className="w-full sm:w-[35%]">
      {/* ── Main display — use original for full quality ── */}
      <div className="relative mx-auto w-full max-w-130 overflow-hidden rounded-2xl bg-muted/30">
        <img
          src={selected.original}
          alt={product.product_name}
          width={800}
          height={600}
          className="h-70 w-full object-cover sm:h-90 lg:h-100"
        />

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnails — use thumbnail for small previews ── */}
      <div className="mx-auto mt-4 flex max-w-130 gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => {
          const isActive = selectedIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                isActive
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {/* use thumbnail for small grid previews — fast load */}
              <img
                src={image.thumbnail}
                alt={`${product.product_name} ${index + 1}`}
                className="h-17.5 w-17.5 object-cover sm:h-20 sm:w-20"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageShowcase;
