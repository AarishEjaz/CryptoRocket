import React from "react";

const blocks = [
  {
    number: "#13,921,017",
    link: "/blockchain/block/blockdetails/13921017",
    reward: "0.2 YUM",
    miner: "deepcoin",
    minerLink: "/address-account/PXD9hTrvogdMBSaTRMETBkSyFLq8AvLe9S",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "4 seconds ago",
  },
  {
    number: "#13,921,016",
    link: "/blockchain/block/blockdetails/13921016",
    reward: "0.2 YUM",
    miner: "bitunix",
    minerLink: "/address-account/PFAW5M2VhXQZpUn1KZbGVLFUg4ZcFGVjKt",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "7 seconds ago",
  },
  {
    number: "#13,921,015",
    link: "/blockchain/block/blockdetails/13921015",
    reward: "0.2 YUM",
    miner: "ratri",
    minerLink: "/address-account/P9S6te7FWn11rTjFzAtCKxhzwvQRPpk814",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "10 seconds ago",
  },
  {
    number: "#13,921,014",
    link: "/blockchain/block/blockdetails/13921014",
    reward: "0.2 YUM",
    miner: "aiml",
    minerLink: "/address-account/PDCMLsp9vSdK3YwP2ZUZELfvxN6uDsS8Db",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "16 seconds ago",
  },
  {
    number: "#13,921,013",
    link: "/blockchain/block/blockdetails/13921013",
    reward: "0.2 YUM",
    miner: "sulmine",
    minerLink: "/address-account/PRTAZjzdz5nJNRrLACeVMA1EKZvVscaM3m",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "19 seconds ago",
  },
  {
    number: "#13,921,012",
    link: "/blockchain/block/blockdetails/13921012",
    reward: "0.2 YUM",
    miner: "pionex",
    minerLink: "/address-account/PPwAGugCCAQwTeJ7kcL9yGGW5XQTR6vxLF",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "22 seconds ago",
  },
  {
    number: "#13,921,011",
    link: "/blockchain/block/blockdetails/13921011",
    reward: "0.2 YUM",
    miner: "hyperpox",
    minerLink: "/address-account/PToTG3mALii4CaAcEGVrWzpzV6g5V73K8z",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "28 seconds ago",
  },
  {
    number: "#13,921,010",
    link: "/blockchain/block/blockdetails/13921010",
    reward: "0.2 YUM",
    miner: "gemin",
    minerLink: "/address-account/PXnMCttxRruUCFqDm94gGYRbUTZTAm7qYC",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "31 seconds ago",
  },
  {
    number: "#13,921,009",
    link: "/blockchain/block/blockdetails/13921009",
    reward: "0.2 YUM",
    miner: "poxmine",
    minerLink: "/address-account/PFioa8RmQ28yeoDvGA4HFR6iK7pcU6EysG",
    trx: "0 TRX",
    pox: "0 YUM",
    time: "34 seconds ago",
  },
  {
    number: "#13,921,008",
    link: "/blockchain/block/blockdetails/13921008",
    reward: "0.2 YUM",
    miner: "bitmart",
    minerLink: "/address-account/PVZM2adaz4sRGP5f8L2dHy8WSbJZARdT3k",
    trx: "1 TRX",
    pox: "0 YUM",
    time: "37 seconds ago",
  },
];

const HomeThird = () => {
  return (
    <div className="overflow-hidden h-[338px] bg-[#151515] border border-[#434343] rounded-3xl px-4 py-5 shadow-lg hide-scrollbar">
      <div className="relative h-[400px] overflow-auto hide-scrollbar">
        <p className="text-lg font-bold text-white whitespace-nowrap mb-2">
          Blocks
        </p>
        {blocks.map((block, index) => (
          <div
            key={index}
            className="reusable-box rounded-3xl p-5 flex flex-row items-center space-x-6 shadow-lg mb-2 min-w-[400px]"
          >
            <div className="flex-shrink-0">
              <img
                src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/96/external-line-shapes-tanah-basah-basic-outline-tanah-basah-30.png"
                alt="animated-block"
                className="w-10 h-10"
              />
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div>
                <a
                  className="pb-2 text-lg font-semibold text-[var(--text)] "
                  href={block.link}
                >
                  {block.number}
                </a>
                <p className="pb-2 text-sm font-medium dark:text-[#B6FFCE] text-[#000000]">
                  Reward: <span className="dark:text-[#37DD00] text-[#00b3d3]">{block.reward}</span>
                </p>
                <a
                  className="text-nowrap bg-[#ffffff1a] hover:bg-[#ffffff33] transition px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer shadow-md"
                  href={block.minerLink}
                >
                  {block.miner} &gt;
                </a>
              </div>
              <div className="text-right">
                <p className="pb-2 text-sm font-medium text-[#B6FFCE]">
                  {block.trx}
                </p>
                <div className="pb-2 flex items-center justify-end space-x-1 text-[#B6FFCE]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="red"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                    />
                  </svg>
                  <p className="font-medium text-sm">{block.pox}</p>
                </div>
                <p className="text-sm font-medium text-[#888888]">
                  {block.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeThird;
