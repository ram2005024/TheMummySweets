import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#eadfd4] bg-white">
      {/* ================= IMAGE ================= */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* ================= CONTENT ================= */}
      <div className="p-5">
        {/* Category */}
        <Skeleton className="mb-2 h-3 w-20" />

        {/* Product name */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="mt-3 min-h-[40px] space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* ================= META ================= */}
        <div className="mt-4 flex items-center gap-4">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-14 rounded-full" />

            <Skeleton className="h-3 w-7" />
          </div>

          {/* Divider */}
          <span className="h-3.5 w-px bg-[#e7ddd4]" />

          {/* Preparation time */}
          <Skeleton className="h-4 w-16" />
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-5 flex items-end justify-between gap-3">
          {/* Price */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-2.5 w-20" />
          </div>

          {/* Add button */}
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
