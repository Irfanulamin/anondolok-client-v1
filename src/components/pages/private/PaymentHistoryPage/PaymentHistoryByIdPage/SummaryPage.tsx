"use client";

import { useState, useEffect } from "react";
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

interface Deposit {
  _id: string;
  bankBranch: string;
  bankName: string;
  createdAt: string;
  dateOfDeposit: string;
  finesPenalty: number;
  memberId: string;
  memberName: string;
  monthlySubscriptionFee: number;
  othersAmount: number;
  othersComment: string;
  periodicalDeposit: number;
  totalAmount: number;
  typeOfDeposit: string;
  updatedAt: string;
  __v: number;
}

interface AnnualPayment {
  memberId: string;
  memberName: string;
  year: number;
  totalMonthlySubscriptionFee: number;
  totalFinesPenalty: number;
  totalOthersAmount: number;
  totalPaid: number;
}

export default function AnnualPaymentAnalysis({ data }: any) {
  const [annualPayments, setAnnualPayments] = useState<AnnualPayment[]>([]);

  useEffect(() => {
    const aggregatedData = new Map<string, AnnualPayment>();

    data.forEach((deposit: any) => {
      const depositDate = new Date(deposit.dateOfDeposit);
      const year = depositDate.getFullYear();
      const key = `${deposit.memberId}-${year}`;

      if (aggregatedData.has(key)) {
        const existingEntry = aggregatedData.get(key)!;
        existingEntry.totalMonthlySubscriptionFee +=
          deposit.monthlySubscriptionFee;
        existingEntry.totalFinesPenalty += deposit.finesPenalty;
        existingEntry.totalOthersAmount += deposit.othersAmount;
        existingEntry.totalPaid += deposit.totalAmount;
        aggregatedData.set(key, existingEntry);
      } else {
        aggregatedData.set(key, {
          memberId: deposit.memberId,
          memberName: deposit.memberName,
          year: year,
          totalMonthlySubscriptionFee: deposit.monthlySubscriptionFee,
          totalFinesPenalty: deposit.finesPenalty,
          totalOthersAmount: deposit.othersAmount,
          totalPaid: deposit.totalAmount,
        });
      }
    });

    // Sort the data by member name and then by year for consistent display
    const sortedPayments = Array.from(aggregatedData.values()).sort((a, b) => {
      if (a.memberName < b.memberName) return -1;
      if (a.memberName > b.memberName) return 1;
      return a.year - b.year;
    });

    setAnnualPayments(sortedPayments);
  }, [data]);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Yearly Payments Summary
      </h3>
      <div className="w-full border-none shadow-none ">
        <div>
          {annualPayments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No data available for analysis.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader className=" bg-black">
                  <TableRow>
                    <TableHead className="text-left text-white text-base font-medium">
                      Member ID
                    </TableHead>
                    <TableHead className="text-left text-white text-base font-medium">
                      Year
                    </TableHead>
                    <TableHead className="text-right text-white text-base font-medium">
                      Monthly Subscription (৳)
                    </TableHead>
                    <TableHead className="text-right text-white text-base font-medium">
                      Fines (৳)
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
                  {annualPayments.map((payment, index) => (
                    <TableRow
                      key={`${payment.memberId}-${payment.year}-${index}`}
                      className={`${
                        index % 2
                          ? "hover:bg-gray-100/10 bg-gray-200/50"
                          : "hover:bg-gray-200/10 bg-gray-300/50"
                      }`}
                    >
                      <TableCell className="font-medium  text-base">
                        {payment.memberId}
                      </TableCell>
                      <TableCell className="font-medium  text-base">
                        {payment.year}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base">
                        {payment.totalMonthlySubscriptionFee}৳
                      </TableCell>
                      <TableCell className="text-right font-medium text-base">
                        {payment.totalFinesPenalty}৳
                      </TableCell>
                      <TableCell className="text-right font-medium text-base">
                        {payment.totalOthersAmount}৳
                      </TableCell>
                      <TableCell className="text-right font-semibold  text-base">
                        {payment.totalPaid}৳
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
