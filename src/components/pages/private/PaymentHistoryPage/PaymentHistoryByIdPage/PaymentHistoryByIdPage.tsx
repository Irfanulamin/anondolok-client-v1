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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ArchivePaymentSummaryByYear from "./ArchivePage";
import AnnualPaymentAnalysis from "./SummaryPage";

type Payment = {
  _id: string;
  memberId: string;
  memberName: string;
  monthlySubscriptionFee: number;
  finesPenalty: number;
  periodicalDeposit: number;
  othersAmount: number;
  othersComment?: string;
  totalAmount: number;
  dateOfDeposit: string;
};

const PaymentHistoryByIdPage = ({ id }: { id: string }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const refreshPage = () => {
    window.location.reload();
  };

  const paymentSchema = Yup.object({
    _id: Yup.string().required("Payment ID is required"),
    memberId: Yup.string().required("Member ID is required"),
    monthlySubscriptionFee: Yup.number().min(0).required("Required"),
    finesPenalty: Yup.number().min(0).required("Required"),
    periodicalDeposit: Yup.number().min(0).required("Required"),
    othersAmount: Yup.number().min(0).required("Required"),
    othersComment: Yup.string().optional(),
  });

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.SERVER_LINK}/payment/payment-history/${id}`
      );
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      _id: "",
      memberId: "",
      monthlySubscriptionFee: 0,
      finesPenalty: 0,
      periodicalDeposit: 0,
      othersAmount: 0,
      othersComment: "",
    },
    validationSchema: paymentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(
          `${process.env.SERVER_LINK}/payment/update-payment`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const data = await res.json();

        if (res.ok) {
          toast.success(data?.message || "Payment updated!");
          resetForm();
          refreshPage(); // Close the Sheet
          fetchData(); // Refresh data
        } else {
          toast.error(data?.message || "Update failed.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const populateForm = (payment: Payment) => {
    formik.setValues({
      _id: payment._id || "",
      memberId: payment.memberId || "",
      monthlySubscriptionFee: payment.monthlySubscriptionFee || 0,
      finesPenalty: payment.finesPenalty || 0,
      periodicalDeposit: payment.periodicalDeposit || 0,
      othersAmount: payment.othersAmount || 0,
      othersComment: payment.othersComment || "",
    });
  };
  console.log(payments);
  return (
    <div className="w-full mt-6 md:mt-12 lg:mt-32">
      <AnnualPaymentAnalysis data={payments} />
      <header className="mb-4">
        <h2 className="text-2xl font-semibold">
          Payment History of <span className="uppercase">{id}</span>
        </h2>
      </header>
      <div className="w-full overflow-x-auto mb-6">
        <div className="min-w-full inline-block align-middle bg-blue-900/30 pt-2 px-2 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Deposited Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Monthly Fees</TableHead>
                <TableHead className="text-right">Fines</TableHead>
                <TableHead className="text-right">Others</TableHead>
                <TableHead className="text-right">Other's Comment</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow
                  key={payment._id}
                  className={`${
                    index % 2 === 0
                      ? "hover:bg-blue-500/10"
                      : "hover:bg-blue-600/30"
                  }`}
                >
                  <TableCell className="text-left">
                    {new Date(payment.dateOfDeposit).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.memberName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.memberId}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.monthlySubscriptionFee}৳
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.finesPenalty}৳
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.othersAmount}৳
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.othersComment?.trim()
                      ? payment.othersComment
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-base">
                    {payment.totalAmount}৳
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            populateForm(payment);
                          }}
                        >
                          <Edit2Icon size={16} />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-white text-black border-none w-full">
                        <SheetHeader>
                          <SheetTitle>Edit Payment Details</SheetTitle>
                          <SheetDescription>
                            Update the selected payment information.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="p-6">
                          <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4 w-full"
                          >
                            {[
                              {
                                label: "Payment ID",
                                name: "_id",
                                isDisabled: true,
                              },
                              {
                                label: "Member ID",
                                name: "memberId",
                                isDisabled: true,
                              },
                              {
                                label: "Monthly Subscription Fee",
                                name: "monthlySubscriptionFee",
                                type: "number",
                              },
                              {
                                label: "Fines Penalty",
                                name: "finesPenalty",
                                type: "number",
                              },
                              {
                                label: "Periodical Deposit",
                                name: "periodicalDeposit",
                                type: "number",
                              },
                              {
                                label: "Others Amount",
                                name: "othersAmount",
                                type: "number",
                              },
                            ].map((field) => (
                              <div key={field.name}>
                                <label
                                  htmlFor={field.name}
                                  className="font-semibold"
                                >
                                  {field.label}
                                </label>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  type={field.type || "text"}
                                  onChange={formik.handleChange}
                                  disabled={field.isDisabled}
                                  value={
                                    formik.values[
                                      field.name as keyof typeof formik.values
                                    ] as string | number
                                  }
                                  className="w-full"
                                />
                                {formik.errors[
                                  field.name as keyof typeof formik.errors
                                ] &&
                                formik.touched[
                                  field.name as keyof typeof formik.touched
                                ] ? (
                                  <p className="text-red-500 text-sm">
                                    {
                                      formik.errors[
                                        field.name as keyof typeof formik.errors
                                      ]
                                    }
                                  </p>
                                ) : null}
                              </div>
                            ))}

                            <div>
                              <label
                                htmlFor="othersComment"
                                className="font-semibold"
                              >
                                Others Comment
                              </label>
                              <Input
                                id="othersComment"
                                name="othersComment"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.othersComment}
                              />
                              {formik.errors.othersComment &&
                                formik.touched.othersComment && (
                                  <p className="text-red-500 text-sm">
                                    {formik.errors.othersComment}
                                  </p>
                                )}
                            </div>

                            <Button
                              type="submit"
                              disabled={formik.isSubmitting}
                              className="bg-black rounded-b-2xl w-full text-white hover:bg-gray-200 hover:text-black transition-all"
                            >
                              {formik.isSubmitting
                                ? "Updating..."
                                : "Update Payment"}
                            </Button>
                          </form>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ArchivePaymentSummaryByYear username={id} />
    </div>
  );
};

export default PaymentHistoryByIdPage;
