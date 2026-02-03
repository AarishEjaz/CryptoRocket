/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import { extractText } from "../../../utils/helper";

const DataTable = ({
  title,
  columns,
  data,
  pageSize = 10,
  dropdownFilters = [],
}) => {
  const [filters, setFilters] = useState({});
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const renderDropdownFilters = () => {
    return dropdownFilters.map((filterItem) => (
      <div
        className="flex flex-col text-hero-primary text-sm w-full md:w-auto"
        key={filterItem.accessor}
      >
        <label className="mb-1">{filterItem.label}</label>
        <select
          className="input-field border border-delft-blue rounded px-2 py-1"
          value={filters[filterItem.accessor] || "all"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              [filterItem.accessor]: e.target.value,
            }))
          }
        >
          <option value="all">All</option>
          {filterItem.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  // Pehle data ko filter karein
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply text search filter
    if (filter) {
      const lowerCaseFilter = filter.toLowerCase();
      filtered = filtered?.filter((row) =>
        columns?.some((column) => {
          const content = column.searchValue
            ? column.searchValue(row)
            : row[column.accessor]?.toString();
          return content?.toLowerCase().includes(lowerCaseFilter);
        })
      );
    }

    // Apply dropdown filters
    Object.entries(filters).forEach(([accessor, selected]) => {
      if (selected === "all") return;

      filtered = filtered.filter((row) => {
        const col = columns.find((c) => c.accessor === accessor);
        const content = col?.searchValue
          ? col.searchValue(row)
          : row[accessor]?.toString().toLowerCase();

        // Handle both string and boolean comparisons
        if (typeof selected === 'boolean' || selected === 'true' || selected === 'false') {
          const boolSelected = selected === true || selected === 'true';
          const boolContent = content === true || content === 'true';
          return boolContent === boolSelected;
        }
        
        return content?.toString().toLowerCase() === selected?.toString().toLowerCase();
      });
    });

    return filtered;
  }, [data, filter, filters, columns]);

  // 3. Ab filtered data par pagination lagayein
  const totalPages = Math.ceil(filteredData?.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData?.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);
  const exportToExcel = (rows) => {
    const formattedData = rows.map((row, index) => {
      const obj = {};

      columns.forEach((col) => {
        if (col.exportable === false) return; // ⛔️ Skip non-exportable columns

        let rawValue;
        if (col.cell) {
          try {
            rawValue = col.cell(row, index);
          } catch {
            rawValue = row[col.accessor];
          }
        } else {
          rawValue = row[col.accessor];
        }

        obj[col.header] = extractText(rawValue);
      });

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${title || "data"}.xlsx`);
  };

  return (
    <div className="card hero-glass border border-glass-border rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-hero-primary">{title}</h2>

        {/* Search + Export Button container */}
        <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search table..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-64 input-field border border-delft-blue rounded-full py-2 pl-10 pr-4 text-hero-primary placeholder-hero-secondary focus:outline-none focus:ring-2 focus:ring-chamoisee"
            />
          </div>

          {renderDropdownFilters()}

          {/* Export Button */}
          <button
            onClick={() => exportToExcel(filteredData)}
            className="btn-primary w-full md:w-auto text-sm font-medium px-4 py-2 rounded-full transition duration-200"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-hero-secondary uppercase">
            <tr className="text-nowrap">
              {columns?.map((col) => (
                <th key={col.accessor} className={`p-3 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* 4. Ab paginated data ko render karein */}
            {paginatedData?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-delft-blue hover:bg-space-cadet/20 text-nowrap"
              >
                {columns?.map((col) => (
                  <td
                    key={col.accessor}
                    className={`p-3 ${col.className || ""}`}
                  >
                    {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedData?.length === 0 && (
          <p className="text-center text-hero-secondary py-8">No results found.</p>
        )}
      </div>

      {/* 5. Pagination component ko render karein agar ek se zyada page hain */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default DataTable;