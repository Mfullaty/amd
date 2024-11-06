"use client";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
export default function TextareaInput({
  label,
  name,
  register,
  errors,
  isRequired = true,
  type = "text",
  className = "sm:col-span-2",
}) {
  return (
    <div className={className}>
      <div className="mt-2">
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          {...register(`${name}`, { required: isRequired })}
          name={name}
          id={name}
          rows={3}
          className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-700 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          defaultValue={""}
        />

        {errors[`${name}`] && (
          <span className="text-sm text-red-600 ">{label} is required</span>
        )}
      </div>
    </div>
  );
}
