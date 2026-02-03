
// controllers/roi.controller.js
const { UserModel } = require("../models/user.model");
const ROIHistory = require("../models/roiHistory");
const GenerationROIHistory = require("../models/generation.model")
const { IncomeModel } = require("../models/income.model");
const { CommissionIncome } = require("../models/commission.model");
const { generateCustomId } = require("../utils/generator.uniqueid");

// Excluded user IDs - these users and their referrals will not receive referral income
const EXCLUDED_USER_IDS = ['ZTD0506884', 'ZTD7210166', 'ZTD6645644'];


exports.calculateDailyROIForAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate("incomeDetails");
    const { TransactionModel } = require("../models/transaction.model");

    if (!users || users.length === 0) {
      return res.status(400).json({ success: false, message: "No users found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (let user of users) {
      if (user.todayRoiCollected) continue;

      // 1. Calculate Individual Plan ROIs
      // Find completed investments/reinvestments for plans
      const planTransactions = await TransactionModel.find({
        user: user._id,
        status: "Completed",
        type: { $in: ["Deposit", "Reinvestment"] },
        plan: { $exists: true, $ne: null }
      }).populate("plan");

      let totalPlanRoi = 0;
      let planInvestmentTotal = 0;

      for (const tx of planTransactions) {
        if (!tx.plan) continue;

        const createdAt = new Date(tx.createdAt);
        const diffTime = Math.abs(startOfToday - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Only calculate if within duration
        if (diffDays <= tx.plan.duration) {
          const txRoi = (tx.investment * (tx.plan.dailyRoi || 0)) / 100;
          totalPlanRoi += txRoi;
          planInvestmentTotal += tx.investment;
        }
      }

      // 2. Calculate Standard Package ROI (on the rest of the investment)
      const packageInvestment = Math.max(0, (user.investment || 0) - planInvestmentTotal);
      let packageRoiPercent = 0;

      if (packageInvestment >= 100 && packageInvestment <= 1000) packageRoiPercent = 0.20;
      else if (packageInvestment >= 1001 && packageInvestment <= 5000) packageRoiPercent = 0.233;
      else if (packageInvestment >= 5001) packageRoiPercent = 0.25;

      const packageRoi = (packageInvestment * packageRoiPercent) / 100;

      const finalROI = totalPlanRoi + packageRoi;

      if (finalROI <= 0) continue;

      // Ensure IncomeDetails exists
      let income = user.incomeDetails;
      if (!income) {
        income = await IncomeModel.create({ user: user._id });
        user.incomeDetails = income._id;
        await user.save();
      } else {
        // Re-fetch to ensure we have the document
        income = await IncomeModel.findById(income._id || income);
      }

      // Add to ROI wallet
      income.income.roiWallet = (income.income.roiWallet || 0) + finalROI;
      income.income.totalIncome = (income.income.totalIncome || 0) + finalROI;
      await income.save();

      // Record ROI History
      await ROIHistory.create({
        user: user._id,
        amount: finalROI,
        roiPercent: packageRoiPercent, // Note: this stores the package %; total is aggregate
        planRoi: totalPlanRoi,
        packageRoi: packageRoi
      });

      user.todayRoiCollected = true;
      await user.save();

      console.log(`✅ User ${user.username} ROI: ${finalROI.toFixed(2)} (Plan: ${totalPlanRoi.toFixed(2)}, Pkg: ${packageRoi.toFixed(2)})`);
    }

    return res.status(200).json({ success: true, message: "Ai Trade submitted successfully " });
  } catch (err) {
    console.error("❌ ROI Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};





//=====================================GENERATION ROI=====================================//

// ✅ Max levels allowed based on direct partners (Unlock Conditions)
function getMaxLevels(partnersCount) {
  if (partnersCount >= 15) return 25;
  if (partnersCount >= 10) return 16;
  if (partnersCount >= 6) return 10;
  if (partnersCount >= 3) return 3;
  if (partnersCount >= 1) return 1;
  return 0; // 0 levels unlocked if 0 partners
}

// ✅ Get ROI percentage for a level (Level ROI Dividend)
function getLevelPercent(level) {
  if (level >= 1 && level <= 3) return 5;
  if (level >= 4 && level <= 10) return 2;
  if (level >= 11 && level <= 16) return 1;
  if (level >= 17 && level <= 25) return 0.5;
  return 0;
}

// ✅ Main distribution function
exports.distributeGenerationROI = async (userId, roiAmount) => {
  try {
    let currentUser = await UserModel.findById(userId).populate("sponsor");
    if (!currentUser) return;

    // Skip if the investing user is in excluded list - their ROI won't generate referral income
    if (currentUser.id && EXCLUDED_USER_IDS.includes(currentUser.id)) {
      console.log(`⏭️ Skipping Generation ROI distribution: User ${currentUser.id} (${currentUser.username}) is excluded from referral income`);
      return;
    }

    let level = 1;

    while (currentUser && level <= 25) {
      const upline = await UserModel.findById(currentUser.sponsor).populate("partners");
      if (!upline) break;

      // ✅ Update pointer immediately to avoid infinite loop when skipping
      currentUser = upline;

      if (upline.active.isBlocked || !upline.active.isActive || upline.investment < 100) continue;

      // If upline is in excluded list - stop the chain completely
      // Their sponsors won't get Generation ROI from excluded users' ROI
      if (upline.id && EXCLUDED_USER_IDS.includes(upline.id)) {
        console.log(`⏭️ Stopping Generation ROI chain at excluded upline ${upline.id} (${upline.username}) - no income to their sponsors`);
        break; // Stop the chain completely - don't give income to anyone above excluded user
      }

      // ✅ Count only partners with >= $100 investment
      const activePartnersCount = upline.partners.filter(p => p.active && p.active.isActive && p.investment >= 100).length;
      const maxLevels = getMaxLevels(activePartnersCount);

      if (level <= maxLevels) {
        const percent = getLevelPercent(level);
        if (percent > 0) {
          const genIncome = (roiAmount * percent) / 100;

          // ✅ Ensure IncomeDetails exists
          let income = upline.incomeDetails;
          if (!income) {
            income = await IncomeModel.create({ user: upline._id });
            upline.incomeDetails = income._id;
            await upline.save();
          } else {
            income = await IncomeModel.findById(income);
          }

          // ✅ Add Generation ROI (Level Income) to Level Income Wallet (not main wallet)
          income.income.levelIncomeWallet = (income.income.levelIncomeWallet || 0) + genIncome;
          income.income.totalIncome += genIncome;
          await income.save();


          const id = generateCustomId({ prefix: 'ZTD-LVL', max: 14, min: 14 });
          const days = await CommissionIncome.find({ user: upline._id, fromUser: userId, type: "Level Income", status: "Completed" })
          const newLevel = new CommissionIncome({ id, user: upline._id, fromUser: userId, level: level, income: genIncome, percentage: percent, amount: Number(roiAmount), days: Number(days.length + 1), type: "Level Income", status: "Completed" });

          await newLevel.save();
          // ✅ Save Generation ROI history
          // await GenerationROIHistory.create({
          //   fromUser: userId,
          //   toUser: upline._id,
          //   level,
          //   amount: genIncome,
          //   percent
          // });

          console.log(
            `User ${upline.username} ko Generation ROI mila $${genIncome.toFixed(
              2
            )} (Level ${level}, ${percent}%)`
          );
        }
      }

      // Move up one level
      level++;
    }
  } catch (err) {
    console.error("❌ Generation ROI Distribution Error:", err.message);
  }
};

