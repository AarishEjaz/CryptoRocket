import React, { useEffect, useState, useMemo } from "react";
import { fetchCoinMarkets } from "../../../api/extra.api";
import { setLoading } from "../../../redux/slices/loadingSlice";
import { getAllTradingIncomeHistory, tradeInAi, getAiTradeStatus } from "../../../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import LiveMarketChart from "./LiveMarketChart";
import CoinListItem from "./CoinListItem";
import DataTable from "./DataTable";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AiTrade = () => {
  const [countdownTime, setCountdownTime] = useState(0); // Time in seconds until midnight
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [allCoins, setAllCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("30");
  const dispatch = useDispatch();
  const [allTradingIncomeHistory, setAllTradingIncomeHistory] = useState([]);
  const location = useLocation();
  const data = location?.state;

  const fetchAllTradingIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllTradingIncomeHistory();
      if (response?.success) {
        setAllTradingIncomeHistory(response?.data?.history);
      } else {
        setAllTradingIncomeHistory([]);
        toast.error(response?.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllTradingIncomeHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allTradingIncomeHistory.filter((item) =>
          isToday(new Date(item.createdAt))
        )
      : allTradingIncomeHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-cyan-300">{rowIndex + 1}</span>
      ),
    },
    {
      header: "User ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-cyan-300">
          {row?.user?.username || "N/A"}
        </span>
      ),
      searchValue: (row) => row?.user?.username
    },
    {
      header: "Package",
      accessor: "package.title",
      cell: (row) => (
        <span className="font-medium text-cyan-300">
          {row?.package?.title || "N/A"}
        </span>
      ),
      searchValue: (row) => row?.package?.title
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-cyan-300 text-nowrap">
          $ {row?.amount}
        </span>
      ),
    },
    {
      header: "Income",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-blue-400">
          $ {row?.income.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Percentage",
      accessor: "percentage",
      cell: (row) => (
        <span className="font-medium text-cyan-300">
          {row?.percentage.toFixed(2)}%
        </span>
      ),
    },
    {
      header: "Reward Paid",
      accessor: "rewardPaid",
      cell: (row) => (
        <span className="font-medium text-cyan-300">{row?.rewardPaid}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${
            row?.status === "Completed" ? "text-blue-500" : "text-cyan-400"
          }`}
        >
          {row?.status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-cyan-200">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setCountdownTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setIsButtonDisabled(false);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const timeframeOptions = [
    { label: "24H", value: "1" },
    { label: "7D", value: "7" },
    { label: "1M", value: "30" },
    { label: "3M", value: "90" },
  ];

  const activeTimeframeLabel =
    timeframeOptions.find((opt) => opt.value === timeframe)?.label ||
    `${timeframe} Days`;

  const fetchAllCoins = async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchCoinMarkets();
      setAllCoins(data);
      setSelectedCoin(data?.[0]);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllCoins();
    const interval = setInterval(() => {
      fetchAllCoins();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAiTradeStatus = async () => {
      try {
        const res = await getAiTradeStatus();
        if (res?.success && !res?.data?.canTrade) {
          setIsButtonDisabled(true);
          setCountdownTime(res?.data?.remainingTime || 0);
        } else {
          setIsButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching AI trade status:", error);
      }
    };
    fetchAiTradeStatus();
  }, []);

  const handleAiTradeClick = async () => {
    dispatch(setLoading(true));
    try {
      const res = await tradeInAi();
      if (res?.success) {
        toast.success(res?.message);
        setIsButtonDisabled(true);
        setCountdownTime(86400);
        const statusRes = await getAiTradeStatus();
        if (statusRes?.success && !statusRes?.data?.canTrade) {
          setCountdownTime(statusRes?.data?.remainingTime || 86400);
        }
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error trading in AI:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const filteredCoins = useMemo(() => {
    return allCoins?.filter(
      (coin) =>
        coin?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        coin?.symbol?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [allCoins, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cyan-900/40 backdrop-blur-lg border border-cyan-700/50 rounded-2xl p-6 ">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-4">
              {selectedCoin && (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCoin.image}
                    alt={selectedCoin.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-cyan-200">
                      {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
                    </h2>
                    <p className="text-sm text-cyan-400">
                      Last {activeTimeframeLabel}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-cyan-900/50 p-1 rounded-lg">
                {timeframeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      timeframe === opt.value
                        ? "bg-blue-600 text-white"
                        : "text-cyan-300 hover:bg-cyan-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <LiveMarketChart coinId={selectedCoin?.id} days={timeframe} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleAiTradeClick}
              disabled={isButtonDisabled}
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-xl 
                font-semibold text-lg transition-colors shadow-lg focus:outline-none focus:ring-2 ${
                isButtonDisabled 
                  ? 'bg-cyan-700 text-cyan-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-cyan-600/20 focus:ring-cyan-400 cursor-pointer'
              }`}
            >
              <i className="fa-solid fa-robot"></i>
              <span>
                {isButtonDisabled
                  ? `Next trade in ${formatCountdown(countdownTime)}`
                  : "Start AI Trade"}
              </span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 bg-cyan-900/40 backdrop-blur-lg border border-cyan-700/50 rounded-2xl p-4 flex flex-col h-[600px]">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search coin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cyan-900/50 border border-cyan-700 rounded-full py-2 pl-10 pr-4 text-cyan-200 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {filteredCoins?.map((coin, index) => (
              <CoinListItem
                key={`coin-${index}`}
                coin={coin}
                onSelect={setSelectedCoin}
              />
            ))}
          </div>
        </div>
      </div>
      <DataTable
        title="Trading Profit Income History"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />
    </div>
  );
};

export default AiTrade;

