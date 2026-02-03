import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Pagination from "../../components/Screen/UserPanel/Pagination";
import PartnerCard from "../../components/Screen/UserPanel/PartnerCard";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getDirectUsers } from "../../api/user.api";

const partnersData = [
  {
    id: 7321,
    address: "0xAb...c7dE",
    earnings: 10500,
    partnersCount: 15,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=1",
  },
  {
    id: 8456,
    address: "0xCd...e8fG",
    earnings: 8200,
    partnersCount: 12,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=2",
  },
  {
    id: 9123,
    address: "0xEf...h9iJ",
    earnings: 7650,
    partnersCount: 10,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=3",
  },
  {
    id: 1024,
    address: "0xGh...j0kL",
    earnings: 5300,
    partnersCount: 8,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=4",
  },
  {
    id: 1157,
    address: "0xIj...l1mN",
    earnings: 4100,
    partnersCount: 7,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=5",
  },
  {
    id: 1289,
    address: "0xKl...m2oP",
    earnings: 2500,
    partnersCount: 4,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=6",
  },
  {
    id: 7321,
    address: "0xAb...c7dE",
    earnings: 10500,
    partnersCount: 15,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=1",
  },
  {
    id: 8456,
    address: "0xCd...e8fG",
    earnings: 8200,
    partnersCount: 12,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=2",
  },
  {
    id: 9123,
    address: "0xEf...h9iJ",
    earnings: 7650,
    partnersCount: 10,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=3",
  },
  {
    id: 1024,
    address: "0xGh...j0kL",
    earnings: 5300,
    partnersCount: 8,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=4",
  },
  {
    id: 1157,
    address: "0xIj...l1mN",
    earnings: 4100,
    partnersCount: 7,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=5",
  },
  {
    id: 1289,
    address: "0xKl...m2oP",
    earnings: 2500,
    partnersCount: 4,
    avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=6",
  },
];

const Teams = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [data, setData] = useState([]);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePartners = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const fetchNetworkData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getDirectUsers();
      // API returns data in res.data.downlines
      const downlines = res?.data?.downlines || [];
      // Map walletAddress to account for PartnerCard component
      const mappedData = downlines.map((downline) => ({
        ...downline,
        account: downline.walletAddress,
      }));
      setData(mappedData);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []); 

  return (
    <div className="space-y-8 mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* <div>
          <h1 className="text-3xl font-bold text-white">My Partners</h1>
          <p className="text-slate-400 mt-1">View and manage all your partners.</p>
        </div> */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by ID or address..."
            className="w-full md:w-72 bg-slate-800/50 border border-slate-700 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visiblePartners.length > 0 ? (
          visiblePartners?.map((partner, index) => (
          <PartnerCard key={partner.id} partner={partner} index={index} />
        ))) : (
          <p className="text-slate-400 ">No team found.</p>
        )}
      </div>

      {data?.length > 8 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Teams;
