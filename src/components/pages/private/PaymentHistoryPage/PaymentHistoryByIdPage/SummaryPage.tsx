"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type YearlyPayment = {
  _id: {
    year: number;
  };
  totalAmount: number;
  totalMonthlyFees: number;
  totalFines: number;
  totalPeriodical: number;
  totalOthers: number;
};

type Props = {
  username: string;
};

const PaymentSummaryByYear: React.FC<Props> = ({ username }) => {
  const [payments, setPayments] = useState<YearlyPayment[]>([]);

  useEffect(() => {
    const fetchYearlyAnalytics = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin-payment/yearly-wise/${username}`
        );
        const data = await res.json();

        if (data.success) {
          setPayments(data.data);
        } else {
          toast.error("Failed to fetch yearly payment data.");
        }
      } catch (error) {
        toast.error("Something went wrong while fetching data.");
      }
    };

    fetchYearlyAnalytics();
  }, [username]);

  return (
    <div className="w-full my-8">
      <h2 className="text-2xl font-semibold mb-2">
        Yearly-Wise Payment Summary of{" "}
        <span className="uppercase">{username}</span>
      </h2>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader className="bg-red-900/90 rounded-2xl">
            <TableRow>
              <TableHead className="text-left text-white">Year</TableHead>

              <TableHead className="text-right text-white">
                Monthly Fees (৳)
              </TableHead>
              <TableHead className="text-right text-white">Fines (৳)</TableHead>
              <TableHead className="text-right text-white">
                Others (৳)
              </TableHead>
              <TableHead className="text-right text-white">
                Total Paid (৳)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  No payments available.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((entry, idx) => (
                <TableRow
                  key={`${entry._id.year}-${idx}`}
                  className="hover:bg-red-500/10 bg-red-900/50 rounded-2xl"
                >
                  <TableCell className="text-left font-medium">
                    {entry._id.year}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.totalMonthlyFees.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.totalFines.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.totalOthers.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-right">
                    {entry.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentSummaryByYear;
