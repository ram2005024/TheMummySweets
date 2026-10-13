"use client";

import { PackageOpen } from "lucide-react";

const NoProductToShow = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <PackageOpen className="w-12 h-12 text-muted-foreground" />
      <h2 className="text-lg font-semibold">No products available</h2>
      <p className="text-sm text-muted-foreground">
        Please check back later or try another category.
      </p>
    </div>
  );
};

export default NoProductToShow;
