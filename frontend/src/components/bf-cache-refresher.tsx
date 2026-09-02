// components/BfcacheRefresher.tsx
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function BfcacheRefresher() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        queryClient.invalidateQueries();
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [queryClient]);

  return null;
}
