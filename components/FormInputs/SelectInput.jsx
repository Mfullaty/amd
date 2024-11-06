import React from "react";

export default function SelectInput({
  label,
  name,
  register,
  divClassName = "sm:col-span-2",
  className,
  options = [],
}) {
  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className={divClassName}>
      <label
        htmlFor={name}
        className="block text-sm  leading-6 text-foreground"
      >
        {label}
      </label>
      <div className="mt-2">
        <select
          {...register(`${name}`)}
          id={name}
          name={name}
          className={`block ${className}`}
        >
          {safeOptions.map((option, i) => {
            return (
              <option key={i} value={option.id} className="p-2 border-0 outline-0">
                {option.title || option.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
