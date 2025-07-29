"use client";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (role === null || role === undefined) {
      router.push("/");
    } else if (role === "user") {
      router.push("/payment-submission");
    }
  }, [role, router]);

  if (role === "admin") {
    return <>{children}</>;
  }

  return null;
};

export default AdminProtectedLayout;
