"use client";

import React, { useState } from "react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ArchivePaymentSummaryByYear from "./ArchivePage";
import AnnualPaymentAnalysis from "./SummaryPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import LifetimePayment from "@/components/pages/public/PaymentHistoryPage/LifetimePayment";

type Payment = {
  _id: string;
  memberId: string;
  memberName: string;
  monthlySubscriptionFee: number;
  finesPenalty: number;
  periodicalDeposit: number;
  othersAmount: number;
  othersComment?: string;
  monthsOfPayment?: string;
  totalAmount: number;
  dateOfDeposit: string;
  typeOfDeposit: string;
  bankName: string;
  bankBranch: string;
};

type Props = {
  id: string;
  payments: Payment[];
};

const PaymentHistoryByIdPage = ({ id, payments: initialPayments }: Props) => {
  const scrollAndRefresh = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payment/delete-payment/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to delete payment");
      }

      toast.success("Payment deleted successfully");
      scrollAndRefresh();
    } catch (error: any) {
      toast.error("Delete error:", error);
      toast.error(error.message);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const paymentSchema = Yup.object({
    _id: Yup.string().required("Payment ID is required"),
    memberId: Yup.string().required("Member ID is required"),
    memberName: Yup.string().required("Member Name is required"),
    typeOfDeposit: Yup.string()
      .oneOf(
        ["BANK", "BEFTN", "NPSB"],
        'Put a valid input: "BANK", "BEFTN", or "NPSB".'
      )
      .required("typeOfDeposit is required."),
    bankName: Yup.string().required("Bank Name is required"),
    bankBranch: Yup.string().required("Bank Branch is required"),
    monthlySubscriptionFee: Yup.number().min(0).required("Required"),
    finesPenalty: Yup.number().min(0).required("Required"),
    periodicalDeposit: Yup.number().min(0).required("Required"),
    othersAmount: Yup.number().min(0).required("Required"),
    othersComment: Yup.string().optional(),
    monthsOfPayment: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      _id: "",
      memberId: "",
      memberName: "",
      typeOfDeposit: "",
      bankName: "",
      bankBranch: "",
      monthlySubscriptionFee: 0,
      finesPenalty: 0,
      periodicalDeposit: 0,
      othersAmount: 0,
      othersComment: "",
      monthsOfPayment: "",
    },
    validationSchema: paymentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/payment/update-payment`,
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
          refreshPage();
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
      memberName: payment.memberName || "",
      typeOfDeposit: payment.typeOfDeposit || "",
      bankName: payment.bankName || "",
      bankBranch: payment.bankBranch || "",
      monthlySubscriptionFee: payment.monthlySubscriptionFee || 0,
      finesPenalty: payment.finesPenalty || 0,
      periodicalDeposit: payment.periodicalDeposit || 0,
      othersAmount: payment.othersAmount || 0,
      othersComment: payment.othersComment || "",
      monthsOfPayment: payment.monthsOfPayment || "",
    });
  };

  return (
    <div className="w-full mt-6 md:mt-12 lg:mt-32">
      <LifetimePayment username={id} />
      <AnnualPaymentAnalysis data={payments} />
      <header className="my-4">
        <h2 className="text-2xl font-semibold">
          Payment History of <span className="uppercase">{id}</span>{" "}
          (Month-Wise)
        </h2>
      </header>
      <div className="w-full overflow-x-auto mb-6">
        <div className="min-w-full inline-block align-middle bg-blue-300/30 pt-2 px-2 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Deposited Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-left">
                  Monthly <br /> Subscription
                </TableHead>
                <TableHead className="text-left">
                  Month(s) & Year <br /> of Subscription
                </TableHead>
                <TableHead className="text-left">Type of Submission</TableHead>
                <TableHead className="text-left">Fines</TableHead>
                <TableHead className="text-left">Others</TableHead>
                <TableHead className="text-left">Other's Comment</TableHead>
                <TableHead className="text-left">Total Amount</TableHead>
                <TableHead className="text-left">Actions</TableHead>
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
                  <TableCell className="text-left">
                    {payment.monthlySubscriptionFee}৳
                  </TableCell>
                  <TableCell className="text-left">
                    {payment.monthsOfPayment || "N/A"}
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
                        className="w-auto p-2 text-sm bg-white rounded-lg border border-slate-950"
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
                    {payment.finesPenalty}৳
                  </TableCell>
                  <TableCell className="text-left">
                    {payment.othersAmount}৳
                  </TableCell>
                  <TableCell className="text-left">
                    {payment.othersComment || "N/A"}
                  </TableCell>
                  <TableCell className="text-left font-medium text-base">
                    {payment.totalAmount}৳
                  </TableCell>
                  <TableCell className="text-left">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          className="bg-transparent shadow-none"
                          onClick={() => populateForm(payment)}
                        >
                          <Edit2Icon className="text-green-900" size={16} />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-white text-black border-none w-full overflow-scroll custom-scrollbar">
                        <SheetHeader>
                          <SheetTitle>Edit Payment Details</SheetTitle>
                        </SheetHeader>

                        <div className="px-4">
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
                                label: "Member Name",
                                name: "memberName",
                              },
                              {
                                label: "Type Of Submission",
                                name: "typeOfDeposit",
                              },
                              {
                                label: "Bank Name",
                                name: "bankName",
                              },
                              {
                                label: "Bank Branch",
                                name: "bankBranch",
                              },
                              {
                                label: "Monthly Subscription Fee",
                                name: "monthlySubscriptionFee",
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
                                htmlFor="monthsOfPayment"
                                className="font-semibold"
                              >
                                Month(s) & Year of Subscription
                              </label>
                              <Input
                                id="monthsOfPayment"
                                name="monthsOfPayment"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.monthsOfPayment}
                              />
                              {formik.errors.monthsOfPayment &&
                                formik.touched.monthsOfPayment && (
                                  <p className="text-red-500 text-sm">
                                    {formik.errors.monthsOfPayment}
                                  </p>
                                )}
                            </div>
                            {[
                              {
                                label: "Fine/Penalty",
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
                                Comment of Others Amount
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-transparent shadow-none">
                          <Trash2Icon size={16} className="text-red-900" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-red-500">
                            Delete Payment Details
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure? This action will permanently remove
                            the payment record and cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button className="text-black hover:text-slate-950">
                              Cancel
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button
                              className=" transition-all ease-in bg-red-500 text-white hover:text-red-500 hover:bg-white"
                              onClick={() => handleDelete(payment._id)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
