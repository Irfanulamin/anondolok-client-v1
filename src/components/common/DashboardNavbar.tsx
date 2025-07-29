"use client";
import { logOut } from "@/redux/feature/authSlice";
import { useAppDispatch } from "@/redux/hook";
import Link from "next/link";
import { useState } from "react";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/archived-payment", label: "Archived Payment" },
    { to: `/payments-history`, label: "Payment History" },
    { to: "/add-payment", label: "Make A Deposit" },
  ];

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("token");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sky-950 border-b border-gray-200 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 relative">
        <Link href="/payment-submission" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </Link>
        <button
          className="md:hidden flex flex-col justify-between w-8 h-6 focus:outline-none"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-1 bg-gray-800 rounded transition-all"></span>
          <span className="block h-1 bg-gray-800 rounded transition-all"></span>
          <span className="block h-1 bg-gray-800 rounded transition-all"></span>
        </button>
        <div
          className={` flex-col md:flex-row md:flex gap-4 absolute md:static top-full left-0 right-0 pt-6 md:pt-0 bg-white md:bg-transparent md:border-0 z-10 transition-all ${
            open ? "flex" : "hidden"
          } md:items-center`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="block px-4  md:p-0 text-base text-sky-100 font-medium hover:text-sky-200 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="block px-3 py-3 md:py-0.5 rounded-lg text-base  text-red-600 font-medium hover:text-red-800 transition-colors bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
