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
import ArchivePaymentSummaryByYear from "../../private/PaymentHistoryPage/PaymentHistoryByIdPage/ArchivePage";
import AnnualPaymentAnalysis from "./YearlyHistory";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import LifetimePayment from "./LifetimePayment";

export default function History() {
  const { username } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://anondolok-backend-v1.vercel.app/api/payment/payment-history/${username}`
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
    <div className="w-full my-12 md:my-24 lg:my-32">
      {data?.payments && <LifetimePayment username={username} />}
      {data?.payments && <AnnualPaymentAnalysis payments={data?.payments} />}
      <header className="my-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Payment History (Month-Wise)
        </h2>
      </header>
      <div className="w-full overflow-x-auto mb-6   rounded-2xl">
        <div className="min-w-full inline-block align-middle">
          <Table className="w-full">
            <TableHeader className="bg-black text-white">
              <TableRow>
                <TableHead className="text-left">Member ID</TableHead>
                <TableHead className="text-left">Member Name</TableHead>
                <TableHead className="text-left">
                  Monthly Subscription
                </TableHead>
                <TableHead className="text-left">
                  Month(s) & Year of Subscription
                </TableHead>
                <TableHead className="text-left">Fine/Penalty Amount</TableHead>
                <TableHead className="text-letf">Type of Deposit</TableHead>
                <TableHead className="text-left">Others Amount</TableHead>
                <TableHead className="text-left">
                  Comment of Others Amount
                </TableHead>
                <TableHead className="text-left">Total Amount</TableHead>
                <TableHead className="text-left">Date of Deposit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.payments.map((payment: any, idx: number) => (
                <TableRow
                  key={payment._id}
                  className={`${
                    idx % 2
                      ? "hover:bg-sky-100/10 bg-sky-200/50"
                      : "hover:bg-sky-100/20 bg-sky-200/60"
                  }`}
                >
                  <TableCell className="text-left">
                    {payment.memberId}
                  </TableCell>
                  <TableCell className="text-left">
                    {payment.memberName}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold text-left w-32">
                    {Number.parseInt(
                      payment.monthlySubscriptionFee
                    ).toLocaleString()}
                    ৳
                  </TableCell>
                  <TableCell className=" font-semibold text-left w-32">
                    {payment.monthsOfPayment || "N/A"}
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold text-left w-32">
                    {Number.parseInt(payment.finesPenalty).toLocaleString()}৳
                  </TableCell>
                  <TableCell className="text-left text-base">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="cursor-pointer text-base font-semibold text-white bg-slate-950 hover:bg-white hover:text-slate-950 custom-transition p-2 rounded-lg">
                          {payment.typeOfDeposit}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        className="w-auto p-2 text-sm bg-white border border-slate-950"
                      >
                        <p className="text-slate-950">
                          <span className="font-semibold">Bank Name:</span>{" "}
                          {payment.bankName}
                        </p>
                        <p className="text-slate-950">
                          <span className="font-semibold">Bank Branch:</span>{" "}
                          {payment.bankBranch}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-left">
                    {Number.parseInt(payment.othersAmount).toLocaleString()}৳
                  </TableCell>
                  <TableCell className="text-left">
                    {payment.othersComment || "N/A"}
                  </TableCell>
                  <TableCell className="text-left font-semibold">
                    {Number.parseInt(payment.totalAmount).toLocaleString()}৳
                  </TableCell>

                  <TableCell className="text-left">
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
      <ArchivePaymentSummaryByYear username={username} />
    </div>
  );
}
