"use client";

import { useAppSelector } from "@/redux/hook";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface FormValues {
  memberName: string;
  memberId: string;
  dateOfDeposit: string;
  typeOfDeposit: "BANK" | "BEFTN" | "NPSB";
  bankName: string;
  bankBranch: string;
  monthlySubscriptionFee: string;
  finesPenalty: string;
  periodicalDeposit: string;
  othersAmount: string;
  othersComment: string;
  monthsOfPayment: string; // pure string now
}

// 🔻 Dynamic placeholder generator
const getPlaceholder = (field: keyof FormValues): string => {
  const map: Record<keyof FormValues, string> = {
    memberName: "Enter full name",
    memberId: "Enter Member ID",
    dateOfDeposit: "Pick a date",
    typeOfDeposit: "Select type of deposit",
    bankName: "Enter bank name",
    bankBranch: "Enter branch name",
    monthlySubscriptionFee: "",
    finesPenalty: "",
    periodicalDeposit: "",
    othersAmount: "",
    othersComment: "Note on paying others amount",
    monthsOfPayment: "e.g. Month (Year)",
  };
  return map[field];
};

export default function MemberDepositForm() {
  const labelMap: Record<string, string> = {
    monthsOfPayment: "Month(s) & Year of Subscription",
    finesPenalty: "Fine/Penalty",
  };

  const getLabel = (field: string) =>
    labelMap[field] || field.replace(/([A-Z])/g, " $1");
  const initialValues: FormValues = {
    memberName: "",
    memberId: "",
    dateOfDeposit: "",
    typeOfDeposit: "BANK",
    bankName: "",
    bankBranch: "",
    monthlySubscriptionFee: "0",
    finesPenalty: "0",
    periodicalDeposit: "0",
    othersAmount: "0",
    othersComment: "",
    monthsOfPayment: "",
  };

  const validationSchema = Yup.object()
    .shape({
      memberName: Yup.string().min(2).required("Member name is required."),
      memberId: Yup.string().required("Member ID is required."),
      dateOfDeposit: Yup.date().nullable().required("Date is required."),
      typeOfDeposit: Yup.string()
        .oneOf(["BANK", "BEFTN", "NPSB"])
        .required("Type of Deposit is required."),
      bankName: Yup.string().required("Bank name is required."),
      bankBranch: Yup.string().required("Bank branch is required."),

      monthlySubscriptionFee: Yup.number().typeError("Must be a number"),

      finesPenalty: Yup.number().typeError("Must be a number"),

      periodicalDeposit: Yup.number().typeError("Must be a number"),

      othersAmount: Yup.string().matches(/^(\d+)?(\.\d{1,2})?$/, {
        message: "Invalid amount",
        excludeEmptyString: true,
      }),

      othersComment: Yup.string(),

      monthsOfPayment: Yup.string(),
    })
    .test(
      "others-amount-comment-pair",
      "Both Others Amount and Comment are required together.",
      function (values) {
        const { othersAmount, othersComment } = values;
        const hasAmount = !!othersAmount && parseFloat(othersAmount) > 0;
        const hasComment = !!othersComment?.trim();

        if ((hasAmount && !hasComment) || (!hasAmount && hasComment)) {
          return this.createError({
            path: "othersComment",
            message: "Both Others Amount and Comment are required together.",
          });
        }

        return true;
      }
    )
    .test(
      "monthly-subscription-months-pair",
      "Both Monthly Subscription Fee and Month(s) & Year of Subscription are required together.",
      function (values) {
        const { monthlySubscriptionFee, monthsOfPayment } = values;
        const hasFee = !!monthlySubscriptionFee && monthlySubscriptionFee > 0;
        const hasMonths = !!monthsOfPayment?.trim();

        if ((hasFee && !hasMonths) || (!hasFee && hasMonths)) {
          return this.createError({
            path: "monthsOfPayment",
            message:
              "Both Monthly Subscription Fee and Month(s) & Year of Subscription are required together.",
          });
        }

        return true;
      }
    )
    .test(
      "at-least-one-amount",
      "At least one of the following is required: Monthly Subscription Fee, Fine/Penalty, Periodical Deposit, or Others Amount.",
      function (values) {
        const {
          monthlySubscriptionFee,
          finesPenalty,
          periodicalDeposit,
          othersAmount,
        } = values;

        const hasAtLeastOne =
          (monthlySubscriptionFee && monthlySubscriptionFee > 0) ||
          (finesPenalty && finesPenalty > 0) ||
          (periodicalDeposit && periodicalDeposit > 0) ||
          (othersAmount && parseFloat(othersAmount) > 0);

        if (!hasAtLeastOne) {
          return this.createError({
            path: "monthlySubscriptionFee", // You can pick any field to attach this error
            message:
              "At least one payment amount is required (Monthly, Fine, Periodical, or Others).",
          });
        }

        return true;
      }
    );

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    const parsed = {
      ...values,
      monthlySubscriptionFee: parseFloat(values.monthlySubscriptionFee),
      finesPenalty: parseFloat(values.finesPenalty),
      periodicalDeposit: parseFloat(values.periodicalDeposit),
      othersAmount: parseFloat(values.othersAmount || "0"),
      monthsOfPayment: values.monthsOfPayment, // keep as string
      dateOfDeposit: values.dateOfDeposit
        ? new Date(values.dateOfDeposit).toISOString()
        : null,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/payment/make-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        }
      );
      const result = await res.json();
      if (!result.success) toast.error(result.message || "Submission failed");
      else {
        toast.success("Deposit submitted successfully");
        resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const numericInputProps = {
    min: 0,
    step: 100,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    },
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-50 ">
      <h2 className="text-2xl font-bold text-left mb-4">
        Deposit Payment Submission Form
      </h2>
      <div className="w-full max-w-4xl p-8 bg-white border rounded-2xl border-gray-300">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {(
                [
                  "memberId",
                  "memberName",
                  "bankName",
                  "bankBranch",
                ] as (keyof FormValues)[]
              ).map((field, i) => (
                <div key={i} className="col-span-1">
                  <Label
                    className="text-base font-medium capitalize"
                    htmlFor={field}
                  >
                    {field.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    value={values[field]}
                    placeholder={getPlaceholder(field)}
                    onChange={(e) => setFieldValue(field, e.target.value)}
                    className="mt-1 border-gray-300"
                  />
                  {errors[field] && touched[field] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="col-span-1">
                <Label htmlFor="dateOfDeposit" className="text-base">
                  Date of Deposit
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full font-normal border-gray-300 justify-start text-left mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.dateOfDeposit
                        ? format(new Date(values.dateOfDeposit), "dd/MM/yyyy")
                        : getPlaceholder("dateOfDeposit")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-slate-200 border-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={
                        values.dateOfDeposit
                          ? new Date(values.dateOfDeposit)
                          : undefined
                      }
                      onSelect={(date) =>
                        setFieldValue(
                          "dateOfDeposit",
                          date ? format(date, "yyyy-MM-dd") : ""
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfDeposit && touched.dateOfDeposit && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dateOfDeposit}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="typeOfDeposit" className="text-base">
                  Type of Deposit
                </Label>
                <Select
                  value={values.typeOfDeposit}
                  onValueChange={(val) => setFieldValue("typeOfDeposit", val)}
                >
                  <SelectTrigger className="mt-1 border-gray-300 w-full">
                    <SelectValue
                      placeholder={getPlaceholder("typeOfDeposit")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-200 border-none">
                    {[
                      { label: "BANK", value: "BANK" },
                      { label: "BEFTN", value: "BEFTN" },
                      { label: "NPSB", value: "NPSB" },
                    ].map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOfDeposit && touched.typeOfDeposit && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.typeOfDeposit}
                  </p>
                )}
              </div>

              {(
                [
                  "monthlySubscriptionFee",
                  "monthsOfPayment",
                  "finesPenalty",
                  "periodicalDeposit",
                  "othersAmount",
                ] as (keyof FormValues)[]
              ).map((field, i) => (
                <div key={i} className="col-span-1">
                  <Label
                    htmlFor={field}
                    className={`${
                      field === "monthsOfPayment" ? "" : "capitalize"
                    } text-base `}
                  >
                    {getLabel(field)}
                  </Label>
                  <Input
                    id={field}
                    type={field === "monthsOfPayment" ? "text" : "number"}
                    name={field}
                    value={values[field]}
                    placeholder={getPlaceholder(field)}
                    onChange={(e) => setFieldValue(field, e.target.value)}
                    {...(field === "monthsOfPayment" ? {} : numericInputProps)}
                    className="mt-1 border-gray-300"
                  />
                  {errors[field] && touched[field] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="col-span-1">
                <Label htmlFor="othersComment" className="text-base">
                  Comment of Others Amount
                </Label>
                <Input
                  id="othersComment"
                  name="othersComment"
                  value={values.othersComment}
                  placeholder={getPlaceholder("othersComment")}
                  onChange={(e) =>
                    setFieldValue("othersComment", e.target.value)
                  }
                  className="mt-1 border-gray-300"
                />
                {errors.othersComment && touched.othersComment && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.othersComment}
                  </p>
                )}
              </div>

              <div className="col-span-full">
                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-600 py-6 text-base"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
