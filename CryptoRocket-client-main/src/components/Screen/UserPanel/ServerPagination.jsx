import React from "react";

const ServerPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  maxPageButtons = 5,
}) => {
  if (totalPages === 0) return null;

  // Calculate start and end page for pagination range
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors border border-slate-700"
        aria-label="Previous Page"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full transition-colors font-semibold border ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30"
              : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors border border-slate-700"
        aria-label="Next Page"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default ServerPagination;
