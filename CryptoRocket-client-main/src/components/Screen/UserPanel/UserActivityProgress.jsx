import React, { useMemo } from 'react';
import { TrendingUp, Star, Crown, Award, Target, DollarSign, ArrowUp, Zap, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const UserActivityProgress = ({ totalInvestment = 0, dashboardData }) => {
  const userInfo = useSelector((state) => state?.isLoggedUser?.data);
  const user = dashboardData?.user || userInfo || {};

  const currentRank = dashboardData?.rank?.current || 'No Rank';
  const nextRankObj = dashboardData?.rank?.next;
  console.log("nextRankObj", nextRankObj);
  // Rank Reward Mapping (Backup if not in nextRankObj)
  const rankRewards = {
    'Z-1': 30, 'Z-2': 100, 'Z-3': 250, 'Z-4': 500, 'Z-5': 1250,
    'Z-6': 2500, 'Z-7': 6000, 'Z-8': 10000, 'Z-9': 25000, 'Z-10': 50000
  };

  const getRankColor = (r) => {
    if (!r || r === 'Member' || r === 'No Rank') return 'bronze';
    // Extract number from Z-X
    const match = r.match(/Z-(\d+)/);
    if (!match) return 'bronze';
    const num = parseInt(match[1]);

    if (num <= 2) return 'bronze';
    if (num <= 5) return 'silver';
    if (num <= 8) return 'gold';
    if (num <= 9) return 'platinum';
    return 'diamond';
  };

  const getColorClasses = (color) => {
    const colors = {
      bronze: { bg: "bg-chamoisee/20", border: "border-chamoisee/30", text: "text-chamoisee", glow: "shadow-chamoisee/20" },
      silver: { bg: "bg-beaver/20", border: "border-beaver/30", text: "text-beaver", glow: "shadow-beaver/20" },
      gold: { bg: "bg-ecru/20", border: "border-ecru/30", text: "text-ecru", glow: "shadow-ecru/20" },
      platinum: { bg: "bg-delft-blue/20", border: "border-delft-blue/30", text: "text-delft-blue", glow: "shadow-delft-blue/20" },
      diamond: { bg: "bg-space-cadet-2/20", border: "border-space-cadet-2/30", text: "text-space-cadet-2", glow: "shadow-space-cadet-2/20" }
    };
    return colors[color] || colors.bronze;
  };

  const currentColors = getColorClasses(getRankColor(currentRank));
  const nextColors = getColorClasses(nextRankObj ? getRankColor(nextRankObj.rank) : 'diamond');

  const CurrentLevelIcon = currentRank === 'Z-10' ? Crown : Star;
  const NextLevelIcon = Crown;

  // Calculate 2.5x goal (Retained feature)
  const investmentGoal = useMemo(() => {
    const investment = Number(totalInvestment) || 0;
    return investment * 2.5;
  }, [totalInvestment]);

  // Rank Progress
  const rankProgress = useMemo(() => {
    if (!nextRankObj) return 100;

    const currentDirects = user.directs || 0;
    const currentTeam = user.totalTeam || 0;

    let progressSum = 0;
    let criteriaCount = 0;

    // Directs Metric
    if (nextRankObj.direct > 0) {
      progressSum += Math.min((currentDirects / nextRankObj.direct) * 100, 100);
      criteriaCount++;
    }

    // Team Metric (if applicable)
    if (nextRankObj.team > 0) {
      progressSum += Math.min((currentTeam / nextRankObj.team) * 100, 100);
      criteriaCount++;
    }

    // If only structure required (Z-2+ with 0 Team count requirement), display Indeterminate or Direct Progress
    if (criteriaCount === 0 && nextRankObj.reqRank) {
      // Assume 0% if structured check fails (cannot calc easily on frontend), or show Direct progress
      return currentDirects >= nextRankObj.direct ? 50 : (currentDirects / nextRankObj.direct) * 50;
    }

    return criteriaCount > 0 ? progressSum / criteriaCount : 0;
  }, [nextRankObj, user]);

  return (
    <div className="rounded-3xl shadow-2xl hover:shadow-glow transition-all duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border ${currentColors.border} shadow-lg ${currentColors.glow} ${currentColors.bg}`}>
            <CurrentLevelIcon className={`w-8 h-8 ${currentColors.text}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-hero-primary mb-1">Rank Progress</h2>
            <p className="text-hero-secondary">Track your journey to {nextRankObj ? nextRankObj.rank : 'Top Rank'}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-hero-primary gradient-text">${Number(totalInvestment || 0).toLocaleString()}</div>
          <div className="text-sm text-hero-secondary">Total Investment</div>
        </div>
      </div>

      {/* Stats Cards - Rank Focused */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Card 1: Current Rank */}
        <div className="card relative overflow-hidden group border border-glass-border p-6 rounded-2xl hover:border-delft-blue/50 transition-all duration-300 bg-space-cadet/30">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CurrentLevelIcon className="w-24 h-24 text-hero-primary" />
          </div>
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${currentColors.bg} ${currentColors.border} border`}>
              <CurrentLevelIcon className={`w-6 h-6 ${currentColors.text}`} />
            </div>
            <p className="text-hero-secondary text-sm font-medium mb-1">Current Rank</p>
            <h3 className="text-3xl font-bold text-white mb-2">{currentRank}</h3>
            <p className="text-xs text-hero-secondary">Your achieved status</p>
          </div>
        </div>

        {/* Card 2: Total Rewards */}
        <div className="card relative overflow-hidden group border border-glass-border p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 bg-space-cadet/30">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-emerald-500/20 border border-emerald-500/30">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-hero-secondary text-sm font-medium mb-1">Total Rewards</p>
            <h3 className="text-3xl font-bold text-emerald-400 mb-2">${Number(dashboardData?.incomes?.rankReward?.total || 0).toLocaleString()}</h3>
            <p className="text-xs text-hero-secondary">Total Rank Rewards Earned</p>
          </div>
        </div>

        {/* Card 3: Next Goal */}
        <div className="card relative overflow-hidden group border border-glass-border p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 bg-space-cadet/30">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-blue-400" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-500/20 border border-blue-500/30">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-hero-secondary text-sm font-medium mb-1">Next Goal</p>
            <h3 className="text-3xl font-bold text-blue-400 mb-2">{nextRankObj ? nextRankObj.rank : 'Z-1'}</h3>
            <p className="text-xs text-hero-secondary">
              {nextRankObj ? `Direct: ${nextRankObj.direct}, Team: ${nextRankObj.team > 0 ? nextRankObj.team : 'Structure'}` : 'All goals achieved'}
            </p>
          </div>
        </div>

      </div>

      {/* Rank Progress Bar */}
      <div className="hero-glass border border-glass-border p-6 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-4">
          {/* Current */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${currentColors.border} ${currentColors.bg}`}>
              <CurrentLevelIcon className={`w-5 h-5 ${currentColors.text}`} />
            </div>
            <div>
              <div className="text-lg font-bold text-hero-primary">{currentRank || 'Member'}</div>
              <div className="text-sm text-hero-secondary">Current Rank</div>
            </div>
          </div>

          <ArrowUp className="w-6 h-6 text-beaver animate-bounce" />

          {/* Next */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold text-hero-primary">{nextRankObj ? nextRankObj.rank : 'Z-1'}</div>
              <div className="text-sm text-hero-secondary">Next Rank</div>
            </div>
            <div className={`p-2 rounded-lg border ${nextColors.border} ${nextColors.bg}`}>
              <NextLevelIcon className={`w-5 h-5 ${nextColors.text}`} />
            </div>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="w-full bg-space-cadet/50 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${rankProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ecru/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="absolute -top-5 left-0 right-0 flex justify-between text-xs text-hero-secondary">
            <span>{currentRank}</span>
            <span>{rankProgress.toFixed(1)}% to {nextRankObj?.rank}</span>
            <span>{nextRankObj?.rank}</span>
          </div>
        </div>

        {/* Requirements Text */}
        {nextRankObj && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-chamoisee/10 rounded-xl border border-chamoisee/20">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-chamoisee" />
              <span className="text-hero-secondary text-sm">Directs: <span className="text-hero-primary font-bold">{user.directs || 0}/{nextRankObj.direct}</span></span>
            </div>
            {nextRankObj.team > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-chamoisee" />
                <span className="text-hero-secondary text-sm">Team: <span className="text-hero-primary font-bold">{user.totalTeam || 0}/{nextRankObj.team}</span></span>
              </div>
            )}
            {nextRankObj.reqRank && (
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-chamoisee" />
                <span className="text-hero-secondary text-sm">Requires: <span className="text-hero-primary font-bold">{nextRankObj.reqCount} x {nextRankObj.reqRank}</span></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 border ${currentColors.border} rounded-xl ${currentColors.bg}`}>
          <h4 className={`font-bold ${currentColors.text} mb-3 flex items-center gap-2`}>
            <CurrentLevelIcon className="w-5 h-5" />
            Current Reward
          </h4>
          <div className="text-2xl font-bold text-hero-primary">
            ${rankRewards[currentRank] || 0}
          </div>
          <p className="text-sm text-hero-secondary mt-1">Status Award</p>
        </div>

        <div className={`p-5 border ${nextColors.border} rounded-xl opacity-75 hover:opacity-100 transition-opacity duration-300 ${nextColors.bg}`}>
          <h4 className={`font-bold mb-3 flex items-center gap-2`}>
            <NextLevelIcon className="w-5 h-5" />
            Next Rank Reward
          </h4>
          <div className="text-2xl font-bold text-hero-primary">
            ${nextRankObj ? nextRankObj.reward : 30}
          </div>
          <p className="text-sm text-hero-secondary mt-1">Complete requirements to unlock</p>
        </div>
      </div>

    </div>
  );
};

export default UserActivityProgress;