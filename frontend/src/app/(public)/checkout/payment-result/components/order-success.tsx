"use client";

import gsap from "gsap";
import { CheckCircle2, Home, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
  orderId: string;
}

const OrderSuccess = ({ orderId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(containerRef.current, {
          opacity: 0,
          y: 24,
          scale: 0.98,
          duration: 0.6,
        })
        .from(
          iconRef.current,
          {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
        .from(
          checkRef.current,
          {
            scale: 0.4,
            opacity: 0,
            rotation: -15,
            duration: 0.4,
            ease: "back.out(2)",
          },
          "-=0.25",
        )
        .from(
          contentRef.current?.children ?? [],
          {
            opacity: 0,
            y: 14,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.15",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-130 w-full items-center justify-center px-4 py-10">
      <div
        ref={containerRef}
        className="surface-card w-full max-w-lg overflow-hidden"
      >
        <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
          <div
            ref={iconRef}
            className="flex size-16 items-center justify-center rounded-full bg-primary/10"
          >
            <CheckCircle2
              ref={checkRef}
              className="size-9 text-primary"
              strokeWidth={2}
            />
          </div>

          <div ref={contentRef} className="w-full">
            <h1 className="mt-6 text-2xl font-semibold text-ink">
              Order placed successfully!
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              Thank you for ordering from The Mummy Sweets &amp; Corner. Your
              payment has been confirmed and we&apos;re preparing your order.
            </p>

            <div className="mt-7 w-full rounded-xl border border-border bg-muted/40 px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Package className="size-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-ink-muted">Order reference</p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-ink">
                    {orderId}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push(`order/${orderId}`)}
                className="gradient-warm flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-warm-sm transition hover:-translate-y-0.5 hover:shadow-warm"
              >
                <Package className="size-4" />
                View order
              </button>

              <button
                type="button"
                onClick={() => router.push("/menu")}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-ink transition hover:bg-muted"
              >
                <Home className="size-4" />
                Continue shopping
              </button>
            </div>

            <p className="mt-6 text-xs text-ink-muted">
              We&apos;ll keep you updated about your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
