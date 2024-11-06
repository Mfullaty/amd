// components/FormInputs/DateTimeInput.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { Label } from '../ui/label';

const DateTimeInput = ({ label, name, register, errors, ...rest }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="form-control w-full flex flex-col gap-2">
      <Label htmlFor={name}>
        {label}
      </Label>
      <DatePicker
        // {...register(`${name}`)}
        selected={selectedDate}
        valueAsDate={true}
        // onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        dateFormat="Pp" // Example format: "dd/MM/yyy hh:mm a"
        onChange={(date) => {
          setSelectedDate(date);
          register(name, { value: date, required: true }); // Register the input with react-hook-form
        }}
        className="block w-full rounded-md border-2 border-muted py-2 bg-background text-muted-foreground shadow-sm px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:yellow-blue-600 sm:text-sm sm:leading-6"
        id={name} // Important for the label
        {...rest}
      />
      {/* Display errors if needed */}
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>} 
    </div>
  );
};

export default DateTimeInput;
