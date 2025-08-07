"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface FinancialSummaryProps {
  username: string;
  name: string;
  totalDeposit: number;
  totalAmountPaid: number;
  combinedTotal: number;
}

const LifetimePayment = ({ username }: { username: string }) => {
  const [paymentData, setPaymentData] = useState<FinancialSummaryProps | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/archive-payment/lifetime/${username}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPaymentData(data);
      } catch (err: any) {
        toast.error(err.message || "Something went wrong with lifetime Amount");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  if (loading || !paymentData) return <div>Loading...</div>;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const { name, username: memberId, combinedTotal } = paymentData;
  return (
    <div className="w-full p-4 my-6 mx-auto bg-green-100 rounded-2xl shadow flex justify-between items-center">
      <div>
        <div className="text-2xl font-bold text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">@{memberId}</div>
      </div>
      <div className="text-right">
        <div className="text-lg text-gray-600 font-semibold">
          Total Individual Asset
        </div>
        <div className="text-2xl font-extrabold text-green-600">
          {formatCurrency(combinedTotal)}
        </div>
      </div>
    </div>
  );
};

export default LifetimePayment;
