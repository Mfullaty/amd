"use client";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

export default function TextInput({
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
      <Label htmlFor="name">{label}</Label>

      <div className="mt-2">
        <Input
          {...register(`${name}`, { required: isRequired })}
          type={type}
          name={name}
          autoComplete={name}
          id={name}
          className="w-full"
          placeholder={`Type the ${label.toLowerCase()}`}
        />
        {errors[`${name}`] && (
          <span className="text-sm text-red-600 ">{label} is required</span>
        )}
      </div>
    </div>
  );
}
