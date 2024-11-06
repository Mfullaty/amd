"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import FormHeader from "@/components/dashboard/FormHeader";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewCategory({ isUpdate, initialValues }) {
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
    console.log(data);
    // Use different API endpoints and methods for create and update
    if (isUpdate) {
      // Handle update logic
      makePutRequest(
        setLoading,
        `categories/${initialValues.id}`,
        data,
        "Category",
        reset
      );
    } else {
      // Handle create logic
      makePostRequest(setLoading, "categories", data, "Category", reset);
    }
  }
  return (
    <div>
      {/* Form Header */}
      <FormHeader title={isUpdate ? "Update Category" : "New Category"} />
      {/* Form */}
      <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Title */}
            <TextInput
              label={"Category Title"}
              name={"title"}
              register={register}
              errors={errors}
            />

            {/* Description */}
            <TextareaInput
              label={"Category Description"}
              name={"description"}
              register={register}
              isRequired={false}
              errors={errors}
            />

            {/* Added By */}
            {/* Added by */}
            <input type="hidden" name="added_by" {...register('added_by')} value={userName} />
          </div>
          {/* Submit Button */}
          <SubmitButton
            isLoading={loading}
            title={isUpdate ? "Updated Category" : "New Category"}
          />
        </form>
      </div>
    </div>
  );
}
