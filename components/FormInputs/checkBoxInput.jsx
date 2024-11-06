import React from "react";
import { useFieldArray } from "react-hook-form";

const CheckBoxInput = ({ label, name=[], ...rest }) => {
  const [field, meta] = useFieldArray(name);

  return (
    <div className="flex items-start mb-4"> {/* Adjust margin as needed */} 
      <input
        {...field}
        {...rest}
        type="checkbox"
        className={`w-4 h-4 border border-gray-300 rounded mr-2 focus:ring-2 focus:ring-blue-500 ${field.checked && 'bg-blue-600 border-blue-600'}`}
      />
      <label className="select-none"> {/* Prevent accidental selection */}
        {label}
      </label>
      {meta.touched && meta.error && <div className="text-red-500">{meta.error}</div>}
    </div>
  );
};

export default CheckBoxInput;
