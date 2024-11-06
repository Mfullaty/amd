"use client";
import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
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
import DateTimeInput from "../FormInputs/DateTimeInput";
import { Skeleton } from "../ui/skeleton";

export default function CreateExpenseForm({
  paymentMethods,
  isUpdate,
  initialValues,
  fetching = true,
}) {
  const { data: session } = useSession();
  const userName = session?.user?.name;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    console.log(data);

    if (isUpdate) {
      makePutRequest(
        setLoading,
        `expenses/${initialValues.id}`, // Update expense endpoint
        data,
        "Expense",
        reset
      );
    } else {
      makePostRequest(setLoading, "expenses", data, "Expense", reset);
    }
  }

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Title */}
          <TextInput
            label={"Expense Title"}
            name={"title"}
            register={register}
            errors={errors}
            isRequired={true} // Title likely required
          />

          {/* Payment Method */}
          {fetching ? (
            <Skeleton className="w-full md:w-14 h-8 bg-muted-foreground" />
          ) : (
            <SelectInput
              className="w-full border-2 border-muted bg-background placeholder:text-muted-foreground py-2 px-3 rounded-md"
              label={"Payment Method"}
              name={"paymentMethodId"}
              register={register}
              options={paymentMethods}
            />
          )}

          {/* Amount */}
          <TextInput
            className="w-full"
            label={"Total Expense Amount"}
            name={"amount"}
            register={register}
            errors={errors}
            type="number"
            isRequired={true}
          />
        </div>

        {/* Date */}
        <div className="my-6">
          <DateTimeInput
            label="Select Date"
            name="date"
            register={register}
            errors={errors}
          />
        </div>
        {/* ADDITIONAL DETAILS CARD (Likely Keep as is) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Add additional details (optional)</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="grid gap-6">
              <TextareaInput
                label={"Expense Description"}
                name={"description"}
                register={register}
                isRequired={false}
                errors={errors}
              />
            </div>
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
          title={isUpdate ? "Update Expense" : "New Expense"}
        />
      </form>
    </div>
  );
}
