"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { CreateSalesForm } from "@/components/dashboard/major-forms";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function NewSale() {
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const categoriesResponse = await getData("categories");
        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data);
        } else {
          console.error("Error fetching categories:", categoriesResponse);
          setError("Error fetching categories");
        }

        const unitsResponse = await getData("units");
        if (unitsResponse?.data) {
          setUnits(unitsResponse.data);
        } else {
          console.error("Error fetching units:", unitsResponse);
          setError("Error fetching units");
        }
      } catch (error) {
        console.error("General data fetching error:", error);
        setError("General data fetching error");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      {/* Form Header */}
      <FormHeader title={"New Sale"} />
      {/* Form */}
      <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <CreateSalesForm fetching={fetching} categories={categories} units={units} />
      </div>
    </div>
  );
}
