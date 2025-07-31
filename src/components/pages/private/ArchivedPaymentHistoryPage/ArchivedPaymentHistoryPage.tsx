"use client";
import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";

export default function ArchivedPaymentHistoryPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.SERVER_LINK}/archive-payment`);
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="container mx-auto py-10 my-6 md:my-24 ">
        <h1 className="text-2xl font-bold mb-6">Loading</h1>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10 my-6 md:my-24 ">
      <h1 className="text-2xl font-bold mb-6">Archived Payment Data Table</h1>
      <DataTable data={data} />
    </div>
  );
}
