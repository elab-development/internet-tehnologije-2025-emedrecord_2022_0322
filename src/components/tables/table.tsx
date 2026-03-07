import React from "react";

interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}
export const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className="w-full mt-4 rounded-xl overflow-hidden border border-border/70 bg-card/70">
      <thead>
        <tr className="text-left text-muted-foreground text-sm lg:uppercase bg-secondary/50">
          {columns.map(({ header, key, className }) => (
            <th key={key} className={`py-3 ${className || ""}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data?.length < 1 && (
          <tr className="text-muted-foreground text-base">
            <td className="py-6 px-2">No Data Found</td>
          </tr>
        )}

        {data?.length > 0 &&
          data?.map((item, id) => renderRow({ ...item, index: id }))}
      </tbody>
    </table>
  );
};
