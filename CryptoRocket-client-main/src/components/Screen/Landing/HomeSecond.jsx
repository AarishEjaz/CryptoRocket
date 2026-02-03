import React from "react";
import Chart from "react-apexcharts";

const HomeSecond = () => {
  const chartOptions = {
    chart: {
      type: "area",
      height: 220,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#00E396"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#333",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
      ],
      labels: { style: { colors: "#aaa" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#aaa" },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const chartSeries = [
    {
      name: "POX Price",
      data: [0.058, 0.059, 0.061, 0.060, 0.062, 0.061, 0.060],
    },
  ];

  return (
    <div className="grid grid-cols-[100%] lg:grid-cols-[78%_20%] gap-6 bg-[#151515] border-[1px] border-[#434343] rounded-3xl md:px-6 md:py-5 p-4 shadow-lg">
      {/* Left side */}
      <div>
        {/* Logo + Name + Price */}
        <div className="flex flex-row items-center space-x-4 rounded-l-xl reusable-box px-2 py-2 md:w-fit w-full">
          {/* <img src="https://yumekoai.world/assets/yumeko-logo-white-Cfdj20CD.png" alt="pox-logo" className="w-9 h-9" /> */}
          <div>
            <p className="font-semibold text-xl">YUMEKO-AI</p>
            <p className="font-medium text-base">$0.060397</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[220px]">
          <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
        </div>
      </div>

      {/* Right side */}
      <div>
        {/* Market Cap & Volume */}
        <div className="flex flex-row items-center justify-between mb-4 text-white">
          <div>
            <p className=" text-opacity-50 text-sm font-medium pb-1">Market Cap</p>
            <p>$ 2.55M</p>
          </div>
          <div>
            <p className=" text-opacity-50 text-sm font-medium pb-1">Volume (24hr)</p>
            <p className="text-right">$ 605.04K</p>
          </div>
        </div>

        {/* Supply / Staked / Bandwidth / Energy */}
        <div className="flex flex-col md:flex-row items-center md:justify-between lg:flex-col">
          <div className="reusable-box px-4 py-2 md:w-52 w-full rounded-l-xl mb-2">
            <p className="text-[var(--text)] text-opacity-50 text-sm font-medium pb-2">Supply</p>
            <p>42,292,504.25 YUM</p>
          </div>
          <div className="reusable-box px-4 py-2 md:w-52 w-full rounded-l-xl mb-2">
            <p className="text-[var(--text)] text-opacity-50 text-sm font-medium pb-2">Staked</p>
            <p>20,715,355</p>
          </div>
          <div className="reusable-box px-4 py-2 md:w-52 w-full rounded-l-xl mb-2">
            <p className="text-[var(--text)] text-opacity-50 text-sm font-medium pb-2">
              Bandwidth: <span className="text-[var(--text)]">4,283,487</span>
            </p>
            <p className="text-[var(--text)] text-opacity-50 text-sm font-medium pb-2">
              Energy: <span className="text-[var(--text)]">16,431,868</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSecond;
