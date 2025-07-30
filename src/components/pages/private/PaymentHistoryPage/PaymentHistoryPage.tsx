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
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import YearlyPayments from "./ArchivedPayment/ArchivedPaymentPage";

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [dataSet, setDataSet] = useState<{ data: any[] } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://anondolok-backend-v1.vercel.app/api/admin-payment/total-payments"
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

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
                open={openSections[year] ?? false}
                onOpenChange={() => toggleSection(year)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {openSections[year] ?? true ? (
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
                          ).toLocaleString()}
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
                        <div key={`${year}-${month}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-medium gap-2">
                              {monthNames[Number(month)]} {year}
                            </h4>
                            <Badge variant="outline">
                              {payments.length} members
                            </Badge>
                          </div>

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
                                  <TableHead className="text-right text-white">
                                    Monthly Fees
                                  </TableHead>
                                  <TableHead className="text-right text-white">
                                    Fines
                                  </TableHead>
                                  <TableHead className="text-right text-white">
                                    Others
                                  </TableHead>

                                  <TableHead className="text-right text-white">
                                    Other's Comment
                                  </TableHead>
                                  <TableHead className="text-right text-white">
                                    Total Amount
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {payments.map((payment: any, index: number) => (
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
                                          href={`/payments-history/${payment._id.memberId}`}
                                        >
                                          <Eye className="ml-2 h-6 w-6 mr-2 text-amber-950" />
                                        </Link>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">
                                        {payment._id.memberName}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {payment._id.memberId}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {payment.totalMonthlyFees}&#2547;
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {payment.totalFines}&#2547;
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {payment.totalOthers}&#2547;
                                    </TableCell>

                                    <TableCell className="text-right">
                                      {payment.othersComment || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-base">
                                      {payment.totalAmount}&#2547;
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <TableFooter className="bg-amber-900/20">
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    className="text-right font-semibold text-sm uppercase"
                                  >
                                    Total for {monthNames[Number(month)]}:
                                  </TableCell>
                                  <TableCell className="text-right font-semibold text-base">
                                    {calculateTotal(
                                      payments as any
                                    ).toLocaleString()}
                                    &#2547;
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </div>
                        </div>
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
