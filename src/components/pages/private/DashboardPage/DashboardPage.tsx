"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, BadgeCheck, Ban, RefreshCcw, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      username: Yup.string().min(3, "Too short").required("Required"),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          "Must contain uppercase, lowercase, and number"
        )
        .min(6, "Too short")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`${process.env.SERVER_LINK}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        if (!data.success) {
          toast.error(data.message || "Registration failed");
        } else {
          toast.success("User registered successfully");
          setRefresh((prev) => !prev); // trigger refresh
          formik.resetForm();
        }
      } catch (error: any) {
        toast.error(error?.message || "Server error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.SERVER_LINK}/admin/users`);
        const data = await res.json();
        setUsers(data?.users || []);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleToggle = async (
    url: string,
    successMsg: string,
    failMsg: string
  ) => {
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("PATCH response:", data);

      if (!res.ok || !data.success) {
        toast.error(data.message || failMsg);
      } else {
        toast.success(successMsg);
        setRefresh((prev) => !prev); // trigger refresh
      }
    } catch (err) {
      console.error("Error in PATCH request:", err);
      toast.error("Server error");
    }
  };

  const toggleUserRole = (id: string) =>
    handleToggle(
      `${process.env.SERVER_LINK}/admin/users/role/${id}`,
      "User role updated",
      "Failed to update role"
    );

  const toggleUserStatus = (id: string) =>
    handleToggle(
      `${process.env.SERVER_LINK}/admin/users/deactivate/${id}`,
      "User status updated",
      "Failed to update status"
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg text-gray-600">Loading users...</p>
      </div>
    );

  return (
    <div className="flex flex-col  w-full mt-16 mb-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Members Management</h1>
      <div className="flex justify-end gap-4">
        <Button className="bg-black text-white mb-4 font-semibold text-base">
          {users.length} Members
        </Button>
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setRefresh((prev) => !prev)}
        >
          <RefreshCcw /> Refresh Users
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4">
              <Plus /> Add User
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white text-black border-none">
            <SheetHeader>
              <SheetTitle>Edit User</SheetTitle>
              <SheetDescription>
                Toggle the user's role to change their access permissions.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-6 p-6 border rounded-2xl shadow-sm bg-gray-50 m-4">
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="p-2 border rounded"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className="p-2 border rounded"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.username}
                  </div>
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="p-2 border rounded"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                >
                  {formik.isSubmitting ? "Registering..." : "Register"}
                </button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <Table className="w-full bg-blue-900/90 p-6 rounded-xl ">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left text-white py-4 text-base font-medium">
              Email
            </TableHead>
            <TableHead className="text-left text-white  text-base font-medium">
              Username
            </TableHead>
            <TableHead className="text-right text-white text-base font-medium">
              Role
            </TableHead>
            <TableHead className="text-right text-white text-base font-medium">
              Status
            </TableHead>
            <TableHead className="text-right text-white text-base font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="py-2">
          {users.map((user, idx) => (
            <TableRow
              key={user._id}
              className={`${
                idx % 2 === 0
                  ? "bg-white hover:bg-gray-100"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <TableCell className="text-left text-base font-medium text-blue-900">
                {user.email}
              </TableCell>
              <TableCell className="text-left text-base font-medium text-blue-900">
                @{user.username}
              </TableCell>
              <TableCell className="text-right text-xs font-medium text-blue-900 uppercase ">
                {user.role}
              </TableCell>
              <TableCell
                className={`text-right font-semibold text-base  ${
                  user.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className="text-right">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <Edit2Icon size={16} className="text-blue-950" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white text-black border-none">
                    <SheetHeader>
                      <SheetTitle>Edit User</SheetTitle>
                      <SheetDescription>
                        Toggle the user's role to change their access
                        permissions.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 mt-6 p-6 border rounded-2xl shadow-sm bg-gray-50 m-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Current User Role
                        </label>
                        <input
                          type="text"
                          value={user.role}
                          disabled
                          className="w-full bg-gray-100 text-gray-800 px-3 py-2 rounded-md border border-gray-300 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2 hover:bg-gray-200 transition w-full"
                          onClick={() => toggleUserRole(user._id)}
                        >
                          <RefreshCcw size={18} />
                          {user.role === "admin"
                            ? "Change Role: Admin → User"
                            : "Change Role: User → Admin"}
                        </Button>
                      </div>

                      <div>
                        <Button
                          variant="outline"
                          className={`flex items-center justify-center gap-2 transition w-full ${
                            user.isActive
                              ? "hover:bg-red-100 text-red-600"
                              : "hover:bg-green-100 text-green-600"
                          }`}
                          onClick={() => toggleUserStatus(user._id)}
                        >
                          {user.isActive ? (
                            <Ban size={18} />
                          ) : (
                            <BadgeCheck size={18} />
                          )}
                          {user.isActive
                            ? "Deactivate This User Account"
                            : "Activate This User Account"}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
