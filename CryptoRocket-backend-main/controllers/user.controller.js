const mongoose = require("mongoose");
const { TransactionModel } = require("../models/transaction.model");
const { UserModel } = require("../models/user.model");
const { RewardModel } = require("../models/reward.model");
const { CommissionIncome } = require("../models/commission.model");
const {
  getDownlineArray,
  getDirectPartnersDownlines,
  getDownlineTree,
} = require("../utils/getteams.downline");
const { calculateTeamDivision, saveTeamDivision } = require("../utils/teamDivision.calculation");
const { TeamDivisionModel } = require("../models/teamDivision.model");
const ethers = require("ethers");
const ROIHistory = require("../models/roiHistory");
const {
  calculateDailyROIForUser,
  distributeGenerationROI,
} = require("../controllers/roi.controller");
const generationHistory = require("../models/generation.model");
const { IncomeModel } = require("../models/income.model");
require('dotenv').config({ path: './.env' });

exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate({ path: "incomeDetails", select: "income" })
      .populate({ path: "sponsor", select: "id username -_id" });
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "User not found." });
    const activeUsers = await UserModel.countDocuments({
      sponsor: user._id,
      "active.isActive": true,
    });
    res.status(200).json({
      success: true,
      data: { ...user._doc, activeUsers },
      role: user.role,
      token: user.token.token,
      message: "Get Profile successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.ProfilePictureUpdate = async (req, res) => {
  try {
    const { picture } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "User not found." });
    if (user.picture != picture) {
      user.picture = await uploadToImageKit(picture, "Profiles");
      await user.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Profile Picture update successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDirectPartners = async (req, res) => {
  const userId = req.user._id;
  try {
    const partners = await UserModel.find({ sponsor: userId })
      .populate("partners")
      .sort({ createdAt: -1 });
    console.log(partners);
    res.status(200).json({
      success: true,
      data: partners,
      message: "Get Partners successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTradingProfitIncomes = async (req, res) => {
  try {
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Trading Profit Income",
    })
      .populate("user")
      .sort({ createdAt: -1 });

    const totalIncome = history.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLevelIncome = history.filter(
      (investment) => investment.createdAt >= startOfToday
    );
    const todayTotal = todayLevelIncome.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    res.status(200).json({
      success: true,
      message: "Trading Profit Income Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getLevelIncomes = async (req, res) => {
  try {
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Level ROI Dividend",  // ✅ Only ROI Dividend
    })
      .populate({ path: "user fromUser", select: "id account username" });
    const totalIncome = history.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    console.log("history: ", history)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLevelIncome = history.filter(
      (investment) => investment.createdAt >= startOfToday
    );
    const todayTotal = todayLevelIncome.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    res.status(200).json({
      success: true,
      message: "Level ROI Dividend Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getMatchingIncomes = async (req, res) => {
  try {
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Matching Income",
    });
    const totalIncome = history.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLevelIncome = history.filter(
      (investment) => investment.createdAt >= startOfToday
    );
    const todayTotal = todayLevelIncome.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    res.status(200).json({
      success: true,
      message: "Matching Income Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getGlobalAchieverIncomes = async (req, res) => {
  try {
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Global Archive Reward",
    })
      .populate("user")
      .populate([{ path: "reward", select: "title investment" }]);
    const totalIncome = history.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLevelIncome = history.filter(
      (investment) => investment.createdAt >= startOfToday
    );
    const todayTotal = todayLevelIncome.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    res.status(200).json({
      success: true,
      message: "Global Archive Reward Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/* Rank System Configuration */
const RANK_SYSTEM = [
  { rank: 'Z-1', direct: 10, team: 30, reward: 30, reqRank: null, reqCount: 0 },
  { rank: 'Z-2', direct: 10, team: 0, reward: 100, reqRank: 'Z-1', reqCount: 3 },
  { rank: 'Z-3', direct: 10, team: 0, reward: 250, reqRank: 'Z-2', reqCount: 3 },
  { rank: 'Z-4', direct: 15, team: 0, reward: 500, reqRank: 'Z-3', reqCount: 3 },
  { rank: 'Z-5', direct: 15, team: 0, reward: 1250, reqRank: 'Z-4', reqCount: 3 },
  { rank: 'Z-6', direct: 20, team: 0, reward: 2500, reqRank: 'Z-5', reqCount: 2 },
  { rank: 'Z-7', direct: 20, team: 0, reward: 6000, reqRank: 'Z-6', reqCount: 2 },
  { rank: 'Z-8', direct: 20, team: 0, reward: 10000, reqRank: 'Z-7', reqCount: 2 },
  { rank: 'Z-9', direct: 20, team: 0, reward: 25000, reqRank: 'Z-8', reqCount: 2 },
  { rank: 'Z-10', direct: 30, team: 0, reward: 50000, reqRank: 'Z-9', reqCount: 2 },
];

const getRankPriority = (rankName) => {
  if (!rankName) return 0;
  const idx = RANK_SYSTEM.findIndex(r => r.rank === rankName);
  return idx === -1 ? 0 : idx + 1;
};

const checkAndUpdateRank = async (userId) => {
  try {
    const user = await UserModel.findById(userId).populate({
      path: 'partners',
      match: { 'active.isActive': true, investment: { $gte: 100 } }
    });

    if (!user) return null;

    const currentPriority = getRankPriority(user.currentRank);
    if (currentPriority >= RANK_SYSTEM.length) return user.currentRank;

    const nextRank = RANK_SYSTEM[currentPriority];

    // Special Z-1 rank logic
    if (nextRank.rank === 'Z-1') {
      const directCount = user.partners.length;
      console.log(`🔍 [${user.username}] Z-1 Check - Direct Count: ${directCount}`);

      // Z-1 CONDITION: 10+ Directs + 30+ Team Members (active with $100+ investment)
      if (directCount >= 10) {
        console.log(`📊 [${user.username}] Z-1 Direct Requirement Met: ${directCount} (✅ >= 10)`);

        const teamStats = await getDownlineArray({ userId: user._id });
        const qualifiedTeam = teamStats.activeDownline.filter(u => u.investment >= 100).length;

        console.log(`📊 [${user.username}] Total Team Members: ${qualifiedTeam} (need 30)`);

        if (qualifiedTeam >= 30) {
          console.log(`✅ [${user.username}] Z-1 QUALIFIED: ${directCount} directs + ${qualifiedTeam} team members`);

          user.currentRank = nextRank.rank;
          await user.save();

          const exist = await CommissionIncome.findOne({ user: userId, type: 'Rank Reward', level: nextRank.rank });
          if (!exist) {
            await CommissionIncome.create({
              user: userId,
              type: 'Rank Reward',
              income: nextRank.reward,
              amount: nextRank.reward,
              level: nextRank.rank,
              status: 'Completed',
              remark: `Achieved ${nextRank.rank} with ${directCount} direct + ${qualifiedTeam} team members`
            });
          }

          return await checkAndUpdateRank(userId);
        } else {
          console.log(`❌ [${user.username}] Z-1 NOT QUALIFIED - Need ${30 - qualifiedTeam} more team members`);
        }
      } else {
        console.log(`❌ [${user.username}] Z-1 NOT QUALIFIED - Need ${10 - directCount} more direct referrals`);
      }
      return user.currentRank;
    }

    // For ranks Z-2 to Z-10 (existing logic)
    console.log(`📊 [${user.username}] ${nextRank.rank} Check - Direct: ${user.partners.length} (need ${nextRank.direct})`);

    if (user.partners.length < nextRank.direct) {
      console.log(`❌ [${user.username}] ${nextRank.rank} NOT QUALIFIED - Need ${nextRank.direct - user.partners.length} more direct referrals`);
      return user.currentRank;
    }

    if (nextRank.team > 0) {
      const teamStats = await getDownlineArray({ userId: user._id });
      const qualifiedTeam = teamStats.activeDownline.filter(u => u.investment >= 100).length;
      console.log(`📊 [${user.username}] Team Count: ${qualifiedTeam} (need ${nextRank.team})`);
      if (qualifiedTeam < nextRank.team) {
        console.log(`❌ [${user.username}] ${nextRank.rank} NOT QUALIFIED - Need ${nextRank.team - qualifiedTeam} more team members`);
        return user.currentRank;
      }
    }

    // Check for Ranks Z-2 to Z-10
    if (nextRank.reqRank) {
      const reqPriority = getRankPriority(nextRank.reqRank);
      let qualifiedLegs = 0;
      console.log(`🔍 [${user.username}] Checking ${nextRank.reqCount} legs with ${nextRank.reqRank} rank (Check Level 2 downwards):`);

      // We need to check each leg (each direct partner starts a leg)
      for (const partner of user.partners) {
        // According to "level 2 se jitna level hai vaha tk chek karna hai",
        // we check the downline of each direct partner.

        // 1. First, recursively update downline ranks to be sure
        const dlResult = await getDownlineArray({ userId: partner._id, listShow: true });

        // We might want to trigger updates for members in the downline, 
        // but that could be heavy. For now, we assume their ranks are updated on login/stats fetch.
        // However, let's at least check the direct partner is updated.
        await checkAndUpdateRank(partner._id);

        // 2. Check if the Direct Partner themselves has the rank (Level 1)
        // Even if user said "level 2 se", usually higher levels count. 
        // If you strictly want Level 2+ only, we skip this. 
        // But "level 2 se max" usually means "the team below you".
        const updatedPartner = await UserModel.findById(partner._id).select('currentRank username');
        if (getRankPriority(updatedPartner.currentRank) >= reqPriority) {
          qualifiedLegs++;
          console.log(`  ✅ Partner ${updatedPartner.username} Leg: Partner themselves is ${updatedPartner.currentRank}`);
          continue;
        }

        // 3. Search Level 2 downwards in this leg
        const hasRankInDownline = (dlResult.downline || []).some(d => {
          const isActive = d.active && d.active.isActive && d.investment >= 100;
          if (!isActive) return false;
          return getRankPriority(d.currentRank) >= reqPriority;
        });

        if (hasRankInDownline) {
          qualifiedLegs++;
          console.log(`  ✅ Partner ${updatedPartner.username} Leg: Found ${nextRank.reqRank}+ in Level 2+ downline`);
        } else {
          console.log(`  ❌ Partner ${updatedPartner.username} Leg: No ${nextRank.reqRank} found in Level 2+`);
        }
      }

      console.log(`📊 [${user.username}] Qualified Legs: ${qualifiedLegs} (need ${nextRank.reqCount})`);
      if (qualifiedLegs < nextRank.reqCount) {
        console.log(`❌ [${user.username}] ${nextRank.rank} NOT QUALIFIED - Need ${nextRank.reqCount - qualifiedLegs} more ${nextRank.reqRank} legs`);
        return user.currentRank;
      }
    }

    console.log(`✅ [${user.username}] ${nextRank.rank} QUALIFIED!`);

    user.currentRank = nextRank.rank;
    await user.save();

    const exist = await CommissionIncome.findOne({ user: userId, type: 'Rank Reward', level: nextRank.rank });
    if (!exist) {
      await CommissionIncome.create({
        user: userId,
        type: 'Rank Reward',
        income: nextRank.reward,
        amount: nextRank.reward,
        level: nextRank.rank,
        status: 'Completed',
        remark: `Achieved ${nextRank.rank}`
      });
    }

    return await checkAndUpdateRank(userId);
  } catch (e) {
    console.error("Rank Update Error:", e);
    return null;
  }
};

exports.getRankRewardIncomes = async (req, res) => {
  try {
    // 1. Check/Update Rank
    await checkAndUpdateRank(req.user._id);

    // 2. Fetch Updated User to get currentRank
    const user = await UserModel.findById(req.user._id).select('currentRank');

    // 3. Fetch History
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Rank Reward",
    }).sort({ createdAt: -1 }).populate('user');

    res.status(200).json({
      success: true,
      message: "Rank Reward History",
      data: {
        history,
        currentRank: user.currentRank || 'No Rank',
        nextRank: getRankPriority(user.currentRank) < RANK_SYSTEM.length ? RANK_SYSTEM[getRankPriority(user.currentRank)] : null
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getReferralIncomes = async (req, res) => {
  try {
    const history = await CommissionIncome.find({
      user: req.user._id,
      type: "Referral Income",
    }).populate([{ path: "user fromUser", select: "id account username" }]);
    const totalIncome = history.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayReferralIncome = history.filter(
      (investment) => investment.createdAt >= startOfToday
    );
    const todayTotal = todayReferralIncome.reduce(
      (sum, investment) => sum + investment.income,
      0
    );
    res.status(200).json({
      success: true,
      message: "Referral Incomes Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getInvestmentReports = async (req, res) => {
  try {
    const history = await TransactionModel.find({
      user: req.user._id,
      type: "Deposit",
    }).sort({ createdAt: -1 });
    const totalIncome = history.reduce(
      (total, investment) => total + investment.investment,
      0
    );
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayInvestments = history.filter(
      (txn) => txn.createdAt >= startOfToday
    );
    const todayTotal = todayInvestments.reduce(
      (sum, txn) => sum + txn.investment,
      0
    );
    res.status(200).json({
      success: true,
      message: "Wallet Recharge Investment Reports",
      data: { history, totalIncome, todayTotal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWithdrawalReports = async (req, res) => {
  try {
    const history = await TransactionModel.find({
      user: req.user._id,
      type: "Withdrawal",
    }).sort({ createdAt: -1 });

    // Calculate totals
    const totalAmount = history.reduce(
      (total, investment) => total + (investment.investment || 0),
      0
    );
    const totalProcessingFee = history.reduce(
      (total, txn) => total + (txn.gasFee || 0),
      0
    );
    const totalNetAmount = history.reduce(
      (total, txn) => total + (txn.netAmount || 0),
      0
    );

    // Today's calculations
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayInvestments = history.filter(
      (txn) => txn.createdAt >= startOfToday
    );
    const todayTotal = todayInvestments.reduce(
      (sum, txn) => sum + (txn.investment || 0),
      0
    );
    const todayProcessingFee = todayInvestments.reduce(
      (sum, txn) => sum + (txn.gasFee || 0),
      0
    );
    const todayNetAmount = todayInvestments.reduce(
      (sum, txn) => sum + (txn.netAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "Withdrawal History",
      data: {
        history,
        summary: {
          totalAmount: totalAmount, // Total withdrawal requests
          totalProcessingFee: totalProcessingFee, // Total processing fees paid
          totalNetAmount: totalNetAmount, // Total amount received/expected
          todayTotal: todayTotal,
          todayProcessingFee: todayProcessingFee,
          todayNetAmount: todayNetAmount
        }
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIncomeSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const partners = await UserModel.countDocuments({ sponsor: userId });
    const partnerActive = await UserModel.countDocuments({
      sponsor: userId,
      "active.isActive": true,
      investment: { $gte: 100 }
    });
    const partnerInactive = await UserModel.countDocuments({
      sponsor: userId,
      "active.isActive": false,
    });

    const incomeSources = {
      liveTrading: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Live Trading Income" },
      },
      trading: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Trading Profit Income" },
      },
      level: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Level Income" },
      },
      globalAchiever: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Global Archive Reward" },
      },
      matching: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Matching Income" },
      },
      rankReward: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Rank Reward" },
      },
      referral: {
        model: CommissionIncome,
        field: "income",
        match: { type: "Referral Income" },
      },
      transaction: {
        model: TransactionModel,
        field: "investment",
        match: { type: "Deposit" },
      },
      withdraw: {
        model: TransactionModel,
        field: "investment",
        match: { type: "Withdrawal" },
      },

    };
    const results = {};
    let totalIncome = 0;
    let todayIncome = 0;

    const promises = [];

    for (const key in incomeSources) {
      const { model, field, match = {} } = incomeSources[key];
      const baseMatch = { user: userId, ...match };

      // Total income per source
      promises.push(
        model.aggregate([
          { $match: baseMatch },
          { $group: { _id: null, total: { $sum: `$${field}` } } },
        ])
      );
      // Today's income per source
      promises.push(
        model.aggregate([
          {
            $match: {
              ...baseMatch,
              createdAt: { $gte: todayStart, $lte: todayEnd },
            },
          },
          { $group: { _id: null, total: { $sum: `$${field}` } } },
        ])
      );
    }

    const allResults = await Promise.all(promises);

    Object.keys(incomeSources).forEach((key, i) => {
      const total = allResults[i * 2]?.[0]?.total || 0;
      const today = allResults[i * 2 + 1]?.[0]?.total || 0;

      results[`total${capitalize(key)}`] = total;
      results[`today${capitalize(key)}`] = today;

      if (
        ["trading", "level", "matching", "globalAchiever", "referral"].includes(
          key
        )
      ) {
        totalIncome += total;
        todayIncome += today;
      }
    });
    const { powerLagBusiness, weakerLagBusiness } =
      await getDirectPartnersDownlines({ userId });
    const leftTotal = powerLagBusiness;
    const rightTotal = weakerLagBusiness;
    const maxSideBussiness = Math.min(leftTotal, rightTotal);
    const minSideBussiness = Math.max(leftTotal, rightTotal);
    const totalGlobalBussiness = Number(maxSideBussiness + minSideBussiness);
    const totalRankBussiness = Math.min(leftTotal, rightTotal);

    const { downlineUserIds } = await getDownlineArray({
      userId,
      listShow: false,
    });
    const totalTeamInvestment = await TransactionModel.aggregate([
      {
        $match: {
          user: { $in: downlineUserIds },
          type: "Deposit",
          status: "Completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$investment" } } },
    ]);
    const totalTeamTransaction = totalTeamInvestment?.[0]?.total || 0;

    const todayTeamInvestment = await TransactionModel.aggregate([
      {
        $match: {
          user: { $in: downlineUserIds },
          createdAt: { $gte: todayStart, $lte: todayEnd },
          type: "Deposit",
          status: "Completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$investment" } } },
    ]);
    const todayTeamTransaction = todayTeamInvestment?.[0]?.total || 0;

    // Verify and Update Rank
    const updatedRank = await checkAndUpdateRank(userId);

    // Fetch user with current rank
    const userWithRank = await UserModel.findById(userId).select('currentRank');
    const currentRank = updatedRank || userWithRank?.currentRank || 'No Rank';

    // Calculate next rank
    const currentPriority = getRankPriority(currentRank);
    const nextRankPriority = currentPriority;
    const nextRankObj = nextRankPriority < RANK_SYSTEM.length ? RANK_SYSTEM[nextRankPriority] : null;

    return res
      .status(200)
      .json({
        success: true,
        message: "Get User Income Summary",
        data: {
          ...results,
          totalIncome,
          todayIncome,
          partners,
          partnerActive,
          partnerInactive,
          totalGlobalBussiness,
          totalRankBussiness,
          todayTeamTransaction,
          totalTeamTransaction,
          totalDownlineUsers: downlineUserIds.length - 1,
        },
        rank: {
          current: currentRank,
          next: nextRankObj,
        },
      });
  } catch (error) {
    console.error("Get Income Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// exports.getIncomeSummary = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Recursive helper to get all downline IDs
//     const getDownlineIds = async (ids) => {
//       if (!ids.length) return [];

//       const users = await UserModel.find({ _id: { $in: ids } })
//         .select("leftChild rightChild")
//         .lean();

//       const nextLevelIds = [];
//       users.forEach((user) => {
//         if (user.leftChild) nextLevelIds.push(user.leftChild);
//         if (user.rightChild) nextLevelIds.push(user.rightChild);
//       });

//       const deeperIds = await getDownlineIds(nextLevelIds);
//       return [...nextLevelIds, ...deeperIds];
//     };

//     // Get all downlines
//     const downlineIds = await getDownlineIds([userId]);
//     const totalDownlines = downlineIds.length;

//     // Get user and partners
//     const user = await UserModel.findById(userId).populate("partners").lean();
//     const totalPartners = user.partners.length;
//     const activePartners = user.partners.filter(
//       (p) => p.active?.isActive
//     ).length;
//     const inactivePartners = totalPartners - activePartners;

//     // Time for filtering today's data
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     // Get all transactions
//     const allTransactions = await TransactionModel.find({
//       user: userId,
//       status: "Completed",
//     }).lean();

//     // Withdrawals
//     const withdrawalTransactions = allTransactions.filter(
//       (t) => t.type === "Withdrawal"
//     );
//     const totalWithdrawal = withdrawalTransactions.reduce(
//       (sum, t) => sum + (t.investment || 0),
//       0
//     );
//     const todayWithdrawal = withdrawalTransactions
//       .filter((t) => new Date(t.createdAt) >= todayStart)
//       .reduce((sum, t) => sum + (t.investment || 0), 0);

//     // Investments
//     const depositTransactions = allTransactions.filter(
//       (t) => t.type === "Deposit"
//     );
//     const totalInvestment = depositTransactions.reduce(
//       (sum, t) => sum + (t.investment || 0),
//       0
//     );
//     const todayInvestment = depositTransactions
//       .filter((t) => new Date(t.createdAt) >= todayStart)
//       .reduce((sum, t) => sum + (t.investment || 0), 0);

//     // Fetch income details with commission history
//     const incomeDoc = await IncomeModel.findOne({ user: userId }).populate([
//       { path: "referralIncome.history", model: "Commission" },
//       { path: "levelIncome.history", model: "Commission" },
//       { path: "matchingIncome.history", model: "Commission" },
//       { path: "monthlyIncome.history", model: "Commission" },
//       { path: "globalAchieverIncome.history", model: "Commission" },
//       { path: "liveIncome.history", model: "Commission" },
//       { path: "rankRewardIncome.history", model: "Commission" },
//       { path: "withdrawal.history", model: "Transaction" },
//     ]);

//     if (!incomeDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Income data not found.",
//       });
//     }

//     // Helpers
//     const isToday = (date) =>
//       new Date(date).toDateString() === new Date().toDateString();

//     const calculateTodayIncome = (history = []) =>
//       history
//         .filter((item) => isToday(item.createdAt))
//         .reduce((sum, item) => sum + (item.amount || item.investment || 0), 0);

//     // Calculate today's income for each category
//     const referralToday = calculateTodayIncome(
//       incomeDoc.referralIncome?.history
//     );
//     const levelToday = calculateTodayIncome(incomeDoc.levelIncome?.history);
//     const matchingToday = calculateTodayIncome(
//       incomeDoc.matchingIncome?.history
//     );
//     const monthlyToday = calculateTodayIncome(incomeDoc.monthlyIncome?.history);
//     const globalToday = calculateTodayIncome(
//       incomeDoc.globalAchieverIncome?.history
//     );
//     const liveToday = calculateTodayIncome(incomeDoc.liveIncome?.history);
//     const rankToday = calculateTodayIncome(incomeDoc.rankRewardIncome?.history);

//     // Combine all to get today's total current income
//     const todayCurrentIncome =
//       referralToday +
//       levelToday +
//       matchingToday +
//       monthlyToday +
//       globalToday +
//       liveToday +
//       rankToday;

//     // Final response
//     const response = {
//       currentIncome: incomeDoc.income?.currentIncome || 0,
//       currentIncomeToday: todayCurrentIncome, // ✅ NEW FIELD
//       totalIncome: incomeDoc.income?.totalIncome || 0,
//       depositWallet: incomeDoc.income?.depositWallet || 0,

//       referralIncomeTotal: incomeDoc.referralIncome?.income || 0,
//       referralIncomeToday: referralToday,

//       levelIncomeTotal: incomeDoc.levelIncome?.income || 0,
//       levelIncomeToday: levelToday,

//       matchingIncomeTotal: incomeDoc.matchingIncome?.income || 0,
//       matchingIncomeToday: matchingToday,
//       matchingIncomeNextPayoutDate:
//         incomeDoc.matchingIncome?.nextPayoutDate || null,

//       monthlyIncomeTotal: incomeDoc.monthlyIncome?.income || 0,
//       monthlyIncomeToday: monthlyToday,

//       globalAchieverIncomeTotal: incomeDoc.globalAchieverIncome?.income || 0,
//       globalAchieverIncomeToday: globalToday,

//       liveIncomeTotal: incomeDoc.liveIncome?.income || 0,
//       liveIncomeToday: liveToday,

//       rankRewardIncomeTotal: incomeDoc.rankRewardIncome?.income || 0,
//       rankRewardIncomeToday: rankToday,

//       withdrawalTotal: totalWithdrawal,
//       withdrawalToday: todayWithdrawal,

//       totalInvestment,
//       todayInvestment,

//       totalPartners,
//       activePartners,
//       inactivePartners,
//       totalDownlines,
//     };

//     return res.json({
//       success: true,
//       message: "Income summary fetched successfully",
//       data: response,
//     });
//   } catch (err) {
//     console.error("Error fetching income summary:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Internal server error",
//     });
//   }
// };

exports.getRecentTransactions = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const transactions = await TransactionModel.find({ user: userId, type: "Deposit" })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.getTodaysTradingProfit = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await CommissionIncome.find({
      user: userId,
      type: "Trading Profit Income",
      createdAt: { $gte: today }
    }).sort({ createdAt: -1 });

    const total = records.reduce((sum, r) => sum + r.income, 0);

    return res.json({
      success: true,
      message: "Today's Trading Profit",
      today: today,
      totalTodayIncome: total,
      entries: records
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




exports.getIncomeHistory = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const transactions = await CommissionIncome.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
exports.GlobalAchieverLeaderBoard = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id, {
      _id: 1,
      investment: 1,
    });
    const rewards = await RewardModel.find(
      { status: true, type: "Global Archive Reward" },
      { reward: 0, picture: 0, updatedAt: 0 }
    );
    const { powerLagBusiness, weakerLagBusiness } =
      await getDirectPartnersDownlines({ userId: user._id });
    // const { left, right } = await getDownlineArray({ userId: user._id });
    // const leftTotal = left.reduce((total, partner) => total + Number(partner.investment || 0), 0);
    // const rightTotal = right.reduce((total, partner) => total + Number(partner.investment || 0), 0);
    const leftTotal = powerLagBusiness;
    const rightTotal = weakerLagBusiness;

    // console.log({ leftTotal, rightTotal })
    const maxSideBussiness = Math.min(leftTotal, rightTotal);
    const minSideBussiness = Math.max(leftTotal, rightTotal);
    // const isValid4060 = maxSideBussiness * 1.5 >= minSideBussiness;
    const totalBussiness = Number(maxSideBussiness + minSideBussiness);
    let filterReward = [];
    for (const reward of rewards) {
      const rewardAchieve = await CommissionIncome.findOne({
        type: "Global Archive Reward",
        reward: reward._id,
        user: user._id,
      });
      const isAchieved =
        reward.users.includes(user._id) && totalBussiness >= reward.investment;
      filterReward.push({
        ...reward._doc,
        totalBussiness,
        leftSideBussiness: leftTotal,
        rightSideBussiness: rightTotal,
        users: null,
        createdAt: rewardAchieve?.createdAt || null,
        status: isAchieved ? "Achieved" : "Waiting",
      });
    }
    res.json({
      success: true,
      message: "Global achiever leaderboard fetched successfully",
      data: filterReward,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.RankRewardLeaderBoard = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id, {
      _id: 1,
      investment: 1,
    });
    const rewards = await RewardModel.find(
      { status: true, type: "Rank Reward" },
      { percentage: 0, picture: 0, updatedAt: 0 }
    );
    // const { downlineUserIds } = await getDownlineArray({ userId: user._id });

    // // Calculate total downline sales
    // const [totalBussinessInvestment] = await TransactionModel.aggregate([
    //     { $match: { user: { $in: downlineUserIds }, type: "Deposit", status: "Completed" } },
    //     { $group: { _id: null, total: { $sum: "$investment" } } }
    // ]);
    // const totalBussiness = totalBussinessInvestment?.total || 0;

    const { powerLagBusiness, weakerLagBusiness } =
      await getDirectPartnersDownlines({ userId: user._id });
    const leftTotal = powerLagBusiness;
    const rightTotal = weakerLagBusiness;
    const totalBussiness = Math.min(leftTotal, rightTotal);

    let filterReward = [];
    for (const reward of rewards) {
      const rewardAchieve = await CommissionIncome.findOne({
        type: "Rank Reward",
        reward: reward._id,
        user: user._id,
      }).sort({ investment: 1 });
      const isAchieved =
        reward.users.includes(user._id) && totalBussiness >= reward.investment;
      filterReward.push({
        ...reward._doc,
        users: null,
        totalBussiness,
        powerLagBusiness,
        weakerLagBusiness,
        payType: rewardAchieve?.rewardPaid
          ? rewardAchieve?.rewardPaid == "Pending"
            ? rewardAchieve?.rewardPaid
            : rewardAchieve?.rewardPaid == "Processing"
              ? rewardAchieve?.rewardPaid
              : "Completed"
          : "Not Applied",
        createdAt: rewardAchieve?.createdAt || null,
        status: isAchieved ? "Achieved" : "Waiting",
      });
    }
    filterReward.sort((a, b) => a.investment - b.investment);
    res.json({
      success: true,
      message: "Rank leaderboard fetched successfully",
      data: filterReward,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDownlineTree = async (req, res) => {
  try {
    const { downline } = await getDownlineArray({
      userId: req.user._id,
      listShow: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Get Downline", data: downline });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const COMPANY_WALLET = process.env.WALLET_ADDRESS;

console.log("Company Wallet Address", COMPANY_WALLET);

// ✅ Blockchain provider (Infura/Alchemy RPC URL)
const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC);




// exports.PackageInvestment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user._id;
//     const { amount, txnHash, fromWalletAddress, toWalletAddress, packageId, planId } = req.body;

//     if (!amount || amount <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid amount" });
//     }

//     const amountNumber = Number(amount);

//     // Minimum deposit validation
//     let minRequired = 100; // Default for packages
//     if (planId) {
//       const { PlanModel } = require("../models/plan.model");
//       const plan = await PlanModel.findById(planId);
//       if (plan) minRequired = plan.minAmount || 0;
//     } else if (packageId) {
//       const { PackageModel } = require("../models/package.model");
//       const pkg = await PackageModel.findById(packageId);
//       if (pkg) minRequired = pkg.minAmount || 100;
//     }

//     if (amountNumber < minRequired) {
//       return res
//         .status(400)
//         .json({ success: false, message: `Minimum investment for this plan/package is $${minRequired}.` });
//     }

//     if (!txnHash || !fromWalletAddress) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction hash & wallet address required",
//       });
//     }

//     const user = await UserModel.findById(userId).session(session);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Blockchain verification
//     const tx = await provider.getTransaction(txnHash);
//     if (!tx)
//       return res.status(400).json({
//         success: false,
//         message: "Transaction not found on blockchain",
//       });

//     const receipt = await provider.getTransactionReceipt(txnHash);
//     if (!receipt || receipt.status !== 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction failed or not confirmed yet",
//       });
//     }

//     if (tx.from.toLowerCase() !== fromWalletAddress.toLowerCase()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Transaction sender mismatch" });
//     }

//     if (tx.to.toLowerCase() !== COMPANY_WALLET.toLowerCase()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Transaction recipient mismatch" });
//     }

//     // ✅ Update user investment
//     user.investment = (user.investment || 0) + amountNumber;
//     // Automatically lock capital amount when investment is made
//     user.active.isCapitalLocked = true;
//     // if (!user.active.isActive) {
//     //   user.active.isActive = true;
//     //   user.active.activeDate = new Date();
//     // }
//     if (!user.active) {
//       user.active = {
//         isActive: false,
//         isCapitalLocked: false,
//         activeDate: null
//       };
//     }
//     user.investment = (user.investment || 0) + amountNumber;
//     user.active.isCapitalLocked = true;

//     if (!user.active.isActive) {
//       user.active.isActive = true;
//       user.active.activeDate = new Date();
//     }

//     await user.save({ session });
//     await user.save({ session });

//     // ✅ Save transaction
//     await TransactionModel.create(
//       [
//         {
//           user: user._id,
//           investment: amountNumber,
//           type: "Deposit",
//           status: "Completed",
//           clientAddress: fromWalletAddress,
//           mainAddress: toWalletAddress,
//           hash: txnHash,
//           role: "USER",
//           package: packageId || null,
//           plan: planId || null,
//         },
//       ],
//       { session }
//     );

//     // ✅ Trigger Referral Bonus Distribution (Level 1 - Direct Referral)
//     const { distributeReferralBonus } = require('../utils/referralBonus.calculation');
//     await distributeReferralBonus({ userId: user._id, amount: amountNumber, session });

//     // ✅ Trigger Level Income Distribution (Level 2+ only)
//     const { levelIncomeCalculate } = require('../utils/levelIncome.calculation');
//     await levelIncomeCalculate({ userId: user._id, amount: amountNumber });

//     // ✅ Trigger ROI Income (after investment)
//     const { calculateAndDistributeROI } = require("./roiAndSingleLeg.controller");
//     await calculateAndDistributeROI(user._id, amountNumber);

//     // ✅ Trigger Single Leg Income (after investment)
//     const { calculateAndDistributeSingleLegIncome } = require("./roiAndSingleLeg.controller");
//     await calculateAndDistributeSingleLegIncome(user._id);

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       message: "Investment successful via blockchain wallet",
//       data: { investment: user.investment },
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("❌ PackageInvestment Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };

// new
// exports.PackageInvestment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user._id;
//     const { amount, txnHash, fromWalletAddress, toWalletAddress } = req.body;

//     if (!amount || amount <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid amount" });
//     }

//     // Minimum deposit validation
//     const amountNumber = Number(amount);
//     if (amountNumber < 100) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Minimum deposit amount is $100." });
//     }

//     if (!txnHash || !fromWalletAddress) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction hash & wallet address required",
//       });
//     }

//     const user = await UserModel.findById(userId).session(session);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Blockchain verification
//     const tx = await provider.getTransaction(txnHash);
//     if (!tx)
//       return res.status(400).json({
//         success: false,
//         message: "Transaction not found on blockchain",
//       });

//     const receipt = await provider.getTransactionReceipt(txnHash);
//     if (!receipt || receipt.status !== 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction failed or not confirmed yet",
//       });
//     }

//     if (tx.from.toLowerCase() !== fromWalletAddress.toLowerCase()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Transaction sender mismatch" });
//     }

//     // ✅ Update user investment
//     user.investment = (user.investment || 0) + amountNumber;
//     // Automatically lock capital amount when investment is made
//     user.active.isCapitalLocked = true;
//     await user.save({ session });

//     // ✅ Save transaction
//     await TransactionModel.create(
//       [
//         {
//           user: user._id,
//           investment: amountNumber,
//           type: "Deposit",
//           status: "Completed",
//           clientAddress: fromWalletAddress,
//           mainAddress: toWalletAddress,
//           hash: txnHash,
//           role: "USER",
//         },
//       ],
//       { session }
//     );

//     // ✅ Trigger Level Income Distribution
//     // await distributeLevelIncome(user._id, amount, session);


//      // ✅ Trigger Referral Bonus Distribution (Level 1 - Direct Referral)
//     const { distributeReferralBonus } = require('../utils/referralBonus.calculation');
//     await distributeReferralBonus({ userId: user._id, amount: amountNumber, session });

//     // ✅ Trigger Level Income Distribution (Level 2+ only)
//     const { levelIncomeCalculate } = require('../utils/levelIncome.calculation');
//     await levelIncomeCalculate({ userId: user._id, amount: amountNumber });

//     // ✅ Trigger ROI Income (after investment)
//     const { calculateAndDistributeROI } = require("./roiAndSingleLeg.controller");
//     await calculateAndDistributeROI(user._id, amountNumber);

//     // ✅ Trigger Single Leg Income (after investment)
//     const { calculateAndDistributeSingleLegIncome } = require("./roiAndSingleLeg.controller");
//     await calculateAndDistributeSingleLegIncome(user._id);



//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       message: "Investment successful via blockchain wallet",
//       data: { investment: user.investment },
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("❌ PackageInvestment Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };






exports.PackageInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { amount, txnHash, fromWalletAddress, toWalletAddress } = req.body;
    console.log("➡️ [Backend] PackageInvestment API Called");
    console.log("📦 [Backend] Request Body:", JSON.stringify(req.body));

    const investmentAmount = Number(amount);
    console.log(`💰 [Backend] Investment Amount: ${investmentAmount}`);

    if (!txnHash || !fromWalletAddress) {
      console.warn("⚠️ [Backend] Missing hash or wallet address");
      return res.status(400).json({
        success: false,
        message: "Transaction hash & wallet address required",
      });
    }

    console.log("🔒 [Backend] checking for duplicate transaction...");
    // 🔒 Prevent duplicate transaction
    const existingTx = await TransactionModel.findOne({ hash: txnHash }).session(session);
    if (existingTx) {
      console.warn(`⚠️ [Backend] Duplicate Transaction Hash found: ${txnHash}`);
      return res.status(409).json({
        success: false,
        message: "Transaction already processed",
      });
    }

    console.log(`👤 [Backend] Finding user by ID: ${userId}`);
    // 👤 Fetch User
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      console.warn("❌ [Backend] User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(`✅ [Backend] User found: ${user.username} (${user._id})`);

    // 🔗 Blockchain verification
    console.log(`🔗 [Backend] Verifying transaction on blockchain: ${txnHash}`);

    // Retry mechanism for fetching transaction (handling RPC latency)
    let tx = null;
    let receipt = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        tx = await provider.getTransaction(txnHash);
        receipt = await provider.getTransactionReceipt(txnHash);

        if (tx && receipt && receipt.status === 1) {
          break; // Success
        }
      } catch (err) {
        console.log(`⚠️ [Backend] Attempt ${attempts + 1} failed: ${err.message}`);
      }

      console.log(`⏳ [Backend] Tx verification pending... retrying (${attempts + 1}/${maxAttempts})`);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    if (!tx || !receipt || receipt.status !== 1) {
      console.error("❌ [Frontend] Transaction verification failed or pending on blockchain after retries");
      return res.status(400).json({
        success: false,
        message: "Transaction not confirmed on blockchain (RPC Sync Issue). Please wait a moment and try again.",
      });
    }
    console.log("✅ [Backend] Blockchain transaction verified!");

    console.log(`🔍 [Backend] Matching addresses - ReqFrom: ${fromWalletAddress.toLowerCase()}, TxFrom: ${tx.from.toLowerCase()}`);
    if (tx.from.toLowerCase() !== fromWalletAddress.toLowerCase()) {
      console.error("❌ [Backend] Address mismatch!");
      return res.status(400).json({
        success: false,
        message: "Transaction sender mismatch",
      });
    }

    console.log("🧾 [Backend] Creating transaction record...");
    // 🧾 CREATE TRANSACTION
    const [transaction] = await TransactionModel.create(
      [{
        user: user._id,
        investment: investmentAmount,
        netAmount: investmentAmount,
        type: "Deposit",
        status: "Completed",
        clientAddress: fromWalletAddress,
        mainAddress: toWalletAddress,
        hash: txnHash,
        role: "USER",
      }],
      { session }
    );

    // 💰 UPDATE USER INVESTMENT
    user.investment = Number(user.investment || 0) + investmentAmount;

    // ✅ ACTIVATE USER (FIRST INVESTMENT)
    if (user.active.isActive !== true) {
      console.log(`✅ [Backend] First time activation for user ${user.username}`);
      user.active.isActive = true;
      user.active.isVerified = true;
      user.active.activeDate = new Date();
    }

    user.active.isCapitalLocked = true;

    // ⚠️ VERY IMPORTANT
    user.markModified("active");

    // 🔗 Link transaction
    user.transactions.push(transaction._id);

    await user.save({ session });
    console.log("✅ [Backend] User updated and transaction saved.");

    // 💸 Income logic (kept as-is)
    await session.commitTransaction();
    session.endSession();

    console.log("✅ [Backend] Transaction Committed.");

    // ⚡ INSTANT RESPONSE TO CLIENT
    // We respond here so the UI stops loading immediately.
    // Income distribution continues in the background.
    const updatedUser = await UserModel.findById(user._id).populate("transactions");

    res.status(200).json({
      success: true,
      message: "Investment successful, user activated",
      data: {
        isActive: updatedUser.active.isActive,
        totalInvestment: updatedUser.investment,
        transactions: updatedUser.transactions,
      },
    });

    // 🚀 BACKGROUND TASKS (Fire & Forget)
    // Running these without 'await' blocking the response
    (async () => {
      try {
        console.log("🔄 [Backend-BG] Distributing Referral Bonus...");
        const { distributeReferralBonus } = require("../utils/referralBonus.calculation");
        // Pass null for session as previous session is ended
        await distributeReferralBonus({ userId: user._id, amount: investmentAmount, session: null });

        console.log("🔄 [Backend-BG] Distributing Level Income...");
        const { levelIncomeCalculate } = require("../utils/levelIncome.calculation");
        await levelIncomeCalculate({ userId: user._id, amount: investmentAmount });

        console.log("✅ [Backend-BG] Background distribution completed.");
      } catch (bgError) {
        console.error("❌ [Backend-BG] Background Task Error:", bgError.message);
      }
    })();

    return;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ PackageInvestment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};





// GET direct partners
exports.getPartners = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId)
      .populate(
        "partners",
        "id username email account investment active createdAt"
      )
      .lean();

    const partnersCount = user?.partners?.length || 0;

    return res.status(200).json({
      success: true,
      data: {
        partners: user.partners || [],
        totalPartners: partnersCount,
      },
    });
  } catch (err) {
    console.error("❌ getPartners Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET full team (binary tree)
// exports.getMyTeams = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const user = await UserModel.findById(userId)
//       .populate('leftChild rightChild', 'id username email account investment active createdAt')
//       .lean();

//     // Optionally, you can include leftChild & rightChild in an array as teamUsers
//     const teamUsers = [];
//     if (user.leftChild) teamUsers.push(user.leftChild);
//     if (user.rightChild) teamUsers.push(user.rightChild);

//     return res.status(200).json({
//       success: true,
//       data: {
//         teamUsers,
//         totalTeamUsers: teamUsers.length
//       }
//     });
//   } catch (err) {
//     console.error("❌ getMyTeams Error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user._id;

    // Use the existing getDownlineArray utility function to get all downlines
    const downlineData = await getDownlineArray({
      userId: userId,
      listShow: true,
      maxLength: Infinity
    });

    // Format the downline data for response
    const formattedDownlines = downlineData.downline.map(user => ({
      _id: user._id,
      id: user.id,
      username: user.username,
      walletAddress: user.account || null, // account is a string (wallet address)
      investment: user.investment || 0,
      position: user.position || null,
      active: user.active,
      referralLink: user.referralLink || null,
      createdAt: user.createdAt,
      level: user.level || 0
    }));

    return res.status(200).json({
      success: true,
      message: "Team downlines fetched successfully",
      data: {
        totalTeamUsers: downlineData.total,
        totalActive: downlineData.totalActive,
        totalInactive: downlineData.totalInactive,
        leftTeam: downlineData.left.length,
        rightTeam: downlineData.right.length,
        downlines: formattedDownlines
      }
    });
  } catch (err) {
    console.error("❌ getMyTeams Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await TransactionModel.find({ user: userId })
      .populate("user", "name email") // populate user name & email
      .populate("package", "name price") // populate package name & price
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("❌ Error in getTransaction:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

// Get All Team Transactions (User + All Downlines)
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all downline user IDs (includes user's own ID)
    const { downlineUserIds } = await getDownlineArray({
      userId,
      listShow: false,
    });

    if (!downlineUserIds || downlineUserIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Team transactions retrieved successfully.",
        data: {
          transactions: [],
          summary: {
            totalTransactions: 0,
            totalDeposits: 0,
            totalWithdrawals: 0,
            totalAmount: 0,
            teamMembers: 0,
          },
        },
      });
    }

    // Get all transactions for team (user + all downlines)
    const transactions = await TransactionModel.find({
      user: { $in: downlineUserIds },
    })
      .populate({
        path: "user",
        select: "id username email account investment active",
      })
      .populate({
        path: "package",
        select: "title minAmount maxAmount percentage",
      })
      .sort({ createdAt: -1 });

    // Calculate summary
    const totalTransactions = transactions.length;
    const deposits = transactions.filter((t) => t.type === "Deposit");
    const withdrawals = transactions.filter((t) => t.type === "Withdrawal");

    const totalDeposits = deposits.reduce(
      (sum, t) => sum + (t.investment || 0),
      0
    );
    const totalWithdrawals = withdrawals.reduce(
      (sum, t) => sum + (t.investment || 0),
      0
    );
    const totalAmount = totalDeposits - totalWithdrawals;

    // Group by user
    const transactionsByUser = {};
    transactions.forEach((txn) => {
      const userId = txn.user?._id?.toString() || "unknown";
      if (!transactionsByUser[userId]) {
        transactionsByUser[userId] = {
          user: txn.user,
          transactions: [],
          totalDeposits: 0,
          totalWithdrawals: 0,
          transactionCount: 0,
        };
      }
      transactionsByUser[userId].transactions.push(txn);
      transactionsByUser[userId].transactionCount++;
      if (txn.type === "Deposit") {
        transactionsByUser[userId].totalDeposits += txn.investment || 0;
      } else if (txn.type === "Withdrawal") {
        transactionsByUser[userId].totalWithdrawals += txn.investment || 0;
      }
    });

    // Today's transactions
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTransactions = transactions.filter(
      (txn) => new Date(txn.createdAt) >= startOfToday
    );
    const todayDeposits = todayTransactions
      .filter((t) => t.type === "Deposit")
      .reduce((sum, t) => sum + (t.investment || 0), 0);
    const todayWithdrawals = todayTransactions
      .filter((t) => t.type === "Withdrawal")
      .reduce((sum, t) => sum + (t.investment || 0), 0);

    res.status(200).json({
      success: true,
      message: "Team transactions retrieved successfully.",
      data: {
        transactions: transactions,
        transactionsByUser: Object.values(transactionsByUser),
        summary: {
          totalTransactions: totalTransactions,
          totalDeposits: totalDeposits,
          totalWithdrawals: totalWithdrawals,
          totalAmount: totalAmount,
          teamMembers: downlineUserIds.length,
          todayTransactions: todayTransactions.length,
          todayDeposits: todayDeposits,
          todayWithdrawals: todayWithdrawals,
          depositsCount: deposits.length,
          withdrawalsCount: withdrawals.length,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in getAllTransactions:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team transactions",
      error: error.message,
    });
  }
};

exports.getTransactionOf7days = async (req, res) => {
  try {
    const userId = req.user._id; // authenticated user

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today + last 6 days
    sevenDaysAgo.setHours(0, 0, 0, 0); // start of the day

    // Aggregation pipeline
    const transactions = await TransactionModel.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort by date ascending
    ]);

    // Fill missing days with count 0
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const found = transactions.find((t) => t._id === dateStr);
      result.unshift({ date: dateStr, count: found ? found.count : 0 });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getTransactionOf7days:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction counts",
      error: error.message,
    });
  }
};

exports.calculateUserROI = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const result = await calculateDailyROIForUser(userId);
    if (result.success && result.amount > 0) {
      await distributeGenerationROI(userId, result.amount);
    }
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: `ROI calculated successfully for user ${userId}`,
      data: result,
    });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getROIHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const roiHistory = await ROIHistory.find({ user: userId });

    return res.status(200).json({
      success: true,
      data: roiHistory,
    });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getGenerationROIHistory = async (req, res) => {
  try {
    // Optionally, you can filter by userId from auth
    const userId = req.user._id; // authenticated user
    // Example: fetch all records where user is either fromUser or toUser
    const query = {
      $or: [{ fromUser: userId }, { toUser: userId }],
    };

    const history = await GenerationROIHistory.find(query)
      .populate("fromUser", "name email") // populate fromUser's basic info
      .populate("toUser", "name email") // populate toUser's basic info
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("❌ Error in getGenerationHistory:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch generation history",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id; // authenticated user

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ Error in updateProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Username is required" });
  }

  try {
    const user = await UserModel.findOne({ username }).select(
      "name username account"
    ); // sirf name aur username fetch kare

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        username: user.username,
        account: user.account,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user by username:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getUserByReferralCode = async (req, res) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    return res
      .status(400)
      .json({ success: false, message: "Referral code is required" });
  }

  try {
    const user = await UserModel.findOne({ referralLink: referralCode }).select(
      "username"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user by referral code:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * Activate AI Trade for today
 * User must click this button daily to be eligible for trading ROI
 */
exports.getAiTradeStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).select('lastAiTradeActivation');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let canTrade = true;
    let remainingTime = 0;

    if (user.lastAiTradeActivation) {
      const lastActivation = new Date(user.lastAiTradeActivation);
      const now = new Date();
      const timeDiff = now - lastActivation;
      const hoursPassed = timeDiff / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        canTrade = false;
        remainingTime = Math.floor((24 * 60 * 60) - (timeDiff / 1000));
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        canTrade,
        remainingTime,
        lastAiTradeActivation: user.lastAiTradeActivation
      }
    });
  } catch (error) {
    console.error("❌ Error getting AI trade status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.activateAiTrade = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if 24 hours have passed since last activation
    if (user.lastAiTradeActivation) {
      const lastActivation = new Date(user.lastAiTradeActivation);
      const now = new Date();
      const hoursPassed = (now - lastActivation) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        const remainingHours = Math.ceil(24 - hoursPassed);
        return res.status(400).json({
          success: false,
          message: `Please wait ${remainingHours} more hours before next trade`
        });
      }
    }

    // Activate AI trade
    user.lastAiTradeActivation = new Date();
    await user.save();

    console.log(`✅ AI Trade activated for user: ${user.username}`);

    return res.status(200).json({
      success: true,
      message: "AI Trade activated successfully! Next trade available in 24 hours"
    });
  } catch (error) {
    console.error("❌ Error activating AI trade:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get user basic info
    const user = await UserModel.findById(userId)
      .select("username email mobile investment totalTeam active totalBusiness currentRank")
      .populate("partners", "username email");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`🔍 [DEBUG] User found: ${user.username}, Investment: ${user.investment}`);

    // Get user's own deposits
    const deposits = await TransactionModel.aggregate([
      {
        $match: {
          user: objectUserId,
          type: "Deposit",
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$investment" },
          todayTotal: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfDay] }, "$investment", 0],
            },
          },
        },
      },
    ]);

    const depositTotal = deposits[0]?.total || 0;
    const depositToday = deposits[0]?.todayTotal || 0;

    // Get withdrawals
    const withdrawals = await TransactionModel.aggregate([
      {
        $match: {
          user: objectUserId,
          type: "Withdrawal",
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$investment" },
          todayTotal: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfDay] }, "$investment", 0],
            },
          },
        },
      },
    ]);

    const withdrawalTotal = withdrawals[0]?.total || 0;
    const withdrawalToday = withdrawals[0]?.todayTotal || 0;

    // Get commission incomes
    const incomes = await CommissionIncome.aggregate([
      {
        $match: {
          user: objectUserId,
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$income" },
          todayTotal: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfDay] }, "$income", 0],
            },
          },
        },
      },
    ]);

    const incomeMap = {};
    incomes.forEach((item) => {
      incomeMap[item._id] = {
        total: item.total || 0,
        today: item.todayTotal || 0,
      };
    });

    // Calculate current user's level using the same logic as MyTeamPage
    const { calculateUserLevel } = require('../utils/levelIncome.calculation');
    const currentUserLevel = await calculateUserLevel(userId);

    // Get all downline users (referrals)
    const { downlineUserIds } = await getDownlineArray({
      userId: userId,
      listShow: false
    });
    const totalDownlineUsers = downlineUserIds.length - 1; // Exclude self

    // Simple team calculation - just count direct partners for now
    const directCount = user.partners?.length || 0;

    console.log(`🔍 [DEBUG] Deposits - Total: ${depositTotal}, Today: ${depositToday}`);
    console.log(`🔍 [DEBUG] Direct Partners: ${directCount}`);
    console.log(`🔍 [DEBUG] Current User Level: ${currentUserLevel}`);

    return res.status(200).json({
      success: true,
      message: "User dashboard stats fetched successfully",
      data: {
        // Frontend expects these fields for stats cards
        totalIncome: Object.values(incomeMap).reduce((a, b) => a + b.total, 0),
        totalReferral: incomeMap["Referral Income"]?.total || 0,
        todayIncome: Object.values(incomeMap).reduce((a, b) => a + b.today, 0),
        todayReferral: incomeMap["Referral Income"]?.today || 0,

        // Investment Report specific fields
        partners: directCount,
        partnerActive: directCount, // Simplified - all direct partners are active
        partnerInactive: 0,
        totalDownlineUsers: totalDownlineUsers,
        currentIncome: Object.values(incomeMap).reduce((a, b) => a + b.total, 0),

        // Trading Income
        totalTrading: incomeMap["Trading Profit Income"]?.total || 0,
        todayTrading: incomeMap["Trading Profit Income"]?.today || 0,
        totalLiveTrading: incomeMap["Live Trading Income"]?.total || 0,
        todayLiveTrading: incomeMap["Live Trading Income"]?.today || 0,

        // Level Income (ROI Dividend)
        totalLevel: incomeMap["Level ROI Dividend"]?.total || 0,
        todayLevel: incomeMap["Level ROI Dividend"]?.today || 0,

        // Global Achiever
        totalGlobalAchiever: incomeMap["Global Archive Reward"]?.total || 0,
        todayGlobalAchiever: incomeMap["Global Archive Reward"]?.today || 0,

        // Matching Income
        totalMatching: incomeMap["Matching Income"]?.total || 0,
        todayMatching: incomeMap["Matching Income"]?.today || 0,

        // Transactions
        totalTransaction: depositTotal,
        todayTransaction: depositToday,
        totalTeamTransaction: 0, // Simplified for now
        todayTeamTransaction: 0,

        // Withdrawals
        totalWithdraw: withdrawalTotal,
        todayWithdraw: withdrawalToday,
      },
      user: {
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        investment: depositTotal, // Use calculated from transactions
        totalTeam: 0, // Simplified for now
        active: user.active,
        directs: directCount,
        totalTeamBusiness: 0, // Simplified for now
        currentRank: user.currentRank || 'No Rank',
        currentLevel: currentUserLevel, // ✅ Now using proper level calculation
      },
      rank: {
        current: user.currentRank || 'No Rank',
        next: null
      },
      incomes: {
        total: Object.values(incomeMap).reduce((a, b) => a + b.total, 0),
        today: Object.values(incomeMap).reduce((a, b) => a + b.today, 0),
        rankReward: incomeMap["Rank Reward"] || { total: 0, today: 0 },
        referral: incomeMap["Referral Income"] || { total: 0, today: 0 },
        level: incomeMap["Level ROI Dividend"] || { total: 0, today: 0 },
        matching: incomeMap["Matching Income"] || { total: 0, today: 0 },
      },
      withdrawals: {
        total: withdrawalTotal,
        today: withdrawalToday,
      },
      deposits: {
        total: depositTotal,
        today: depositToday,
      },
      globalAchievements: {
        total: 0,
        today: 0,
      },
    });
  } catch (err) {
    console.error("❌ User dashboard stats error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Get Team Division (Team A, B, C) for logged in user
 * Team A = Direct referral with highest business (investment)
 * Team B = Direct referral with second highest business
 * Team C = All other direct referrals
 */
exports.getMyTeamDivision = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate fresh team division
    const teamData = await calculateTeamDivision(userId);

    // Save/update the division in database
    await saveTeamDivision(userId, teamData);

    // Get last shuffled info
    const divisionRecord = await TeamDivisionModel.findOne({ user: userId });

    // Format response
    const formatMember = (member) => ({
      _id: member._id,
      id: member.id,
      username: member.username,
      email: member.email,
      walletAddress: member.account || null,
      investment: member.investment || 0,
      active: member.active,
      createdAt: member.createdAt,
      level: member.level || 0
    });

    return res.status(200).json({
      success: true,
      message: "Team division fetched successfully",
      data: {
        teamA: {
          directReferral: teamData.teamA.directReferral ? formatMember(teamData.teamA.directReferral) : null,
          members: teamData.teamA.members.map(formatMember),
          totalMembers: teamData.teamA.members.length,
          totalBusiness: teamData.teamA.totalBusiness
        },
        teamB: {
          directReferral: teamData.teamB.directReferral ? formatMember(teamData.teamB.directReferral) : null,
          members: teamData.teamB.members.map(formatMember),
          totalMembers: teamData.teamB.members.length,
          totalBusiness: teamData.teamB.totalBusiness
        },
        teamC: {
          directReferrals: teamData.teamC.directReferrals?.map(formatMember) || [],
          members: teamData.teamC.members.map(formatMember),
          totalMembers: teamData.teamC.members.length,
          totalBusiness: teamData.teamC.totalBusiness
        },
        summary: {
          totalDirectReferrals: teamData.totalDirectReferrals || 0,
          totalTeamMembers: teamData.totalTeamMembers || 0,
          lastShuffledAt: divisionRecord?.lastShuffledAt || null
        }
      }
    });
  } catch (error) {
    console.error("❌ getMyTeamDivision Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch team division",
      error: error.message
    });
  }
};

/**
 * Get all team members with level information
 */
exports.getAllTeamMembers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Use existing getDownlineArray utility
    const downlineData = await getDownlineArray({
      userId: userId,
      listShow: true,
      maxLength: Infinity
    });

    // Import calculateUserLevel function
    const { calculateUserLevel } = require('../utils/levelIncome.calculation');

    // Calculate current user's level
    const currentUserLevel = await calculateUserLevel(userId);

    // Calculate level for each member
    const membersWithLevel = [];
    for (const user of downlineData.downline) {
      const maxUnlockedLevel = await calculateUserLevel(user._id);
      membersWithLevel.push({
        _id: user._id,
        id: user.id,
        username: user.username,
        email: user.email || null,
        walletAddress: user.account || null,
        investment: user.investment || 0,
        position: user.position || null,
        active: user.active,
        referralLink: user.referralLink || null,
        createdAt: user.createdAt,
        level: maxUnlockedLevel
      });
    }

    return res.status(200).json({
      success: true,
      message: "All team members fetched successfully",
      data: {
        totalTeamUsers: downlineData.total,
        totalActive: downlineData.totalActive,
        totalInactive: downlineData.totalInactive,
        currentUserLevel: currentUserLevel, // Add current user's level
        members: membersWithLevel
      }
    });
  } catch (err) {
    console.error("❌ getAllTeamMembers Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

/**
 * Get user's available income balance for reinvestment
 */
exports.getAvailableIncomeBalance = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId).populate("incomeDetails");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let incomeDetails = user.incomeDetails;
    if (!incomeDetails) {
      incomeDetails = await IncomeModel.create({ user: userId });
      user.incomeDetails = incomeDetails._id;
      await user.save();
    }

    // Get reinvestment history
    const reinvestmentHistory = await TransactionModel.find({
      user: userId,
      type: "Reinvestment"
    }).sort({ createdAt: -1 }).limit(10);

    const totalReinvested = await TransactionModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: "Reinvestment", status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$investment" } } }
    ]);

    return res.status(200).json({
      success: true,
      message: "Available income balance fetched",
      data: {
        currentIncome: incomeDetails.income?.currentIncome || 0,
        totalIncome: incomeDetails.income?.totalIncome || 0,
        currentInvestment: user.investment || 0,
        totalReinvested: totalReinvested[0]?.total || 0,
        recentReinvestments: reinvestmentHistory
      }
    });
  } catch (error) {
    console.error("❌ getAvailableIncomeBalance Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch income balance",
      error: error.message
    });
  }
};

// Level qualification logic - Z-1 requires 10+ direct + 30+ team members (Level 2 to unlimited depth)
const calculateUserLevel = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return 0;
    }

    // Check self investment requirement
    if (!user.investment || user.investment < 100) {
      return 0; // No levels unlocked if self investment < $100
    }

    // Count qualified direct referrals (active + $100+ investment)
    const qualifiedDirects = await UserModel.countDocuments({
      sponsor: userId,
      'active.isActive': true,
      investment: { $gte: 100 }
    });

    // Z-1 QUALIFICATION: 10+ direct + 30+ team members (Level 2 to unlimited depth)
    if (qualifiedDirects >= 10) {
      // Count team members from direct referrals' downlines (Level 2 to unlimited depth, max 15 per direct leg)
      let totalTeamMembers = 0;
      const directReferrals = await UserModel.find({
        sponsor: userId,
        'active.isActive': true,
        investment: { $gte: 100 }
      }).select('_id username');

      for (const directRef of directReferrals) {
        // Get entire downline of this direct referral (Level 2 to unlimited depth)
        const dlResult = await getDownlineArray({ userId: directRef._id, listShow: true });

        // Count qualified members (active and investment >= 100) from Level 2 onwards
        const qualifiedInLeg = (dlResult.downline || []).filter(d =>
          d.active && d.active.isActive && d.investment >= 100
        ).length;

        // Max 15 per leg (from any single direct partner)
        const legContribution = Math.min(qualifiedInLeg, 15);
        totalTeamMembers += legContribution;
      }

      // Check both conditions: 30+ team AND minimum 40 total people
      const totalPeople = qualifiedDirects + totalTeamMembers;
      if (totalTeamMembers >= 30 && totalPeople >= 40) {
        return 25; // Z-1 qualified - Level 25 unlocked
      }
    }

    // Fallback level system for partial qualification
    if (qualifiedDirects >= 15) return 16;
    if (qualifiedDirects >= 10) return 10;
    if (qualifiedDirects >= 6) return 6;
    if (qualifiedDirects >= 3) return 3;
    if (qualifiedDirects >= 1) return 1;

    return 0; // No levels unlocked
  } catch (error) {
    console.error('❌ Error calculating user level:', error);
    return 0;
  }
};

