import { Skeleton } from "@/components/ui/skeleton"; // shadcn/ui skeleton

const ProductLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Product Image */}
        <Skeleton className="h-80 w-full rounded-lg" />

        {/* Title + Rating */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>

        {/* Price + Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-7 w-28 rounded-md" />
          <Skeleton className="h-10 w-44 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>

        {/* Extra Info (tags, delivery, etc.) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProductLoading;
