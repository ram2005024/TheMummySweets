"use client";

import { ChefHat, ShieldCheck, Truck } from "lucide-react";

const ProductQuality = () => {
  const features = [
    { icon: ChefHat, text: "Fresh today" },
    { icon: Truck, text: "25–35 min" },
    { icon: ShieldCheck, text: "100% Veg" }, // simplified to Veg only
  ];

  return (
    <div className="flex flex-row gap-4 sm:gap-6">
      {features.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-3 text-center shadow-sm"
        >
          <Icon className="size-4 text-primary mb-2" />
          <p className="text-xs text-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductQuality;
