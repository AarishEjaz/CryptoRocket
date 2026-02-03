import React from "react";
import Pagination from "./Pagination";
import ServerPagination from "./ServerPagination";

const ServerSideTable = ({
  title,
  columns,
  data = [],
  totalCount = 0,
  pageSize = 5,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-slate-400 uppercase">
            <tr className="text-nowrap">
              {columns.map((col) => (
                <th key={col.accessor} className={`p-3 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-400">
                  No results found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-slate-700/50 hover:bg-slate-800/20"
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className={`p-3 ${col.className || ""}`}>
                      {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <ServerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          maxPageButtons={5} // limit to 5 page numbers shown
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ServerSideTable;
