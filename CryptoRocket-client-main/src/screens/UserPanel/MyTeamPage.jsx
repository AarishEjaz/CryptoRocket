import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getAllTeamMembers } from "../../api/user.api";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { NumberFormatCommas } from "../../utils/FormatText";
import moment from "moment";
import Pagination from "../../components/Screen/UserPanel/Pagination";

// Team member table component
const TeamMemberTable = ({ members, title, teamColor, totalBusiness }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(members?.length / itemsPerPage);
  useEffect(() => {
    console.log("members ",members)
  }, [members]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleMembers = members?.slice(startIndex, startIndex + itemsPerPage) || [];

  const getBadgeColor = (level) => {
    if (level === 0) return "bg-gray-500/20 text-gray-400";
    if (level <= 3) return "bg- blue -500/20 text- blue -400";
    if (level <= 6) return "bg-blue-500/20 text-blue-400";
    if (level <= 10) return "bg-purple-500/20 text-purple-400";
    if (level <= 15) return "bg-orange-500/20 text-orange-400";
    if (level <= 20) return "bg-red-500/20 text-red-400";
    if (level <= 25) return "bg-pink-500/20 text-pink-400";
    return "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b border-slate-700/60 ${teamColor}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">
              Total Members: <span className="text-white font-semibold">{members?.length || 0}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl">
            <i className="fa-solid fa-chart-line text-emerald-400"></i>
            <span className="text-slate-400 text-sm">Total Business:</span>
            <span className="text-emerald-400 font-bold">
              $<NumberFormatCommas value={totalBusiness || 0} decimalScale={2} />
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/40 text-slate-400 text-sm">
              <th className="text-left px-4 py-3 font-medium">#</th>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Level</th>
              <th className="text-left px-4 py-3 font-medium">Investment</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {visibleMembers.length > 0 ? (
              visibleMembers.map((member, index) => (
                <tr
                  key={member._id || index}
                  className="border-b border-slate-700/40 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/8.x/bottts/svg?seed=${member.id || index}`}
                        alt={member.username}
                        className="w-10 h-10 rounded-full border border-slate-600"
                      />
                      <div>
                        <p className="font-semibold text-white">{member.username || "N/A"}</p>
                        <p className="text-xs text-slate-400">
                          {maskWalletAddress(member.walletAddress) || "No wallet"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(member.level)}`}>
                      {member.level === 0 || !member.level ? "No-Level" : `Level ${member.level}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-400 font-semibold">
                      $<NumberFormatCommas value={member.investment || 0} decimalScale={2} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${member.active?.isActive
                      ? "bg- blue -500/20 text- blue -400"
                      : "bg-red-500/20 text-red-400"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.active?.isActive ? "bg- blue -400" : "bg-red-400"
                        }`}></span>
                      {member.active?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {member.createdAt ? moment(member.createdAt).format("DD MMM YYYY") : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <i className="fa-solid fa-users-slash text-4xl text-slate-600"></i>
                    <p className="text-slate-400">No team members found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {members?.length > itemsPerPage && (
        <div className="p-4 border-t border-slate-700/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

// Stats card component
const StatCard = ({ icon, label, value, color, subValue }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white font-bold text-xl">{value}</p>
        {subValue && (
          <p className="text-slate-500 text-xs">{subValue}</p>
        )}
      </div>
    </div>
  </div>
);

const MyTeamPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [allMembers, setAllMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserLevel, setCurrentUserLevel] = useState(0);

  const fetchTeamData = async () => {
    try {
      dispatch(setLoading(true));

      // Fetch all team members with level calculation debug
      console.log("🔍 [GET MY TEAM] Starting team members fetch with level calculation debug...");
      const allMembersRes = await getAllTeamMembers();
      if (allMembersRes?.success) {
        const members = allMembersRes.data?.members || [];
        console.log(`📊 [GET MY TEAM] Total team members fetched: ${members.length}`);

        // Get current user's level from API response
        const currentLevel = allMembersRes.data?.currentUserLevel || 0;
        setCurrentUserLevel(currentLevel);
        console.log(`👤 [CURRENT USER] Your Level: ${currentLevel}`);

        // Debug level calculation for each member
        members.forEach((member, index) => {
          console.log(`\n🔍 [MEMBER ${index + 1}] Level Debug for ${member.username}:`);
          console.log(`  💰 Investment: $${member.investment}`);
          console.log(`  📊 Current Level: ${member.level}`);
          console.log(`  ✅ Active Status: ${member.active?.isActive ? 'Active' : 'Inactive'}`);
          console.log(`  🆔 User ID: ${member.id}`);

          // New level qualification logic explanation
          if (!member.investment || member.investment < 100) {
            console.log(`  ❌ No-Level: Self investment < $100 (${member.investment})`);
          } else {
            console.log(`  ✅ Self investment qualified: $${member.investment} >= $100`);

            // Show level qualification based on new system
            if (member.level >= 25) {
              console.log(`  🏆 Level 25: Z-1 QUALIFIED (10+ direct + 30+ team members)`);
              console.log(`  📊 Unlocks all levels 1-25`);
            } else if (member.level >= 16) {
              console.log(`  🥇 Level 16: Criteria - 15+ qualified direct referrals`);
            } else if (member.level >= 10) {
              console.log(`  🥈 Level 10: Criteria - 10+ qualified direct referrals`);
            } else if (member.level >= 6) {
              console.log(`  🥉 Level 6: Criteria - 6+ qualified direct referrals`);
            } else if (member.level >= 3) {
              console.log(`  🥉 Level 3: Criteria - 3+ qualified direct referrals`);
            } else if (member.level >= 1) {
              console.log(`  🎯 Level 1: Criteria - 1+ qualified direct referrals`);
            } else {
              console.log(`  ⏳ No-Level: Needs qualified direct referrals to unlock levels`);
            }

            console.log(`  📌 Z-1 Level System:`);
            console.log(`    🎯 Z-1 QUALIFICATION: 10+ direct + 30+ team members (max 15 per leg) → Level 25`);
            console.log(`    📋 Fallback: Progressive levels based on direct referrals only`);
          }
        });

        console.log(`\n📋 [GET MY TEAM] Level Distribution Summary:`);
        const levelCounts = {};
        members.forEach(member => {
          const level = member.level || 0;
          levelCounts[level] = (levelCounts[level] || 0) + 1;
        });

        Object.keys(levelCounts).sort((a, b) => Number(b) - Number(a)).forEach(level => {
          console.log(`  Level ${level}: ${levelCounts[level]} members`);
        });

        setAllMembers(members);
      }
    } catch (error) {
      console.error("❌ [GET MY TEAM] Error fetching team data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // Filter members based on search
  const filterMembers = (members) => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(m =>
      m.username?.toLowerCase().includes(query) ||
      m.id?.toString().includes(query) ||
      m.walletAddress?.toLowerCase().includes(query)
    );
  };

  // Get members for current tab
  const getCurrentTabMembers = () => {
    if (activeTab === "all") {
      return allMembers;
    }

    // Handle level-based filtering
    if (activeTab.startsWith("level")) {
      const level = parseInt(activeTab.replace("level", ""));
      return allMembers.filter(member => member.level === level);
    }

    return allMembers;
  };

  // Generate tabs for levels 1-25
  const generateTabs = () => {
    const tabs = [
      { id: "all", label: "All Members", icon: "fa-users", color: "bg-gradient-to-r from-blue-600 to-blue-500" }
    ];

    // Level 0 to 25
    for (let i = 0; i <= 25; i++) {
      const colors = [
        "bg-gradient-to-r from- blue -600 to- blue -500",
        "bg-gradient-to-r from-blue-600 to-blue-500",
        "bg-gradient-to-r from-purple-600 to-purple-500",
        "bg-gradient-to-r from-orange-600 to-orange-500",
        "bg-gradient-to-r from-red-600 to-red-500",
        "bg-gradient-to-r from-pink-600 to-pink-500"
      ];

      const icons = [
        "fa-crown", "fa-medal", "fa-award", "fa-star", "fa-gem", "fa-trophy"
      ];

      let icon, color;
      if (i === 0) {
        icon = "fa-user"; // or any icon for level 0
        color = "bg-gradient-to-r from-gray-600 to-gray-500";
      } else {
        icon = icons[Math.floor((i - 1) / 5) % icons.length];
        color = colors[Math.floor((i - 1) / 5) % colors.length];
      }

      tabs.push({
        id: `level${i}`,
        label: i === 0 ? "No-Level" : `Level ${i}`,
        icon: icon,
        color: color
      });
    }

    return tabs;
  };

  const tabs = generateTabs();

  const getTabColor = () => {
    if (activeTab.startsWith("level")) {
      const level = parseInt(activeTab.replace("level", ""));
      if (level === 0) return "bg-gradient-to-r from-gray-900/30 to-slate-900/20";
      if (level >= 20) return "bg-gradient-to-r from-pink-900/30 to-rose-900/20";
      if (level >= 15) return "bg-gradient-to-r from-red-900/30 to-pink-900/20";
      if (level >= 10) return "bg-gradient-to-r from-orange-900/30 to-red-900/20";
      if (level >= 5) return "bg-gradient-to-r from-purple-900/30 to-orange-900/20";
      return "bg-gradient-to-r from-blue-900/30 to-purple-900/20";
    }
    return "bg-gradient-to-r from-blue-900/30 to-cyan-900/20";
  };

  const getTabTitle = () => {
    if (activeTab === "all") {
      return "All Team Members";
    }

    if (activeTab.startsWith("level")) {
      const level = parseInt(activeTab.replace("level", ""));
      return level === 0 ? "No-Level Members" : `Level ${level} Members`;
    }

    return "All Team Members";
  };

  const getTabBusiness = () => {
    const currentMembers = getCurrentTabMembers();
    return currentMembers.reduce((total, member) => total + (member.investment || 0), 0);
  };

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    if (level >= 25) return "bg-pink-500/20 text-pink-400 border-pink-400/30";
    if (level >= 20) return "bg-red-500/20 text-red-400 border-red-400/30";
    if (level >= 15) return "bg-orange-500/20 text-orange-400 border-orange-400/30";
    if (level >= 10) return "bg-purple-500/20 text-purple-400 border-purple-400/30";
    if (level >= 5) return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    if (level >= 1) return "bg- blue -500/20 text- blue -400 border- blue -400/30";
    return "bg-gray-500/20 text-gray-400 border-gray-400/30";
  };

  // Get level distribution
  const getLevelDistribution = () => {
    const levelCounts = {};
    allMembers.forEach(member => {
      const level = member.level || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    return levelCounts;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <i className="fa-solid fa-sitemap text-blue-500"></i>
            My Team
          </h1>
          <p className="text-slate-400 mt-1">
            View your team members by level qualification
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by username, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 bg-slate-800/50 border border-slate-700 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
        </div>
      </div>

      {/* Current User Level Display */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/30">
              <i className="fa-solid fa-user-crown text-2xl text-blue-400"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Your Current Level
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getLevelBadgeColor(currentUserLevel)}`}>
                  Level {currentUserLevel}
                </span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {currentUserLevel >= 25 && "🏆 Maximum level achieved! 15+ qualified direct referrals"}
                {currentUserLevel >= 16 && currentUserLevel < 25 && "🥇 Criteria - 10+ qualified direct referrals"}
                {currentUserLevel >= 10 && currentUserLevel < 16 && "🥈 Criteria - 6+ qualified direct referrals"}
                {currentUserLevel >= 3 && currentUserLevel < 10 && "🥉 Criteria - 3+ qualified direct referrals"}
                {currentUserLevel >= 1 && currentUserLevel < 3 && "🎯 Criteria - 1+ qualified direct referrals"}
                {currentUserLevel === 0 && "⏳ Need qualified direct referrals to unlock levels"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Team Size</p>
            <p className="text-2xl font-bold text-white">{allMembers.length}</p>
            <p className="text-slate-500 text-xs">Total Members</p>
          </div>
        </div>
      </div>



      {/* Stats Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-h-96 overflow-y-auto">
        <StatCard
          icon="fa-users"
          label="Total Team"
          value={allMembers.length || 0}
          color="bg-blue-500/20 text-blue-400"
        />
        {Array.from({ length: 26 }, (_, i) => {
          const level = i; // Start from Level 0
          const levelMembers = allMembers.filter(member => (member.level || 0) === level);
          const levelBusiness = levelMembers.reduce((sum, member) => sum + (member.investment || 0), 0);

          const colors = [
            "bg- blue -500/20 text- blue -400",
            "bg-blue-500/20 text-blue-400",
            "bg-purple-500/20 text-purple-400",
            "bg-orange-500/20 text-orange-400",
            "bg-red-500/20 text-red-400",
            "bg-pink-500/20 text-pink-400"
          ];

          const icons = [
            "fa-crown", "fa-medal", "fa-award", "fa-star", "fa-gem", "fa-trophy"
          ];

          let icon, color;
          if (level === 0) {
            icon = "fa-user";
            color = "bg-gray-500/20 text-gray-400";
          } else {
            icon = icons[Math.floor((level - 1) / 5) % icons.length];
            color = colors[Math.floor((level - 1) / 5) % colors.length];
          }

          return (
            <StatCard
              key={level}
              icon={icon}
              label={level === 0 ? "No-Level Members" : `Level ${level} Members`}
              value={levelMembers.length}
              color={color}
              subValue={levelBusiness > 0 ? `$${levelBusiness.toLocaleString()}` : undefined}
            />
          );
        })}
      </div> */}

      {/* Tabs */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                ? `${tab.color} text-white shadow-lg`
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span className="text-sm">{tab.label}</span>
              <span className="bg-slate-900/50 px-2 py-0.5 rounded-full text-xs">
                {tab.id === "all" ? (allMembers.length || 0) :
                  tab.id.startsWith("level") ? (
                    allMembers.filter(member => member.level === parseInt(tab.id.replace("level", ""))).length || 0
                  ) : 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Team Info Banner */}
      {activeTab !== "all" && activeTab.startsWith("level") && (
        <div className={`p-4 rounded-xl border border-slate-700/60 ${getTabColor()}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-users text-blue-400 text-2xl"></i>
              <div>
                <h3 className="font-bold text-white">{getTabTitle()}</h3>
                <p className="text-slate-400 text-sm">
                  {parseInt(activeTab.replace("level", "")) === 0 
                    ? "Team members who have not achieved any level qualification yet"
                    : `Team members who have achieved Level ${parseInt(activeTab.replace("level", ""))} qualification`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Table */}
      <TeamMemberTable
        members={filterMembers(getCurrentTabMembers())}
        title={getTabTitle()}
        teamColor={getTabColor()}
        totalBusiness={getTabBusiness()}
      />

      {/* Info Note */}
      <div className="bg-slate-900/30 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-circle-info text-blue-400 mt-0.5"></i>
          <div>
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-white">Level System:</span> Team members are organized by their level qualification based on direct referrals and team building.
            </p>
            <ul className="mt-2 text-slate-400 text-sm space-y-1">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-crown text-amber-400 w-4"></i>
                <span><strong className="text-amber-400">Level 25</strong> - 15+ qualified direct referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-medal text-slate-300 w-4"></i>
                <span><strong className="text-slate-300">Level 16</strong> - 10+ qualified direct referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-award text-orange-400 w-4"></i>
                <span><strong className="text-orange-400">Level 10</strong> - 6+ qualified direct referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-star text-purple-400 w-4"></i>
                <span><strong className="text-purple-400">Level 3</strong> - 3+ qualified direct referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text- blue -400 w-4"></i>
                <span><strong className="text- blue -400">Level 1</strong> - 1+ qualified direct referrals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeamPage;
