"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ImageInput from "@/components/dashboard/ImageInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SelectInput from "../FormInputs/SelectInput";
import { Skeleton } from "../ui/skeleton";

export default function CreateItemForm({
  categories,
  units,
  isUpdate,
  initialValues,
  fetching = true
}) {
  const [imageUrls, setImageUrls] = useState(
    initialValues && initialValues.imageUrls ? initialValues.imageUrls : []
  );

  const handleUpload = (result) => {
    let uploadedUrls = [];
    if (Array.isArray(result.info)) {
      uploadedUrls = result.info.map((info) => info.secure_url);
    } else {
      uploadedUrls = [result.info.secure_url];
    }
    setImageUrls((prevImageUrls) => [...prevImageUrls, ...uploadedUrls]);
  };

  const { data: session } = useSession();
  const userName = session?.user?.name;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues }); // Pass initial values when in update mode
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    data.imageUrls = imageUrls;

    if (isUpdate) {
      // Handle update logic
      makePutRequest(
        setLoading,
        `items/${initialValues.id}`,
        data,
        "Item",
        reset
      );
    } else {
      // Handle create logic
      makePostRequest(setLoading, "items", data, "Item", reset);
      setImageUrls([]);
    }
  }

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Categories */}
          {/* Title */}
          <TextInput
            className="col-span-2"
            label={"Item Title"}
            name={"title"}
            register={register}
            errors={errors}
          />
          {/* Quantity */}
          <TextInput
            className="w-full"
            label={"Item Quantity"}
            name={"quantity"}
            register={register}
            errors={errors}
            type="number"
            isRequired={false}
          />

          {/* Price */}
          <TextInput
            className="w-full"
            label={"Item Price"}
            name={"price"}
            register={register}
            errors={errors}
            isRequired={false}
            type="number"
          />

          <div className="flex flex-col md:flex-row justify-center md:justify-between flex-wrap gap-3  col-span-2">
            {fetching ? (
              <>
                <Skeleton className="w-full md:w-14 h-8 bg-muted-foreground" />
                <Skeleton className="w-full md:w-14 h-8 bg-muted-foreground" />
              </>
            ) : (
              <>
                {/* Category */}
                <SelectInput
                  className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
                  label={"Select Category"}
                  name={"categoryId"}
                  register={register}
                  options={categories}
                />
                {/* Item Unit */}
                <SelectInput
                  className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
                  label={"Select Item Unit"}
                  name={"unitId"}
                  register={register}
                  options={units}
                />
              </>
            )}
          </div>
        </div>
        {/* ADDITIONAL DETAILS CARD */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Add additional details (optional)</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="grid gap-6">
              {/* Notes */}
              <TextareaInput
                label={"Additional Notes"}
                name={"notes"}
                register={register}
                isRequired={false}
                errors={errors}
              />
            </div>
            <ImageInput
              className="w-full"
              label={"Upload Item Images (Optional)"}
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              handleUpload={handleUpload}
              resource="items"
              resourceId={initialValues?.id} // Pass the itemId here
            />
          </CardContent>
        </Card>
        {/* Added by */}
        <input
          type="hidden"
          name="added_by"
          {...register("added_by")}
          value={userName}
        />
        {/* Submit Button */}
        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Update Item" : "New Item"}
        />
      </form>
    </div>
  );
}
