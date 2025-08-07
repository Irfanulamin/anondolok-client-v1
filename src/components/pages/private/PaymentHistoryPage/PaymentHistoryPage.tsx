"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Calendar, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import YearlyPayments from "./ArchivedPayment/ArchivedPaymentPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PaymentsTable() {
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({});
  const [openMonths, setOpenMonths] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const toggleYear = (year: string) => {
    setOpenYears((prev) => ({
      ...prev,
      [year]: !(prev[year] ?? false),
    }));
  };

  const toggleMonth = (year: string, month: string) => {
    setOpenMonths((prev) => ({
      ...prev,
      [year]: {
        ...(prev[year] || {}),
        [month]: !(prev[year]?.[month] ?? false),
      },
    }));
  };
  const [dataSet, setDataSet] = useState<{ data: any[] } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin-payment/total-payments`
        );
        const data = await res.json();
        setDataSet(data); // Do something with the data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const groupedPayments = useMemo(() => {
    if (!dataSet) return {};
    const grouped: any = {};
    dataSet.data.forEach((payment) => {
      const year = payment._id.year.toString();
      const month = (payment._id.month - 1).toString();
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(payment);
    });
    return grouped;
  }, [dataSet]);

  if (!dataSet) return <div>Loading...</div>;

  const calculateTotal = (payments: typeof dataSet.data) =>
    payments.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6 py-12 md:py-24">
      <div className="space-y-8">
        {Object.entries(groupedPayments)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, monthsData]: any) => (
            <Card
              key={year}
              className="border-none shadow-none bg-amber-600/20"
            >
              <Collapsible
                open={openYears[year] ?? false}
                onOpenChange={() => toggleYear(year)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {openYears[year] ?? false ? (
                          <ChevronDown className="h-4 w-4 text-amber-950" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-amber-950" />
                        )}
                        <Calendar className="h-5 w-5 text-amber-950" />
                        <CardTitle className="text-amber-950">{year}</CardTitle>
                      </div>
                      <div className="bg-amber-950 px-2 py-1 rounded-lg">
                        <span className="font-semibold text-white">
                          {"Total: "}
                          {calculateTotal(
                            Object.values(monthsData).flat() as any
                          ).toLocaleString("en-IN")}
                          &#2547;
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {Object.entries(monthsData)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([month, payments]: any) => (
                        <Collapsible
                          key={`${year}-${month}`}
                          open={openMonths[year]?.[month] ?? false}
                          onOpenChange={() => toggleMonth(year, month)}
                        >
                          <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between my-3 cursor-pointer hover:bg-muted/50 p-4 rounded-md bg-amber-900/20">
                              <div className="flex items-center gap-2">
                                {openMonths[year]?.[month] ?? false ? (
                                  <ChevronDown className="h-4 w-4 text-amber-950" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-amber-950" />
                                )}
                                <h4 className="text-lg font-medium text-amber-950">
                                  {monthNames[Number(month)]} {year}
                                </h4>
                              </div>
                              <div className="space-x-2">
                                <Badge
                                  variant="outline"
                                  className="bg-white text-amber-950"
                                >
                                  {payments.length} submissions
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-950 text-white"
                                >
                                  {calculateTotal(
                                    payments as any
                                  ).toLocaleString("en-IN")}
                                  &#2547;
                                </Badge>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader className="bg-amber-950">
                                  <TableRow>
                                    <TableHead className="text-left text-white">
                                      Actions
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Member
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Monthly Fees
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Month(s) & Year <br /> of Subscription
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Type Of Submission
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Fine/Penalty
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Others
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Other's Comment
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Total Amount
                                    </TableHead>
                                    <TableHead className="text-left text-white">
                                      Date of <br /> Submission
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {payments.map(
                                    (payment: any, index: number) => (
                                      <TableRow
                                        className={`${
                                          index % 2 === 0
                                            ? "hover:bg-amber-500/10"
                                            : "hover:bg-amber-600/30"
                                        }`}
                                        key={`${payment._id.memberId}-${payment._id.year}-${payment._id.month}-${index}`}
                                      >
                                        <TableCell className="text-left font-medium underline text-base">
                                          <div className="flex items-start">
                                            <Link
                                              href={`/payments-history/user/?id=${payment._id.memberId}`}
                                            >
                                              <Eye className="ml-2 h-6 w-6 mr-2 text-amber-950" />
                                            </Link>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="font-medium text-base">
                                            {payment._id.memberName}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {payment._id.memberId}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-left text-base font-medium">
                                          {payment.monthlySubscriptionFee}{" "}
                                          &#2547;
                                        </TableCell>
                                        <TableCell className="text-left text-base">
                                          {payment.monthsOfPayment || "N/A"}
                                        </TableCell>

                                        <TableCell className="text-left text-base">
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <span className="cursor-pointer text-base font-semibold text-white bg-amber-950 hover:bg-white hover:text-amber-950 custom-transition p-2 rounded-lg">
                                                {payment.typeOfDeposit}
                                              </span>
                                            </PopoverTrigger>
                                            <PopoverContent
                                              side="right"
                                              className="w-auto p-2 text-sm bg-white"
                                            >
                                              <p className="text-amber-950">
                                                <span className="font-semibold">
                                                  Bank Name:
                                                </span>{" "}
                                                {payment.bankName}
                                              </p>
                                              <p className="text-amber-950">
                                                <span className="font-semibold">
                                                  Bank Branch:
                                                </span>{" "}
                                                {payment.bankBranch}
                                              </p>
                                            </PopoverContent>
                                          </Popover>
                                        </TableCell>
                                        <TableCell className="text-left text-base font-medium">
                                          {payment.finesPenalty}&#2547;
                                        </TableCell>
                                        <TableCell className="text-left text-base font-medium">
                                          {payment.othersAmount}&#2547;
                                        </TableCell>
                                        <TableCell className="text-left text-base">
                                          {payment.othersComment || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-left text-base font-medium">
                                          {payment.totalAmount}&#2547;
                                        </TableCell>
                                        <TableCell className="text-left text-base font-medium">
                                          {new Date(
                                            payment.dateOfDeposit
                                          ).toLocaleDateString("en-BD", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            timeZone: "Asia/Dhaka",
                                          })}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        <YearlyPayments />
      </div>
    </div>
  );
}
