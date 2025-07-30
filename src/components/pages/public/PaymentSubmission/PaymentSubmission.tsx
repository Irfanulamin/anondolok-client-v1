"use client";
import { useAppSelector } from "@/redux/hook";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

export default function MemberDepositForm() {
  const { username } = useAppSelector((state) => state.auth);
  const initialValues = {
    memberName: "",
    memberId: username,
    dateOfDeposit: "",
    typeOfDeposit: "BANK",
    bankName: "",
    bankBranch: "",
    monthlySubscriptionFee: "0",
    finesPenalty: "0",
    periodicalDeposit: "0",
    othersAmount: "",
    othersComment: "",
  };

  const validationSchema = Yup.object().shape({
    memberName: Yup.string()
      .min(2, "Member name must be at least 2 characters.")
      .required("Member name is required."),
    memberId: Yup.string().required("Member ID is required."),
    dateOfDeposit: Yup.date().required("Date of deposit is required."),
    typeOfDeposit: Yup.string().oneOf(["BANK", "BEFTN", "NPSB"]),
    bankName: Yup.string().required("Bank name is required."),
    bankBranch: Yup.string().required("Bank branch is required."),
    monthlySubscriptionFee: Yup.number()
      .typeError("Must be a number")
      .required("Monthly Subscription Fee is required."),
    finesPenalty: Yup.number()
      .typeError("Must be a number")
      .required("Fines / Penalty is required."),
    periodicalDeposit: Yup.number()
      .typeError("Must be a number")
      .required("Periodical Deposit is required."),
    othersAmount: Yup.string().matches(/^\d*(\.\d{1,2})?$/, {
      message: "Must be a valid amount",
      excludeEmptyString: true,
    }),
    othersComment: Yup.string().when(
      ["othersAmount"],
      (othersAmount: string[], schema) => {
        const val = othersAmount[0];
        return parseFloat(val || "0") > 0
          ? schema.required(
              "Comment is required when 'Others' amount is given."
            )
          : schema;
      }
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    console.log(values);
    const parsedData = {
      ...values,
      monthlySubscriptionFee: parseFloat(values.monthlySubscriptionFee),
      finesPenalty: parseFloat(values.finesPenalty),
      periodicalDeposit: parseFloat(values.periodicalDeposit),
      othersAmount: values.othersAmount ? parseFloat(values.othersAmount) : 0,
    };
    try {
      const response = await fetch(
        "https://anondolok-backend-v1.vercel.app/api/payment/make-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedData),
        }
      );
      const result = await response.json();
      console.log(result);
      if (result?.success == false) {
        toast.error(result?.message || "Something went wrong!");
      } else {
        toast.success("Deposit submitted successfully!");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 my-24 md:my-0">
      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold mb-4">
          Member's Deposit Submission Form
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => {
            const showOthersComment =
              parseFloat(values.othersAmount || "0") > 0;
            return (
              <Form className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 border border-gray-200">
                {/* Member ID */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="memberId"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Member ID
                  </label>
                  <div className="flex-1">
                    <Field
                      id="memberId"
                      name="memberId"
                      disabled
                      className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 cursor-not-allowed"
                      placeholder="Auto-generated ID"
                    />
                    <ErrorMessage
                      name="memberId"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                {/* Member Name */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="memberName"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Member Name
                  </label>
                  <div className="flex-1">
                    <Field
                      id="memberName"
                      name="memberName"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="Enter member name"
                    />
                    <ErrorMessage
                      name="memberName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Date of Deposit */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="dateOfDeposit"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Date of Deposit
                  </label>
                  <div className="flex-1">
                    <Field
                      id="dateOfDeposit"
                      type="date"
                      name="dateOfDeposit"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    <ErrorMessage
                      name="dateOfDeposit"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Type of Deposit */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="typeOfDeposit"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Type of Deposit
                  </label>
                  <div className="flex-1">
                    <Field
                      id="typeOfDeposit"
                      as="select"
                      name="typeOfDeposit"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      <option value="BANK">Bank</option>
                      <option value="BEFTN">BEFTN</option>
                      <option value="NPSB">NPSB</option>
                    </Field>
                    <ErrorMessage
                      name="typeOfDeposit"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Bank Name */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="bankName"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Bank Name
                  </label>
                  <div className="flex-1">
                    <Field
                      id="bankName"
                      name="bankName"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="Enter bank name"
                    />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Bank Branch */}
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="bankBranch"
                    className="w-40 text-gray-700 font-semibold"
                  >
                    Bank Branch
                  </label>
                  <div className="flex-1">
                    <Field
                      id="bankBranch"
                      name="bankBranch"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="Enter bank branch"
                    />
                    <ErrorMessage
                      name="bankBranch"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Numeric Fields Compact in one row */}
                <div className="flex flex-wrap gap-6">
                  {/* Monthly Subscription Fee */}
                  <div className="flex items-center space-x-3 w-full sm:w-[45%]">
                    <label
                      htmlFor="monthlySubscriptionFee"
                      className="w-40 text-gray-700 font-semibold"
                    >
                      Monthly Subscription Fee
                    </label>
                    <div className="flex-1">
                      <Field
                        id="monthlySubscriptionFee"
                        type="number"
                        name="monthlySubscriptionFee"
                        min="0"
                        step="100"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        onKeyDown={(e: any) => {
                          if (["e", "E", "+", "-"].includes(e.key))
                            e.preventDefault();
                        }}
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="monthlySubscriptionFee"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Fines / Penalty */}
                  <div className="flex items-center space-x-3 w-full sm:w-[45%]">
                    <label
                      htmlFor="finesPenalty"
                      className="w-40 text-gray-700 font-semibold"
                    >
                      Fines / Penalty
                    </label>
                    <div className="flex-1">
                      <Field
                        id="finesPenalty"
                        type="number"
                        name="finesPenalty"
                        min="0"
                        step="100"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        onKeyDown={(e: any) => {
                          if (["e", "E", "+", "-"].includes(e.key))
                            e.preventDefault();
                        }}
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="finesPenalty"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Periodical Deposit */}
                  <div className="flex items-center space-x-3 w-full sm:w-[45%]">
                    <label
                      htmlFor="periodicalDeposit"
                      className="w-40 text-gray-700 font-semibold"
                    >
                      Periodical Deposit
                    </label>
                    <div className="flex-1">
                      <Field
                        id="periodicalDeposit"
                        type="number"
                        name="periodicalDeposit"
                        min="0"
                        step="100"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        onKeyDown={(e: any) => {
                          if (["e", "E", "+", "-"].includes(e.key))
                            e.preventDefault();
                        }}
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="periodicalDeposit"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Others Amount */}
                  <div className="flex items-center space-x-3 w-full sm:w-[45%]">
                    <label
                      htmlFor="othersAmount"
                      className="w-40 text-gray-700 font-semibold"
                    >
                      Others Amount
                    </label>
                    <div className="flex-1">
                      <Field
                        id="othersAmount"
                        type="number"
                        name="othersAmount"
                        min="0"
                        step="100"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        onKeyDown={(e: any) => {
                          if (["e", "E", "+", "-"].includes(e.key))
                            e.preventDefault();
                        }}
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="othersAmount"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Others Comment (conditionally shown) */}
                {showOthersComment && (
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="othersComment"
                      className="w-40 text-gray-700 font-semibold"
                    >
                      Others Comment
                    </label>
                    <div className="flex-1">
                      <Field
                        id="othersComment"
                        name="othersComment"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Add a comment"
                      />
                      <ErrorMessage
                        name="othersComment"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-md shadow-md transition-colors duration-300"
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
