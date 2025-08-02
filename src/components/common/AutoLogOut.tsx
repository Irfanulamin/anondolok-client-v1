"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logOut } from "@/redux/feature/authSlice";
import { toast } from "sonner";

const AuthWatcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(logOut());
      toast.error("Session expired. You've been logged out.");
    }, 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default AuthWatcher;
