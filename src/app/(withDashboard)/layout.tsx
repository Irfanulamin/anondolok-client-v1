"use client";

import AdminProtectedLayout from "@/components/common/AdminProtectedLayer";
import AuthWatcher from "@/components/common/AutoLogOut";
import DashboardNavbar from "@/components/common/DashboardNavbar";
import Footer from "@/components/common/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return (
    <AdminProtectedLayout>
      <AuthWatcher min={180} />
      <DashboardNavbar />
      <div className="h-full w-full max-w-[1920px] mx-auto px-2 md:px-12  lg:px-24 min-h-screen my-24">
        {children}
      </div>
      <Footer />
    </AdminProtectedLayout>
  );
};

export default layout;
