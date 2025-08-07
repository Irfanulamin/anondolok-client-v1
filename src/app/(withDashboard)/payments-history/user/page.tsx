"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PaymentHistoryByIdPage from "@/components/pages/private/PaymentHistoryPage/PaymentHistoryByIdPage/PaymentHistoryByIdPage";

export default function PaymentHistoryPageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/payment/payment-history/${id}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setPayments(data.payments || []));
  }, [id]);

  if (!id || payments === null) return <div>Loading...</div>;

  return <PaymentHistoryByIdPage id={id} payments={payments} />;
}