exports.getUserLevelInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const maxUnlockedLevel = await calculateUserLevel(userId);

    // Count qualified direct referrals
    const qualifiedDirects = await UserModel.countDocuments({
      sponsor: userId,
      'active.isActive': true,
      investment: { $gte: 100 }
    });

    // Level requirements - user jumps directly to highest level
    const levelRequirements = [
      { levels: "1", directsRequired: 1, description: "Jump directly to Level 1" },
      { levels: "2-3", directsRequired: 3, description: "Jump directly to Level 3 (unlocks 1-3)" },
      { levels: "4-10", directsRequired: 6, description: "Jump directly to Level 10 (unlocks 1-10)" },
      { levels: "11-16", directsRequired: 10, description: "Jump directly to Level 16 (unlocks 1-16)" },
      { levels: "17-25", directsRequired: 15, description: "Jump directly to Level 25 (unlocks 1-25)" }
    ];

    // Next level requirement
    let nextRequirement = null;
    if (maxUnlockedLevel < 25) {
      if (maxUnlockedLevel < 1) nextRequirement = { levels: "1", directsRequired: 1, directsNeeded: 1 - qualifiedDirects, description: "Unlock Level 1" };
      else if (maxUnlockedLevel < 3) nextRequirement = { levels: "2-3", directsRequired: 3, directsNeeded: 3 - qualifiedDirects, description: "Jump to Level 3" };
      else if (maxUnlockedLevel < 10) nextRequirement = { levels: "4-10", directsRequired: 6, directsNeeded: 6 - qualifiedDirects, description: "Jump to Level 10" };
      else if (maxUnlockedLevel < 16) nextRequirement = { levels: "11-16", directsRequired: 10, directsNeeded: 10 - qualifiedDirects, description: "Jump to Level 16" };
      else if (maxUnlockedLevel < 25) nextRequirement = { levels: "17-25", directsRequired: 15, directsNeeded: 15 - qualifiedDirects, description: "Jump to Level 25" };
    }

    return res.status(200).json({
      success: true,
      message: "User level information",
      data: {
        selfInvestment: user.investment || 0,
        selfInvestmentQualified: (user.investment || 0) >= 100,
        qualifiedDirects,
        maxUnlockedLevel,
        levelRequirements,
        nextRequirement,
        unlockedLevels: maxUnlockedLevel > 0 ? Array.from({ length: maxUnlockedLevel }, (_, i) => i + 1) : [],
        levelSystem: "Jump-based: Users jump directly to highest qualified level with all lower levels unlocked"
      }
    });
  } catch (error) {
    console.error("getUserLevelInfo Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Reinvest from income balance
 * Allows users to reinvest their earned income (ROI, level income, etc.) back into investment
 */
exports.reinvestFromIncome = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid reinvestment amount" });
    }

    const reinvestAmount = Number(amount);
    if (reinvestAmount < 10) {
      return res.status(400).json({ success: false, message: "Minimum reinvestment amount is $10" });
    }

    const user = await UserModel.findById(userId).populate("incomeDetails").session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const incomeDetails = await IncomeModel.findById(user.incomeDetails._id).session(session);
    const availableBalance = incomeDetails.income?.currentIncome || 0;

    if (availableBalance < reinvestAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`,
      });
    }

    incomeDetails.income.currentIncome -= reinvestAmount;
    await incomeDetails.save({ session });

    user.investment = (user.investment || 0) + reinvestAmount;
    user.active.isCapitalLocked = true;
    await user.save({ session });

    const { generateCustomId } = require("../utils/generator.uniqueid");
    const transactionId = generateCustomId({ prefix: 'ZTD-REINV', max: 14, min: 14 });

    await TransactionModel.create(
      [{
        id: transactionId,
        user: userId,
        investment: reinvestAmount,
        type: "Reinvestment",
        status: "Completed",
        role: "USER",
        clientAddress: user.account || null,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: `Successfully reinvested $${reinvestAmount.toFixed(2)} from your income`,
      data: { newInvestment: user.investment, remainingBalance: incomeDetails.income.currentIncome }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ reinvestFromIncome Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Reinvest from income balance into a specific Plan
 */
exports.reinvestFromIncomeForPlan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { amount, planId } = req.body;

    if (!amount || amount <= 0 || !planId) {
      return res.status(400).json({ success: false, message: "Invalid amount or Plan ID" });
    }

    const reinvestAmount = Number(amount);
    if (reinvestAmount < 1) {
      return res.status(400).json({ success: false, message: "Minimum reinvestment amount is $1" });
    }

    const user = await UserModel.findById(userId).populate("incomeDetails").session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const incomeDetails = await IncomeModel.findById(user.incomeDetails._id).session(session);
    const availableBalance = incomeDetails.income?.currentIncome || 0;

    if (availableBalance < reinvestAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`,
      });
    }

    // Deduct from current income
    incomeDetails.income.currentIncome -= reinvestAmount;
    await incomeDetails.save({ session });

    // Add to user's investment
    user.investment = (user.investment || 0) + reinvestAmount;
    user.active.isCapitalLocked = true;
    await user.save({ session });

    const { generateCustomId } = require("../utils/generator.uniqueid");
    const transactionId = generateCustomId({ prefix: 'ZTD-REINV-P', max: 14, min: 14 });

    // Create transaction record
    await TransactionModel.create(
      [{
        id: transactionId,
        user: userId,
        investment: reinvestAmount,
        type: "Reinvestment",
        status: "Completed",
        role: "USER",
        plan: planId,
        clientAddress: user.account || null,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: `Successfully reinvested $${reinvestAmount.toFixed(2)} into Plan`,
      data: { newInvestment: user.investment, remainingBalance: incomeDetails.income.currentIncome }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ reinvestFromIncomeForPlan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getReinvestmentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await TransactionModel.find({
      user: userId,
      type: "Reinvestment"
    }).sort({ createdAt: -1 });

    const totalReinvested = history.reduce((sum, tx) => sum + (tx.investment || 0), 0);

    // Today's reinvestment
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayReinvestments = history.filter(tx => new Date(tx.createdAt) >= startOfToday);
    const todayTotal = todayReinvestments.reduce((sum, tx) => sum + (tx.investment || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Reinvestment history fetched",
      data: {
        history,
        summary: {
          totalReinvested,
          todayTotal,
          totalTransactions: history.length,
          todayTransactions: todayReinvestments.length
        }
      }
    });
  } catch (error) {
    console.error("❌ getReinvestmentHistory Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reinvestment history",
      error: error.message
    });
  }
};

