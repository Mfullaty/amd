"use client";
import React, { useState, useEffect } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import { getData } from "@/lib/getData";
import { CreateItemForm } from "@/components/dashboard/major-forms";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewItem({ isUpdate, initialValues }) {
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
      <FormHeader title={isUpdate ? "Update item" : "New item"} />

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <CreateItemForm
          categories={categories}
          units={units}
          initialValues={initialValues}
          isUpdate={isUpdate}
          fetching={fetching}
        />
      </div>
    </div>
  );
}
