"use client";

import { useState, useEffect } from "react";
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
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";

interface Payment {
  name: string;
  username: string;
  amount: number;
}

interface YearlyPaymentData {
  year: string;
  total_amount: number;
  total_contributors: number;
  payments: Payment[];
}

export default function YearlyPayments() {
  const [yearlyPaymentsData, setYearlyPaymentsData] = useState<
    YearlyPaymentData[] | null
  >(null);
  const [openStates, setOpenStates] = useState<{ [year: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/archive-payment/yearly`
        );
        const data = await res.json();
        setYearlyPaymentsData(data);

        // Initialize open states to false for all years
        const initialStates: { [year: string]: boolean } = {};
        data.forEach((item: YearlyPaymentData) => {
          initialStates[item.year] = false;
        });
        setOpenStates(initialStates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!yearlyPaymentsData) return <p>loading...</p>;

  const toggleOpen = (year: string) => {
    setOpenStates((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  return (
    <div>
      {yearlyPaymentsData.map((yearData) => (
        <Collapsible
          key={yearData.year}
          open={openStates[yearData.year]}
          onOpenChange={() => toggleOpen(yearData.year)}
        >
          <Card className="border-none shadow-none bg-amber-600/20 my-6">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {openStates[yearData.year] ? (
                      <ChevronDown className="h-4 w-4 text-amber-950" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-amber-950" />
                    )}
                    <Calendar className="h-5 w-5 text-amber-950" />
                    <CardTitle className="text-amber-950">
                      {yearData.year}
                    </CardTitle>
                  </div>
                  <div className="bg-amber-950 px-2 py-1 rounded-lg">
                    <span className="font-semibold text-white">
                      {"Total: "}
                      {yearData.total_amount.toLocaleString("en-IN")}
                      &#2547;
                    </span>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-0">
              <CardContent className="space-y-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-amber-950">
                      <TableRow>
                        <TableHead className="w-[200px] text-white">
                          Name
                        </TableHead>
                        <TableHead className="text-white">Username</TableHead>
                        <TableHead className="text-right text-white">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="py-2">
                      {yearData.payments.map((payment, index) => (
                        <TableRow
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "hover:bg-amber-500/10"
                              : "hover:bg-amber-600/30"
                          } `}
                        >
                          <TableCell className="font-medium">
                            {payment.name}
                          </TableCell>
                          <TableCell>{payment.username}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-amber-950 text-base font-medium">
                              {payment.amount.toLocaleString("en-US")}
                              &#2547;
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}
