"use client";
import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ImageInput from "@/components/dashboard/ImageInput";
import { makePostRequest } from "@/lib/apiRequest";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "../ui/skeleton";

export default function CreateSalesForm({ categories, units, fetching = true }) {
  const { data: session } = useSession();
  const userName = session?.user?.name;
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleUpload = (result) => {
    let uploadedUrls = [];
    if (Array.isArray(result.info)) {
      uploadedUrls = result.info.map((info) => info.secure_url);
    } else {
      uploadedUrls = [result.info.secure_url];
    }
    setImageUrls((prevImageUrls) => [...prevImageUrls, ...uploadedUrls]);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    data.imageUrls = imageUrls;
    console.log(data);
    makePostRequest(setLoading, "sales", data, "Sale", reset);
    setImageUrls([]);
  }

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {fetching ? (
            <>
            <Skeleton className="w-full  my-2 md:w-14 h-8 bg-muted-foreground" />
            <Skeleton className="w-full  my-2 md:w-14 h-8 bg-muted-foreground" />
            </>
          ) : (
            <>
              <SelectInput
                className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
                label={"Select Category"}
                name={"categoryId"}
                register={register}
                options={categories}
              />
              <SelectInput
                className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
                label={"Select Selling Item Unit"}
                name={"unitId"}
                register={register}
                options={units}
              />
            </>
          )}

          {/* Title */}
          <TextInput
            className="w-full"
            label={"Selling Item Title"}
            name={"title"}
            register={register}
            errors={errors}
          />

          {/* Quantity */}
          <TextInput
            className="w-full"
            label={"Selling Item Quantity"}
            name={"quantity"}
            register={register}
            errors={errors}
            type="number"
            isRequired={false}
          />

          {/* Price */}
          <TextInput
            className="w-full"
            label={"Selling Item Price"}
            name={"price"}
            register={register}
            errors={errors}
            isRequired={false}
            type="number"
          />
          {/* Notes */}
          <TextareaInput
            label={"Additional Notes"}
            name={"notes"}
            register={register}
            isRequired={false}
            errors={errors}
          />
          <ImageInput
            className="w-full"
            label={"Upload Images (Optional)"}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            handleUpload={handleUpload}
          />
          {/* Added by */}
          <input
            type="hidden"
            name="added_by"
            {...register("added_by")}
            value={userName}
          />
        </div>
        {/* Submit Button */}
        <SubmitButton isLoading={loading} title={"Sale"} />
      </form>
    </div>
  );
}
