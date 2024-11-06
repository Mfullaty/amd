"use client";
import React, { useState, useEffect } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import { getData } from "@/lib/getData";
import { CreateCustomerForm } from "@/components/dashboard/major-forms";

export default function NewCustomer({ isUpdate, initialValues }) {
  const [customers, setCustomers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const customersData = await getData("users");
        setCustomers(customersData);

        const itemsResponse = await getData("items");
        if (itemsResponse?.data) {
          setItems(itemsResponse.data);
        } else {
          console.error("Error fetching items:", itemsResponse);
          setError("Error fetching items");
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
      <FormHeader title={isUpdate ? "Update Customer" : "New Customer"} />

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Form */}
      <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        {isUpdate && initialValues.user?.name && (
          <h2>Update {initialValues.user.name}&apos;s Item or work</h2>
        )}
        <CreateCustomerForm
          fetching={fetching}
          customers={customers}
          items={items}
          initialValues={initialValues}
          isUpdate={isUpdate}
        />
      </div>
    </div>
  );
}
