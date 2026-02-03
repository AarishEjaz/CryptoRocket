import React from "react";
import { FaUsers } from "react-icons/fa";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { RiWallet3Fill } from "react-icons/ri";
import { SiMoneygram } from "react-icons/si";
import SearchComponent from "../../Global/SearchComponent";

const HomeTop = () => {
  return (
    <div className="flex flex-col items-center space-y-[50px] mt-[50px]">
      {/* Title */}
      <p className="text-[var(--text)] font-bold text-2xl md:text-5xl text-center pb-4">
        YUMEKO-AI BLOCKCHAIN EXPLORER
      </p>

      {/* Top Stats & Search */}
      <div className="flex flex-col md:flex-row items-center md:space-x-4 w-full md:w-[60%] lg:w-[50%] mt-2 space-y-4 md:space-y-0">
        {/* Total Block */}
        <div className="bg-[#151515] border-[1px] text-white border-[#434343] rounded-2xl w-full md:w-auto px-6 py-2 flex flex-col items-center">
          <p className=" opacity-70 whitespace-nowrap text-center">
            Total Block
          </p>
          <p className="font-medium text-center">13.90M</p>
        </div>

        {/* Search Bar */}
        <SearchComponent />
      </div>

      {/* Trending Search */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 my-6 w-full">
        <p className="text-xl text-center font-semibold text-[var(--text)] mb-4 md:mb-0 whitespace-nowrap">
          Trending Search:
        </p>
        <div className="grid grid-cols-5 gap-2 md:gap-6 w-full">
          <a className="flex items-center p-2 space-x-4" href="/tokens/pox">
            <img
              // src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png"
              alt="POX-logo"
              className="w-12 h-12 rounded-full p-2  bg-black dark:bg-transparent"
            />
          </a>
          <a
            className="flex items-center p-2 space-x-4"
            href="/tokendetails/PEmC2y95fNckYXPodRekgbgDQDZmDdw5T7"
          >
            <img
              // src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png"
              alt="HPOX-logo"
              className="w-12 h-12 rounded-full p-2  bg-black dark:bg-transparent"
            />
          </a>
          <a
            className="flex items-center p-2 space-x-4"
            href="/tokendetails/PApFeUXaX7jjHu3RQcwvgzy1tCwt3G9Q42"
          >
            <img
              // src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png"
              alt="UVI-logo"
              className="w-12 h-12 rounded-full p-2  bg-black dark:bg-transparent"
            />
          </a>
          <a
            className="flex items-center p-2 space-x-4"
            href="/tokendetails/PQxhtJdzHi2ZFRoU4eUXfRY272FufZvc1P"
          >
            <img
              // src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png"
              alt="$BDOG-logo"
              className="w-12 h-12 rounded-full p-2  bg-black dark:bg-transparent"
            />
          </a>
          <a
            className="flex items-center p-2 space-x-4"
            href="/tokendetails/PFZK5LUuhYQrieY4xmHN5xt9t4kuT4yuUq"
          >
            <img
              // src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png"
              alt="wUSDT-logo"
              className="w-12 h-12 rounded-full p-2  bg-black dark:bg-transparent"
            />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 my-6">
        {/* Box 1 */}
        <div className="reusable-box px-6 py-4 flex justify-between items-center space-x-6 text-sm border border-gray-800">
          <div className="flex items-center space-x-6">
            <FaUsers size={24} />
            <div>
              <p className="pb-1 text-[var(--text)] text-opacity-50">Total Accounts</p>
              <p className="font-medium">249,203</p>
            </div>
          </div>
          <div>
            <p className="pb-1 text-[var(--text)] text-opacity-50 whitespace-nowrap text-right">
              24 hrs
            </p>
            <p className="font-medium">+304</p>
          </div>
        </div>

        {/* Box 2 */}
        <div className="reusable-box px-6 py-4 flex justify-between items-center space-x-6 text-sm border border-gray-800">
          <div className="flex items-center space-x-6">
            <SiMoneygram size={24} />
            <div>
              <p className="pb-1 text-[var(--text)] text-opacity-50">
                Total Transactions
              </p>
              <p className="font-medium">14,939,198</p>
            </div>
          </div>
          <div>
            <p className="pb-1 text-[var(--text)] text-opacity-50 whitespace-nowrap text-right">
              24 hrs
            </p>
            <p className="font-medium">+17,918</p>
          </div>
        </div>

        {/* Box 3 */}
        <div className="reusable-box px-6 py-4 flex justify-between items-center space-x-6 text-sm border border-gray-800">
          <div className="flex items-center space-x-6">
            <LuChartNoAxesCombined size={24} />
            <div>
              <p className="pb-1 text-[var(--text)] text-opacity-50">TVL (Current)</p>
              <p className="font-medium">$1,250,876.00</p>
            </div>
          </div>
          <div>
            <p className="pb-1 text-[var(--text)] text-opacity-50 whitespace-nowrap text-right">
              24 hrs
            </p>
            <p className="font-medium">-8.32</p>
          </div>
        </div>

        {/* Box 4 */}
        <div className="reusable-box px-6 py-4 flex justify-between items-center space-x-6 text-sm border border-gray-800">
          <div className="flex items-center space-x-6">
            <RiWallet3Fill size={24} />
            <div>
              <p className="pb-1 text-[var(--text)] text-opacity-50">
                Total Transfer Volume
              </p>
              <p className="font-medium">$24,231,692.74</p>
            </div>
          </div>
          <div>
            <p className="pb-1 text-[var(--text)] text-opacity-50 whitespace-nowrap text-right">
              24 hrs
            </p>
            <p className="font-medium">+36,601.11</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="w-full flex flex-wrap items-center justify-between rounded-2xl my-2 px-6 py-4 reusable-box"
      >
        <p className="text-opacity-50 text-[var(--text)]">
          Current / MaxTPS:{" "}
          <span className="text-opacity-100 text-[var(--text)]">0/10000</span>
        </p>
        <p className="text-opacity-50 text-[var(--text)]">
          Nodes: <span className="text-opacity-100 text-[var(--text)]">49</span>
        </p>
        <p className="text-opacity-50 text-[var(--text)]">
          Total Token: <span className="text-opacity-100 text-[var(--text)]">9</span>
        </p>
        <p className="text-opacity-50 text-[var(--text)]">
          Total Contracts:{" "}
          <span className="text-opacity-100 text-[var(--text)]">91</span>
        </p>
      </div>
    </div>
  );
};

export default HomeTop;
