"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Payment {
  _id: string;
  memberName: string;
  memberId: string;
  dateOfDeposit: string;
  monthlySubscriptionFee: number;
  finesPenalty: number;
  periodicalDeposit: number;
  othersAmount: number;
  othersComment: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface YearlySummary {
  memberId: string;
  memberName: string;
  year: number;
  totalMonthlySubscriptionFee: number;
  totalFinesPenalty: number;
  totalPeriodicalDeposit: number;
  totalOthersAmount: number;
  totalPaid: number;
}

export default function AnnualPaymentAnalysis({
  payments,
}: {
  payments: Payment[];
}) {
  const [yearlySummaries, setYearlySummaries] = useState<YearlySummary[]>([]);
  useEffect(() => {
    if (!payments || payments.length === 0) return;

    const yearlyMap = new Map<string, YearlySummary>();

    payments.forEach((payment) => {
      const year = new Date(payment.dateOfDeposit).getFullYear();
      const key = `${payment.memberId}-${year}`;

      if (!yearlyMap.has(key)) {
        yearlyMap.set(key, {
          memberId: payment.memberId,
          memberName: payment.memberName,
          year,
          totalMonthlySubscriptionFee: 0,
          totalFinesPenalty: 0,
          totalPeriodicalDeposit: 0,
          totalOthersAmount: 0,
          totalPaid: 0,
        });
      }

      const summary = yearlyMap.get(key)!;
      summary.totalMonthlySubscriptionFee +=
        payment.monthlySubscriptionFee || 0;
      summary.totalFinesPenalty += payment.finesPenalty || 0;
      summary.totalPeriodicalDeposit += payment.periodicalDeposit || 0;
      summary.totalOthersAmount += payment.othersAmount || 0;
      summary.totalPaid += payment.totalAmount || 0;
    });

    const sorted = Array.from(yearlyMap.values()).sort((a, b) => {
      if (a.memberName < b.memberName) return -1;
      if (a.memberName > b.memberName) return 1;
      return a.year - b.year;
    });

    setYearlySummaries(sorted);
  }, [payments]);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Yearly Payments Summary
      </h3>
      <div className="w-full border-none shadow-none">
        {yearlySummaries.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No data available for analysis.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader className="bg-black">
                <TableRow>
                  <TableHead className="text-left text-white text-base font-medium">
                    Member
                  </TableHead>
                  <TableHead className="text-left text-white text-base font-medium">
                    Year
                  </TableHead>
                  <TableHead className="text-right text-white text-base font-medium">
                    Monthly (৳)
                  </TableHead>
                  <TableHead className="text-right text-white text-base font-medium">
                    Fines/Penalty (৳)
                  </TableHead>
                  <TableHead className="text-right text-white text-base font-medium">
                    Periodical (৳)
                  </TableHead>
                  <TableHead className="text-right text-white text-base font-medium">
                    Others (৳)
                  </TableHead>
                  <TableHead className="text-right text-white text-base font-medium">
                    Total Paid (৳)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlySummaries.map((entry, index) => (
                  <TableRow
                    key={`${entry.memberId}-${entry.year}-${index}`}
                    className={`${
                      index % 2
                        ? "hover:bg-gray-100/10 bg-gray-200/50"
                        : "hover:bg-gray-200/10 bg-gray-300/50"
                    }`}
                  >
                    <TableCell className="font-medium text-base">
                      {entry.memberName}
                    </TableCell>
                    <TableCell className="font-medium text-base">
                      {entry.year}
                    </TableCell>
                    <TableCell className="text-right font-medium text-base">
                      {entry.totalMonthlySubscriptionFee}৳
                    </TableCell>
                    <TableCell className="text-right font-medium text-base">
                      {entry.totalFinesPenalty}৳
                    </TableCell>
                    <TableCell className="text-right font-medium text-base">
                      {entry.totalPeriodicalDeposit}৳
                    </TableCell>
                    <TableCell className="text-right font-medium text-base">
                      {entry.totalOthersAmount}৳
                    </TableCell>
                    <TableCell className="text-right font-semibold text-base">
                      {entry.totalPaid}৳
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
