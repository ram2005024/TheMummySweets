import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct } from "./api/product.api";
import { MainImageUpload } from "./components/MainImageUpload";
import { SideImagesGrid } from "./components/SideImagesGrid";
import { ProductFormValues, productSchema } from "./schema/product.schema";
import { useProductStore } from "./store/productStore";

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks", "Sides"];

export function AddProductForm() {
  const { mainImage, sideImages, resetImages } = useProductStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { isAvailable: true },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      reset();
      resetImages();
    },
    onError: () => {
      toast.error("Failed to create product. Please try again.");
    },
  });

  function onSubmit(formData: ProductFormValues) {
    // ─── Validate images separately (not in Zod, they live in Zustand) ───
    if (!mainImage || mainImage.status !== "done") {
      toast.error("Please upload a main image first");
      return;
    }

    const hasFailedSideImages = sideImages.some(
      (img) => img.status === "error",
    );
    if (hasFailedSideImages) {
      toast.error("Some side images failed. Please remove and re-upload them.");
      return;
    }

    const stillUploading =
      mainImage.status === "uploading" ||
      sideImages.some((img) => img.status === "uploading");
    if (stillUploading) {
      toast.warning("Please wait for all images to finish uploading");
      return;
    }

    // ─── Merge form data + image URLs ───
    mutate({
      ...formData,
      mainImage: mainImage.url!,
      sideImages: sideImages
        .filter((img) => img.status === "done" && img.url)
        .map((img) => img.url!),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-6 p-6"
    >
      <div>
        <h1 className="text-xl font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details and upload images
        </p>
      </div>

      {/* ── Images ── */}
      <MainImageUpload />
      <SideImagesGrid />

      {/* ── Product Name ── */}
      <div className="space-y-1.5">
        <Label>Product Name</Label>
        <Input
          {...register("name")}
          placeholder="e.g. Grilled Chicken Burger"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* ── Description ── */}
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Describe the product..."
          className="resize-none"
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* ── Price + Prep Time ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Price ($)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Prep Time (mins)</Label>
          <Input
            type="number"
            {...register("prepTime", { valueAsNumber: true })}
            placeholder="15"
          />
          {errors.prepTime && (
            <p className="text-xs text-red-500">{errors.prepTime.message}</p>
          )}
        </div>
      </div>

      {/* ── Category ── */}
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select onValueChange={(val) => setValue("category", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* ── Availability Toggle ── */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
        <div>
          <p className="text-sm font-medium">Available</p>
          <p className="text-xs text-muted-foreground">
            Show this product on the menu
          </p>
        </div>
        <Switch
          checked={watch("isAvailable")}
          onCheckedChange={(val) => setValue("isAvailable", val)}
        />
      </div>

      {/* ── Submit ── */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating product..." : "Create Product"}
      </Button>
    </form>
  );
}
