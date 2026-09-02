import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateProduct } from "@/hooks/admin/useProductMutation";
import { useGetMenuCategories } from "@/hooks/menu/useMenuItems";
import queryClient from "@/libs/queryClient";
import {
  ProductFormValues,
  productSchema,
} from "@/schemas/admin/ProductSchema";
import { useProductStore } from "@/store/product_store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Plus, X } from "lucide-react";
import {
  Controller,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { MainImageUpload } from "./main-image-upload";
import { SideImagesGrid } from "./side-images-grid";

export function AddProductForm() {
  const { mainImage, sideImages, resetImages } = useProductStore();
  const { data: categories, isLoading: categoriesLoading } =
    useGetMenuCategories();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      is_available: true,
      grouped_unit: "na",
      grouped_quantity: 0,
      category_ids: [],
      ingredients: [],
    },
  });

  // safe for React Compiler — no stale closures
  const watchedUnit = useWatch({ control, name: "grouped_unit" }) ?? "na";
  const watchedCategoryIds = useWatch({ control, name: "category_ids" }) ?? [];

  // ingredients is now { value: string }[] — useFieldArray works perfectly
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const { mutate: createProduct, isPending } = useCreateProduct(() => {
    toast.success("Product created successfully");
    reset();
    resetImages();
  });

  function onSubmit(formData: ProductFormValues) {
    // ── image guards ──
    if (!mainImage?.imageResponse) {
      toast.error("Please upload a main image first");
      return;
    }
    if ((mainImage.status as string) !== "done") {
      toast.error("Please wait for the main image to finish uploading");
      return;
    }
    if (sideImages.some((s) => s.status === "uploading")) {
      toast.warning("Please wait for all images to finish uploading");
      return;
    }
    if (sideImages.some((s) => s.status === "error")) {
      toast.error("Some side images failed. Remove and re-upload them.");
      return;
    }

    // map ingredients { value: string }[] → string[] for the backend
    createProduct(
      {
        product_name: formData.product_name,
        product_description: formData.product_description,
        category_label: formData.category_label,
        category_ids: formData.category_ids,
        price: formData.price,
        discount_percentage: formData.discount_percentage,
        average_preparation_time: formData.average_preparation_time,
        stock_quantity: formData.stock_quantity,
        grouped_unit: formData.grouped_unit,
        grouped_quantity: formData.grouped_quantity,
        ingredients: formData.ingredients.map((i) => i.value),
        main_image: mainImage.imageResponse,
        side_images: sideImages
          .filter((s) => s.status === "done" && s.imageResponse)
          .map((s) => s.imageResponse!),
      },
      {
        onError: (err) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Something went wrong",
          );
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["menu-products"] });
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6 p-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Upload images first, then fill in product details
        </p>
      </div>

      {/* ── Images ── */}
      <MainImageUpload />
      <SideImagesGrid />

      {/* ── Product Name ── */}
      <div className="space-y-1.5">
        <Label>Product Name</Label>
        <Input
          {...register("product_name")}
          placeholder="e.g. Grilled Chicken Burger"
        />
        {errors.product_name && (
          <p className="text-xs text-red-500">{errors.product_name.message}</p>
        )}
      </div>

      {/* ── Description ── */}
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          {...register("product_description")}
          placeholder="Describe the product..."
          className="resize-none"
          rows={3}
        />
        {errors.product_description && (
          <p className="text-xs text-red-500">
            {errors.product_description.message}
          </p>
        )}
      </div>

      {/* ── Categories ── */}
      <div className="space-y-1.5">
        <Label>Categories</Label>
        <p className="text-xs text-muted-foreground">
          Select one or more categories
        </p>

        {categoriesLoading ? (
          <p className="text-xs text-muted-foreground">Loading categories...</p>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 border border-zinc-200 rounded-xl">
            {categories?.data.map((cat) => {
              const isChecked = watchedCategoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue("category_ids", [
                          ...watchedCategoryIds,
                          cat.id,
                        ]);
                        // auto-fill label from first selected category
                        if (watchedCategoryIds.length === 0) {
                          setValue("category_label", cat.category_name);
                        }
                      } else {
                        setValue(
                          "category_ids",
                          watchedCategoryIds.filter((id) => id !== cat.id),
                        );
                      }
                    }}
                  />
                  <span className="text-sm">{cat.category_name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.product_count})
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {errors.category_ids && (
          <p className="text-xs text-red-500">{errors.category_ids.message}</p>
        )}
      </div>

      {/* ── Category Label ── */}
      <div className="space-y-1.5">
        <Label>Category Label</Label>
        <Input {...register("category_label")} placeholder="e.g. Mains" />
        {errors.category_label && (
          <p className="text-xs text-red-500">
            {errors.category_label.message}
          </p>
        )}
      </div>

      {/* ── Price + Discount ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Price</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Discount %</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0"
            {...register("discount_percentage", { valueAsNumber: true })}
          />
          {errors.discount_percentage && (
            <p className="text-xs text-red-500">
              {errors.discount_percentage.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Prep Time + Stock ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Avg. Prep Time (mins)</Label>
          <Input
            type="number"
            placeholder="15"
            {...register("average_preparation_time", { valueAsNumber: true })}
          />
          {errors.average_preparation_time && (
            <p className="text-xs text-red-500">
              {errors.average_preparation_time.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Stock Quantity</Label>
          <Input
            type="number"
            placeholder="0"
            {...register("stock_quantity", { valueAsNumber: true })}
          />
          {errors.stock_quantity && (
            <p className="text-xs text-red-500">
              {errors.stock_quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Grouped Unit + Quantity ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Grouped Unit</Label>
          <Controller
            control={control}
            name="grouped_unit"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="na">N/A</SelectItem>
                  <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                  <SelectItem value="ml">Millilitres (ml)</SelectItem>
                  <SelectItem value="ltr">Litres (ltr)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* only show when unit is not na — matches backend CheckConstraint */}
        {watchedUnit !== "na" && (
          <div className="space-y-1.5">
            <Label>Grouped Quantity</Label>
            <Input
              type="number"
              placeholder="0"
              {...register("grouped_quantity", { valueAsNumber: true })}
            />
            {errors.grouped_quantity && (
              <p className="text-xs text-red-500">
                {errors.grouped_quantity.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Ingredients ── */}
      <div className="space-y-2">
        <Label>Ingredients</Label>
        <div className="flex flex-wrap gap-2">
          {ingredientFields.map((field, index) => (
            <Badge key={field.id} variant="secondary" className="gap-1 pr-1">
              <input
                {...register(`ingredients.${index}.value`)}
                className="bg-transparent border-none outline-none text-xs w-20"
                placeholder="e.g. Salt"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-xs"
            onClick={() => appendIngredient({ value: "" })}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        {errors.ingredients && (
          <p className="text-xs text-red-500">
            Check ingredient fields — none can be empty
          </p>
        )}
      </div>

      {/* ── Availability ── */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
        <div>
          <p className="text-sm font-medium">Available on Menu</p>
          <p className="text-xs text-muted-foreground">
            Customers can see and order this product
          </p>
        </div>
        <Controller
          control={control}
          name="is_available"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      {/* ── Submit ── */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating product..." : "Create Product"}
      </Button>
    </form>
  );
}
