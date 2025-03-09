import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "sonner";
import MagicButton from "./ui/MagicButton";
import AppIcon from "./dashboard/AppIcon";

const FlutterwavePayment = ({
  amount,
  currency,
  email,
  phone,
  name,
  userId,
  itemId,
  added_by,
  paymentReason = "Design",
}) => {
  const ref = `FSN_${crypto.randomUUID() + Date.now()}`;

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: ref,
    amount,
    currency,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email,
      phone_number: phone,
      name,
    },
    customizations: {
      title: "AREWA FASHION",
      description: `Payment For ${paymentReason}`,
      logo: "logo.png",
    },
  };

  const fwConfig = {
    ...config,
    text: `Pay For ${paymentReason}`,
    callback: async (response) => {
      console.log(response);
      // Save the transaction to the database here
      if (response.status === "successful") {
        try {
          const res = await fetch("/api/payments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price_paid: amount,
              price_remain: 0, // Assuming full payment
              itemId,
              userId,
              added_by,
              orderId: response.tx_ref, // Include tx_ref as orderId
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to save payment to database");
          }

          const data = await res.json();
          console.log("Payment saved to database successfully", data);
          toast.success("Thanks For your Payment!");
        } catch (error) {
          console.error("Failed to save payment to database:", error);
          toast.error("Something Went Wrong, try again!");
        }
      }
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <div className="mb-8 md:mb-6">

      <MagicButton
        title={<FlutterWaveButton className="w-full h-full" {...fwConfig} />}
        icon={<AppIcon icon="CreditCard" className="w-4" />}
      />
    </div>
  );
};

export default FlutterwavePayment;
