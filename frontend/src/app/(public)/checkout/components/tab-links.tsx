"use client";

import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/store/checkout.store";
import { BookAudio, Check, Clock, IdCardIcon, MapPin } from "lucide-react";
import { FaGreaterThan } from "react-icons/fa";

const TabLinks = () => {
  const { activeLink } = useCheckoutStore();

  const links = [
    { name: "Delivery", tabCount: 1, icon: MapPin },
    { name: "Timing", tabCount: 2, icon: Clock },
    { name: "Payment", tabCount: 3, icon: IdCardIcon },
    { name: "Review", tabCount: 4, icon: BookAudio },
  ];

  return (
    <div className="flex max-sm:items-center sm:gap-2">
      {links.map((item) => {
        const isActive = activeLink === item.tabCount;
        const isCompleted = activeLink > item.tabCount;

        return (
          <div className="flex items-center mt-3" key={item.tabCount}>
            <span
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-xs rounded-full transition-colors max-sm:px-2  max-sm:text-[10px]",
                isCompleted && "bg-success text-white",
                isActive && "bg-orange-500 text-white",
                !isActive && !isCompleted && "bg-muted text-gray-600",
              )}
            >
              {isCompleted ? (
                <Check className="size-4 max-sm:size-2" />
              ) : (
                <item.icon className="size-4 max-sm:size-2" />
              )}
              <span>{item.name}</span>
            </span>

            {item.tabCount !== links.length && (
              <FaGreaterThan className="size-2 stroke-1 text-gray-400 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabLinks;
