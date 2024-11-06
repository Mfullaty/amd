"use client"
import React, { useState, useEffect } from "react";
import { getData } from "@/lib/getData";
import FormHeader from "@/components/dashboard/FormHeader";
import { CreateExpenseForm } from "@/components/dashboard/major-forms";

export default function NewExpense({ isUpdate, initialValues }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const paymentMethodsData = await getData("payment-methods");
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        setError("Error fetching payment methods");
      }finally{
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <FormHeader title="New Expense" />

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      <div className="w-full max-w-4xl mx-auto p-4 my-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <CreateExpenseForm
          paymentMethods={paymentMethods}
          initialValues={initialValues}
          isUpdate={isUpdate}
          fetching={fetching}
        />
      </div>
    </div>
  );
}
