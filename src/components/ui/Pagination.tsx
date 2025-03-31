import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  size = "md",
  totalItems,
  itemsPerPage,
  setItemsPerPage,
}) => {
  // Calculate start and end index for "Showing X - Y of Z results"
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mt-4">
      {/* Showing results text */}
      <span className="text-sm text-gray-500">
        Showing {startIndex}-{endIndex} of {totalItems} results
      </span>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        {/* Rows per Page Selector */}
        <div className="flex items-center text-sm text-gray-500">
          <span>Rows per page:</span>
          <select
            className="ml-2 border rounded px-2 py-1 text-gray-700"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Page Buttons */}
        <div className="join">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`join-item btn btn-${size} ${
                  currentPage === pageNumber ? "btn-active" : ""
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
