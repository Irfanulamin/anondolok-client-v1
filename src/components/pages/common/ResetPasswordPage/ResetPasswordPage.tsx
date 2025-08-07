"use client";

import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

type FormValues = {
  email: string;
  code: string;
  newPassword: string;
};

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [initialEmail, setInitialEmail] = useState<string | null>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Read resetEmail from localStorage on client side only
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    setInitialEmail(email);
  }, []);

  // Clear redirect timeout if component unmounts early
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.code) {
      errors.code = "Reset code is required";
    }

    if (!values.newPassword) {
      errors.newPassword = "New password is required";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/.test(values.newPassword)
    ) {
      errors.newPassword =
        "Must contain at least one uppercase, one lowercase letter, and one number";
    }

    return errors;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Password Reset Successful!</h2>
          <p className="text-gray-600">You will be redirected to login.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2 rounded bg-amber-300 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Wait for email to be loaded from localStorage before showing form
  if (initialEmail === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-sm text-gray-600">
          Enter the code sent to your email and your new password
        </p>

        <Formik
          initialValues={{
            email: initialEmail,
            code: "",
            newPassword: "",
          }}
          enableReinitialize
          validate={validate}
          onSubmit={async (values, { setErrors }) => {
            setLoading(true);
            try {
              const res = await fetch(
                `http://localhost:5000/api/auth/reset-password`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );

              // Check if status is not OK
              if (!res.ok) {
                const errorResult = await res.json().catch(() => null);
                setErrors({
                  newPassword:
                    errorResult?.message ||
                    `Server error: ${res.status} ${res.statusText}`,
                });
                setLoading(false);
                return;
              }

              const result = await res.json();

              if (result.success) {
                setSuccess(true);
                localStorage.removeItem("resetEmail");
                timeoutRef.current = setTimeout(() => router.push("/"), 3000);
              } else if (result.errors) {
                setErrors(result.errors as any);
              } else {
                setErrors({
                  newPassword: result.message || "Failed to reset password",
                });
              }
            } catch {
              setErrors({ newPassword: "Network error. Please try again." });
            } finally {
              setLoading(false);
            }
          }}
        >
          {() => (
            <Form className="space-y-4">
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="border px-3 py-2 rounded mt-1 bg-gray-100 cursor-not-allowed"
                  autoComplete="email"
                  disabled
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Code */}
              <div className="flex flex-col">
                <label htmlFor="code" className="text-sm font-medium">
                  Reset Code
                </label>
                <Field
                  type="text"
                  id="code"
                  name="code"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="border px-3 py-2 rounded mt-1 text-center text-lg tracking-widest"
                  autoComplete="one-time-code"
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
                <p className="text-xs text-gray-500">
                  Check your email for the 6-digit reset code
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  className="border px-3 py-2 rounded mt-1 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
                <p className="text-xs text-gray-500">
                  Must include uppercase, lowercase, and a number
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-amber-300 font-semibold py-2 rounded flex justify-center items-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
