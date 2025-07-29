"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-gray-600 text-center">
        Sorry, the page you are looking for does not exist.
        <br />
        Please choose the path correctly.
      </p>
      <Link href="/" className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
