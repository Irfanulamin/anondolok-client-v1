"use client";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { setUser } from "@/redux/feature/authSlice";
import { Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <Container>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm border border-gray-200">
          <Image
            src="/logo.png"
            alt="Anondolok Logo"
            width={200}
            height={200}
            className="mx-auto my-4 w-full h-auto max-w-[200px]"
          />
          <Formik
            initialValues={{ username: "", password: "" }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.username) {
                errors.username = "Username is required";
              }
              if (!values.password) {
                errors.password = "Password is required";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await fetch(
                  "http://localhost:5000/api/auth/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  }
                );
                const result = await response.json();
                if (result?.success == false) {
                  toast.error(result?.message || "Login failed");
                }
                if (result?.token) {
                  localStorage.removeItem("token");
                  localStorage.setItem("token", result.token);
                  dispatch(
                    setUser({
                      username: result.user.username,
                      role: result.user.role,
                    })
                  );
                }
                if (result?.user?.role === "user") {
                  router.push("/payment-submission");
                } else if (result?.user?.role === "admin") {
                  router.push("/dashboard");
                }
              } catch (error) {
                console.error("Login Error:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid gap-3">
                  <label className="text-base font-bold" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    className="border rounded p-2"
                  />
                  {errors.username && touched.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username}
                    </span>
                  )}
                </div>
                <div className="grid gap-3">
                  <label className="text-base font-bold" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className="border rounded p-2"
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password}
                    </span>
                  )}
                </div>
                <div className="text-right mb-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-300 rounded-lg hover:bg-amber-400 transition-colors ease-in-out"
                  >
                    Login
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
};
