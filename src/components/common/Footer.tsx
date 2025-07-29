import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="py-24 bg-sky-900 text-white">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={50}
            height={50}
            className="rounded"
          />
          <p className="text-base text-sky-100 font-semibold">
            © 2028 Anondolok Copyright. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
