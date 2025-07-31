"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------- Type Definitions ----------
type ArchivePayment = {
  name: string;
  username: string;
  total_deposit: number; // Added from JSON
  periodical_deposits: { [description: string]: number };
  yearly_payments: { [year: string]: number };
  total_monthly_subscriptions: number; // Added from JSON
};

type Props = {
  username: string;
};

const ArchivePaymentSummaryByYear: React.FC<Props> = ({ username }) => {
  // State now holds a single ArchivePayment object or null
  const [archivePayment, setArchivePayment] = useState<ArchivePayment | null>(
    null
  );

  useEffect(() => {
    const fetchYearlyAnalytics = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_LINK}/archive-payment/user/${username}`
        );

        const json = await res.json(); // <-- Read JSON once

        if (!res.ok) {
          toast.error(json.message || "Failed to fetch yearly payment data.");
          return;
        }

        const data: ArchivePayment = json;
        setArchivePayment(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching data."
        );
      }
    };

    fetchYearlyAnalytics();
  }, [username]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Archived Yearly Payments
        </h3>
        {archivePayment ? (
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader className="bg-red-900/90">
                <TableRow className="rounded-t-3xl">
                  <TableHead className="text-white font-medium text-base">
                    Year
                  </TableHead>
                  <TableHead className="text-right text-white font-medium text-base">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(archivePayment.yearly_payments).map(
                  ([year, amount]) => (
                    <TableRow
                      key={year}
                      className="hover:bg-red-500/10 bg-red-900/50"
                    >
                      <TableCell className="font-medium text-base">
                        {year}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base">
                        {amount}
                        &#2547;
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>Data not found!</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Archived Periodical Deposit
        </h3>
        {archivePayment ? (
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader className="bg-red-900/90">
                <TableRow className="rounded-t-3xl">
                  <TableHead className="text-white font-medium text-base">
                    Year
                  </TableHead>
                  <TableHead className="text-right text-white font-medium text-base">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(archivePayment.periodical_deposits).map(
                  ([period, amount]) => (
                    <TableRow
                      key={period}
                      className="hover:bg-red-500/10 bg-red-900/50"
                    >
                      <TableCell className="font-medium text-base">
                        {period}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base">
                        {amount}
                        &#2547;
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>Data not found!</p>
        )}
      </div>
    </div>
  );
};

export default ArchivePaymentSummaryByYear;
