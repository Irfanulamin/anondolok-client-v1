"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: Array<{
    "Name": string;
    "Periodical Deposits": {
      "1st One Lac": number;
      "2nd One Lac": number;
      "1st 25,000/-": number;
      "2nd 25,000/-": number;
      "3rd 25,000/-": number;
    };
    "Monthly Subscription": {
      2017: number;
      2018: number;
      2019: number;
      2020: number;
      2021: number;
      2022: number;
      2023: number;
      2024: number;
    };
    "Total Deposit": number;
  }>;
}

export function DataTable({ data }: DataTableProps) {
  const periodicalDepositHeaders = [
    "1st One Lac",
    "2nd One Lac",
    "1st 25,000/-",
    "2nd 25,000/-",
    "3rd 25,000/-",
  ];

  const monthlySubscriptionHeaders = [
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              rowSpan={2}
              className="sticky left-0 bg-background z-10"
            ></TableHead>
            <TableHead colSpan={5} className="text-center border-l border-r">
              Periodical Deposits
            </TableHead>
            <TableHead colSpan={8} className="text-center border-l border-r">
              Monthly Subscription Fee
            </TableHead>
            <TableHead rowSpan={2} className="text-right">
              Total Deposit
            </TableHead>
          </TableRow>
          <TableRow>
            {periodicalDepositHeaders.map((header) => (
              <TableHead key={header} className="text-right">
                {header}
              </TableHead>
            ))}
            {monthlySubscriptionHeaders.map((header) => (
              <TableHead key={header} className="text-right">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium sticky left-0  z-10 bg-slate-800 text-white">
                <span className="">{row.Name}</span>
              </TableCell>
              {periodicalDepositHeaders.map((header) => (
                <TableCell key={header} className="text-right">
                  {
                    row["Periodical Deposits"][
                      header as keyof (typeof row)["Periodical Deposits"]
                    ]
                  }
                </TableCell>
              ))}
              {monthlySubscriptionHeaders.map((header) => (
                <TableCell key={header} className="text-right">
                  {
                    row["Monthly Subscription"][
                      Number.parseInt(
                        header
                      ) as keyof (typeof row)["Monthly Subscription"]
                    ]
                  }
                </TableCell>
              ))}
              <TableCell className="text-right">
                {row["Total Deposit"]}&#2547;
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
