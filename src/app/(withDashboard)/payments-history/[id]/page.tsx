"use client";
import PaymentHistoryByIdPage from "@/components/pages/private/PaymentHistoryPage/PaymentHistoryByIdPage/PaymentHistoryByIdPage";
import { useParams } from "next/navigation";
import React from "react";

const PaymentHistoryByID = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <PaymentHistoryByIdPage id={id} />
    </div>
  );
};

export default PaymentHistoryByID;
