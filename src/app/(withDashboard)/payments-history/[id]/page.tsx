"use client"; // 👈 turns into Client Component

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PaymentHistoryByIdPage from "@/components/pages/private/PaymentHistoryPage/PaymentHistoryByIdPage/PaymentHistoryByIdPage";

type Payment = {
  _id: string;
  memberId: string;
  memberName: string;
  monthlySubscriptionFee: number;
  finesPenalty: number;
  periodicalDeposit: number;
  othersAmount: number;
  othersComment?: string;
  totalAmount: number;
  dateOfDeposit: string;
};

export default function PaymentHistoryPageClient() {
  const { id } = useParams();
  const [payments, setPayments] = useState<Payment[] | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://103.132.96.187/api/payment/payment-history/${id}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setPayments(data.payments || []));
  }, [id]);

  if (!id || payments === null) return <div>Loading...</div>;

  return <PaymentHistoryByIdPage id={id as string} payments={payments} />;
}
