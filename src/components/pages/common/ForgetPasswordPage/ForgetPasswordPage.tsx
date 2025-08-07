"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    return errors;
  };
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {!codeSent ? (
          <Formik
            initialValues={{ email: "" }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);
              setServerMsg(""); // Clear previous messages

              try {
                const res = await fetch(
                  `http://localhost:5000/api/auth/forgot-password`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: values.email }),
                  }
                );

                const data = await res.json();
                if (
                  data.success &&
                  data.message === "Reset code sent to your email"
                ) {
                  localStorage.setItem("resetEmail", values.email);
                  setServerMsg(data.message);
                  setCodeSent(true);
                  router.push("/reset-password");
                } else {
                  setServerMsg(data.message || "Something went wrong.");
                }
              } catch (error) {
                console.error("Error:", error);
                setServerMsg("Failed to send request. Please try again.");
              } finally {
                setLoading(false);
                setSubmitting(false);
              }
            }}
          >
            <Form className="space-y-4">
              {serverMsg && (
                <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                  {serverMsg}
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-medium text-sm">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                  disabled={loading}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-300 text-black font-semibold py-2 rounded flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Code
                  </>
                )}
              </button>
            </Form>
          </Formik>
        ) : (
          <div className="text-center space-y-4">
            <Mail className="mx-auto h-8 w-8 text-green-600" />
            <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
              {serverMsg}
            </div>
            <p className="text-sm text-gray-600">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