/**
 * Activate user account manually
 * This API can be called after successful investment to ensure user is activated
 */
exports.activateUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user already active
    if (user.active.isActive) {
      return res.status(200).json({
        success: true,
        message: "User account is already active",
        data: { isActive: true, activeDate: user.active.activeDate }
      });
    }

    // Activate user
    user.active.isActive = true;
    user.active.isVerified = true;
    user.active.activeDate = new Date();
    user.markModified("active");
    await user.save();

    console.log(`✅ User ${user.username} activated successfully`);

    return res.status(200).json({
      success: true,
      message: "User account activated successfully",
      data: { isActive: true, activeDate: user.active.activeDate }
    });
  } catch (error) {
    console.error("❌ activateUserAccount Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Plan investment history for user
 */
exports.getPlanInvestmentReports = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch transactions that are either Deposit or Reinvestment AND have a plan field
    const history = await TransactionModel.find({
      user: userId,
      type: { $in: ["Deposit", "Reinvestment"] },
      plan: { $exists: true, $ne: null }
    }).populate("plan").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Plan investment history fetched successfully",
      data: { history }
    });
  } catch (err) {
    console.error("❌ getPlanInvestmentReports Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Plan reinvestment history for user
 */
exports.getPlanReinvestmentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await TransactionModel.find({
      user: userId,
      type: "Reinvestment",
      plan: { $exists: true, $ne: null }
    }).populate("plan").sort({ createdAt: -1 });

    const totalReinvested = history.reduce((sum, tx) => sum + (tx.investment || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Plan reinvestment history fetched",
      data: {
        history,
        summary: {
          totalReinvested,
          totalTransactions: history.length
        }
      }
    });
  } catch (error) {
    console.error("❌ getPlanReinvestmentHistory Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
