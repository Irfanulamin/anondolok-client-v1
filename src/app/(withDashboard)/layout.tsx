"use client";

import AdminProtectedLayout from "@/components/common/AdminProtectedLayer";
import DashboardNavbar from "@/components/common/DashboardNavbar";
import Footer from "@/components/common/Footer";
// import Navbar from "@/components/common/Navbar";
// import UserProtectedLayout from "@/components/common/UserProtectedLayer";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return (
    <AdminProtectedLayout>
      <DashboardNavbar />
      <div className="h-full w-full max-w-[1920px] mx-auto px-2 md:px-12  lg:px-24 min-h-screen">
        {children}
      </div>
      <Footer />
    </AdminProtectedLayout>
  );
};

export default layout;
