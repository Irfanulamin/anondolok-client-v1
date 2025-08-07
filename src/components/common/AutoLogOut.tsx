"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logOut } from "@/redux/feature/authSlice";
import { toast } from "sonner";

type AuthWatcherProps = {
  min: number;
};

const AuthWatcher = ({ min }: AuthWatcherProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(logOut());
      toast.error("Session expired. You've been logged out.");
    }, min * 60 * 1000); // convert minutes to milliseconds

    return () => clearTimeout(timer);
  }, [dispatch, min]);

  return null;
};

export default AuthWatcher;
