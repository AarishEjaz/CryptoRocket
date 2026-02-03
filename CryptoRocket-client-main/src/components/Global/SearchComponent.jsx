import React from "react";

const SearchComponent = () => {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center w-full space-x-4 bg-[#151515] border border-[#434343] rounded-2xl px-6 py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          className="text-white bg-transparent outline-none w-full placeholder:text-white placeholder-opacity-70 placeholder:text-sm"
          placeholder="Search by token / Account / Contract / Block"
        />
      </div>
    </div>
  );
};

export default SearchComponent;
