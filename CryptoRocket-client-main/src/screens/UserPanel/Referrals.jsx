import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Pagination from "../../components/Screen/UserPanel/Pagination";
import PartnerCard from "../../components/Screen/UserPanel/PartnerCard";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getReferralPartners } from "../../api/user.api";
import { useLocation } from "react-router-dom";
import { AuthenticatedUserRouters } from "../../constants/routes";


const Referrals = () => {
  const location = useLocation();
  const navData = location?.state;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [data, setData] = useState([]);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePartners = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const fetchNetworkData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getReferralPartners();
      setData(res?.data?.partners || []);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const filteredUsers = data.filter((user) => {
    if (navData === "active") {
      return user.active?.isActive === true;
    } else if (navData === "inactive") {
      return user.active?.isActive === false;
    }
    return true; // If no filter, return all users
  });

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
        {filteredUsers.length > 0 ? (
          filteredUsers?.map((partner, index) => (
          <PartnerCard key={partner.id} partner={partner} index={index} />
        ))) : (
          <p className="text-slate-400 ">No referrals found.</p>
        )}
      </div>

      {data?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Referrals;
