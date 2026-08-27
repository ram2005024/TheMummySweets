"use client";

import { SingleProductType } from "@/type/menu.type";
import Image from "next/image";
import { useState } from "react";

const ImageShowcase = ({ product }: { product: SingleProductType }) => {
  const images = [product.main_image, ...(product.side_images ?? [])];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <div className="w-full sm:w-[35%]">
      {/* Main Image */}
      <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl bg-muted/30">
        <Image
          src={selectedImage}
          alt={product.product_name}
          width={800}
          height={600}
          priority={selectedIndex === 0}
          className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[400px]"
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="mx-auto mt-4 flex max-w-[520px] gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => {
          const isActive = selectedIndex === index;

          return (
            <button
              key={`${image}-${index}`}
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
              <Image
                src={image}
                alt={`${product.product_name} image ${index + 1}`}
                width={90}
                height={90}
                className="h-[70px] w-[70px] object-cover sm:h-[80px] sm:w-[80px]"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageShowcase;
