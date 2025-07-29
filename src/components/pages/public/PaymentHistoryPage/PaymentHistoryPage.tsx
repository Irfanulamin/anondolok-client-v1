"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";

export default function History() {
  const { username } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/payment/payment-history/${username}`
        );
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);
  return (
    <div className="w-full mt-12 md:mt-24 lg:mt-32">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">Payment History</h2>
      </header>
      <div className="w-full overflow-x-auto mb-6   rounded-2xl">
        <div className="min-w-full inline-block align-middle">
          <Table className="w-full">
            <TableHeader className="bg-black text-white">
              <TableRow>
                <TableHead className="w-24">Member ID</TableHead>
                <TableHead className="min-w-[150px]">Member Name</TableHead>
                <TableHead className="text-right w-32">
                  Monthly Subscripyion
                </TableHead>
                <TableHead className="text-right w-32">
                  Penalty Amount
                </TableHead>
                <TableHead className="w-32">Type of Submission</TableHead>
                <TableHead className="min-w-[200px]">Bank Name</TableHead>
                <TableHead className="min-w-[150px]">Bank Branch</TableHead>
                <TableHead className="text-right w-32">Others Amount</TableHead>
                <TableHead className="min-w-[200px]">Others Comment</TableHead>
                <TableHead className="w-28">Date of Submission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.payments.map((payment: any) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-medium w-24">
                    {payment.memberId}
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    {payment.memberName}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold text-left w-32">
                    {Number.parseInt(
                      payment.monthlySubscriptionFee
                    ).toLocaleString()}
                    ৳
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold text-left w-32">
                    {Number.parseInt(payment.finesPenalty).toLocaleString()}৳
                  </TableCell>
                  <TableCell className="w-32">
                    {payment.typeOfDeposit}
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    {payment.bankName || "N/A"}
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    {payment.bankBranch || "N/A"}
                  </TableCell>
                  <TableCell className="text-left w-32">
                    {Number.parseInt(payment.othersAmount).toLocaleString()}৳
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    {payment.othersComment || "N/A"}
                  </TableCell>

                  <TableCell className="w-28">
                    <span className="font-semibold">
                      {new Date(payment.dateOfDeposit).toLocaleDateString(
                        "en-BD",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "Asia/Dhaka",
                        }
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
