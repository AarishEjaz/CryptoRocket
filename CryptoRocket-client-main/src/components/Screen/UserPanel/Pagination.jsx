import React from 'react';

const generatePaginationRange = (currentPage, totalPages) => {
    // If there are 7 or fewer pages, show all of them.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is near the beginning
    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // If the current page is near the end
    if (currentPage >= totalPages - 3) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const paginationRange = generatePaginationRange(currentPage, totalPages);

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

            {/* Page Number Buttons */}
            {paginationRange.map((page, index) => {
                // If the item is an ellipsis, render a non-clickable span
                if (typeof page === 'string') {
                    return (
                        <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400">
                            ...
                        </span>
                    );
                }

                // Otherwise, render a page button
                return (
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
                );
            })}

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

export default Pagination;