// controllers/roiAndSingleLeg.controller.js
const { UserModel } = require("../models/user.model");
const { CommissionIncome } = require("../models/commission.model");
const { TransactionModel } = require("../models/transaction.model");
const { IncomeModel } = require("../models/income.model");
const { generateCustomId } = require("../utils/generator.uniqueid");

/**
 * Get ROI percentage and duration based on investment amount
 * Following the updated Growth Plan structure
 */
function getROIPlanDetails(investmentAmount) {
  // Basic Growth Plans (30 days)
  if (investmentAmount >= 1 && investmentAmount < 500) {
    return { dailyROI: 5, duration: 30, planName: "Basic Growth Plan 1" };
  }
  if (investmentAmount >= 500 && investmentAmount < 5000) {
    return { dailyROI: 5.5, duration: 30, planName: "Basic Growth Plan 2" };
  }
  if (investmentAmount >= 5000 && investmentAmount < 25000) {
    return { dailyROI: 6, duration: 30, planName: "Basic Growth Plan 3" };
  }
  if (investmentAmount >= 25000 && investmentAmount < 50000) {
    return { dailyROI: 6.5, duration: 30, planName: "Basic Growth Plan 4" };
  }
  if (investmentAmount >= 50000 && investmentAmount < 100000) {
    return { dailyROI: 7, duration: 30, planName: "Basic Growth Plan 5" };
  }

  // Economic Growth Plan (45 days)
  if (investmentAmount >= 5000 && investmentAmount < 25000) {
    return { dailyROI: 6, duration: 45, planName: "Economic Growth Plan" };
  }

  // Diamond Growth Plan (60 days)
  if (investmentAmount >= 25000 && investmentAmount < 100000) {
    return { dailyROI: 7, duration: 60, planName: "Diamond Growth Plan" };
  }

  return { dailyROI: 0, duration: 0, planName: "No Plan" };
}
/**
 * Calculate and distribute ROI Income based on investment plans
 * ROI is calculated daily based on EACH TRANSACTION'S investment and plan
 * Each transaction has its own duration counter
 */
exports.calculateAndDistributeROI = async (userId, transactionId = null) => {
  try {
    const user = await UserModel.findById(userId).populate("incomeDetails");
    if (!user || !user.active.isActive) {
      return { success: false, message: "User not eligible for ROI" };
    }

    // Get all deposit transactions for this user
    const { TransactionModel } = require("../models/transaction.model");
    const transactions = transactionId 
      ? [await TransactionModel.findById(transactionId)]
      : await TransactionModel.find({ user: userId, type: "Deposit", status: "Completed" });

    if (!transactions || transactions.length === 0) {
      return { success: false, message: "No investment transactions found" };
    }

    let totalRoiDistributed = 0;

    for (const transaction of transactions) {
      if (!transaction) continue;

      const investmentAmount = transaction.investment;
      if (investmentAmount < 1) continue;

      // Get plan details based on THIS transaction's investment amount
      const planDetails = getROIPlanDetails(investmentAmount);

      if (planDetails.dailyROI === 0) {
        console.log(`⏭️ No ROI plan for transaction ${transaction._id} (amount: $${investmentAmount})`);
        continue;
      }

      // Count existing ROI days for THIS specific transaction
      const existingDays = await CommissionIncome.countDocuments({
        user: userId,
        type: "Trading Profit Income",
        tx: transaction._id // Track by transaction ID
      });

      // Check if duration completed for this transaction
      if (existingDays >= planDetails.duration) {
        console.log(`⏭️ ROI duration completed for transaction ${transaction._id} (${existingDays}/${planDetails.duration} days)`);
        continue;
      }

      // Calculate daily ROI for this transaction
      const roiIncome = (investmentAmount * planDetails.dailyROI) / 100;

      if (roiIncome <= 0) continue;

      // Ensure IncomeDetails exists
      let income = user.incomeDetails;
      if (!income) {
        income = await IncomeModel.create({ user: userId });
        user.incomeDetails = income._id;
        await user.save();
      } else {
        income = await IncomeModel.findById(income._id || income);
      }

      // Add to income
      income.income.currentIncome = (income.income.currentIncome || 0) + roiIncome;
      income.income.totalIncome = (income.income.totalIncome || 0) + roiIncome;
      await income.save();

      // Create ROI Income record
      const id = generateCustomId({ prefix: 'ZTD-ROI', max: 14, min: 14 });
      await CommissionIncome.create({
        id,
        user: userId,
        tx: transaction._id, // Link to specific transaction
        amount: investmentAmount,
        income: roiIncome,
        percentage: planDetails.dailyROI,
        type: "Trading Profit Income",
        status: "Completed",
        days: existingDays + 1,
        level: planDetails.planName,
        rewardPaid: existingDays + 1 >= planDetails.duration ? "Completed" : "Processing"
      });

      totalRoiDistributed += roiIncome;
      console.log(`✅ ROI: ${user.username} - $${roiIncome.toFixed(2)} (${planDetails.dailyROI}% - Day ${existingDays + 1}/${planDetails.duration}) [Tx: ${transaction._id}]`);
    }

    if (totalRoiDistributed > 0) {
      return { success: true, amount: totalRoiDistributed };
    } else {
      return { success: false, message: "No ROI to distribute (all plans completed or no eligible transactions)" };
    }
  } catch (error) {
    console.error("❌ ROI Distribution Error:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Calculate and distribute Single Leg Income
 * Single Leg income is based on the weaker leg business volume
 */
exports.calculateAndDistributeSingleLegIncome = async (userId) => {
  try {
    const user = await UserModel.findById(userId).populate("partners");
    if (!user || !user.active.isActive || user.investment < 100) {
      return { success: false, message: "User not eligible for Single Leg Income" };
    }

    // Get direct partners
    const partners = user.partners.filter(p => p.active && p.active.isActive && p.investment >= 100);
    if (partners.length < 2) {
      return { success: false, message: "Need at least 2 active partners for Single Leg Income" };
    }

    // Calculate business volume for each leg
    const { getDirectPartnersDownlines } = require("../utils/getteams.downline");
    const { powerLagBusiness, weakerLagBusiness } = await getDirectPartnersDownlines({ userId });

    const weakerLegVolume = Math.min(powerLagBusiness, weakerLagBusiness);

    if (weakerLegVolume <= 0) {
      return { success: false, message: "No business volume in weaker leg" };
    }

    // Single Leg Income percentage (configurable)
    const singleLegPercent = 0.5; // 0.5% of weaker leg business
    const singleLegIncome = (weakerLegVolume * singleLegPercent) / 100;

    if (singleLegIncome <= 0) {
      return { success: false, message: "No Single Leg Income to distribute" };
    }

    // Ensure IncomeDetails exists
    let income = user.incomeDetails;
    if (!income) {
      income = await IncomeModel.create({ user: userId });
      user.incomeDetails = income._id;
      await user.save();
    } else {
      income = await IncomeModel.findById(income._id || income);
    }

    // Add to income
    income.income.currentIncome = (income.income.currentIncome || 0) + singleLegIncome;
    income.income.totalIncome = (income.income.totalIncome || 0) + singleLegIncome;
    await income.save();

    // Create Single Leg Income record
    const id = generateCustomId({ prefix: 'ZTD-SLG', max: 14, min: 14 });
    await CommissionIncome.create({
      id,
      user: userId,
      amount: weakerLegVolume,
      income: singleLegIncome,
      percentage: singleLegPercent,
      type: "SINGLE_LEG",
      status: "Completed",
      legPosition: powerLagBusiness > weakerLagBusiness ? "Right" : "Left"
    });

    console.log(`✅ Single Leg Income: User ${user.username} received $${singleLegIncome.toFixed(2)} from weaker leg ($${weakerLegVolume})`);
    return { success: true, amount: singleLegIncome };
  } catch (error) {
    console.error("❌ Single Leg Income Error:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Trigger ROI Income calculation for a user (can be called from investment or cron)
 */
exports.triggerROIIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const { investmentAmount } = req.body;

    if (!investmentAmount || investmentAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment amount"
      });
    }

    const result = await exports.calculateAndDistributeROI(userId, investmentAmount);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("❌ Trigger ROI Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Distribute Single Leg Income from withdrawal (10% commission)
 * Distributes to max 20 users: 10 before + 10 after registration time
 * Each user gets 5% of the commission amount
 * Only active users with $100+ investment are eligible
 * 
 * @param {String} userId - User who made the withdrawal
 * @param {Number} commissionAmount - 10% commission from withdrawal (NOT the withdrawal amount)
 */
exports.distributeSingleLegFromWithdrawal = async (userId, commissionAmount) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const userCreatedAt = user.createdAt;

    // Find 10 active users registered BEFORE this user
    const beforeUsers = await UserModel.find({
      createdAt: { $lt: userCreatedAt },
      "active.isActive": true,
      investment: { $gte: 100 }
    })
    .sort({ createdAt: -1 }) // Latest first (closest to current user)
    .limit(10)
    .populate("incomeDetails");

    // Find 10 active users registered AFTER this user
    const afterUsers = await UserModel.find({
      createdAt: { $gt: userCreatedAt },
      "active.isActive": true,
      investment: { $gte: 100 }
    })
    .sort({ createdAt: 1 }) // Earliest first (closest to current user)
    .limit(10)
    .populate("incomeDetails");

    const totalEligibleUsers = beforeUsers.length + afterUsers.length;
    
    // Calculate per user amount (5% of commission each, max 20 users)
    const perUserPercentage = 5; // 5% of commission to each user
    const perUserAmount = (commissionAmount * perUserPercentage) / 100;

    console.log(`\n💰 [SINGLE LEG] Distributing from ${user.username}'s withdrawal`);
    console.log(`   Commission Amount (10% of withdrawal): $${commissionAmount.toFixed(2)}`);
    console.log(`   Found: ${beforeUsers.length} before + ${afterUsers.length} after = ${totalEligibleUsers} eligible users`);
    console.log(`   Per User (5% of commission): $${perUserAmount.toFixed(2)}`);
    console.log(`   Total Distribution: $${(perUserAmount * totalEligibleUsers).toFixed(2)}`);
    console.log(`   Remaining to Admin: $${(commissionAmount - (perUserAmount * totalEligibleUsers)).toFixed(2)}`);

    let totalDistributed = 0;

    // Distribute to BEFORE users
    let level = 1;
    for (const beforeUser of beforeUsers) {
      const incomeAmount = perUserAmount;

      let income = beforeUser.incomeDetails;
      if (!income) {
        income = await IncomeModel.create({ user: beforeUser._id });
        beforeUser.incomeDetails = income._id;
        await beforeUser.save();
      } else {
        income = await IncomeModel.findById(income._id || income);
      }

      income.income.currentIncome = (income.income.currentIncome || 0) + incomeAmount;
      income.income.totalIncome = (income.income.totalIncome || 0) + incomeAmount;
      await income.save();

      const id = generateCustomId({ prefix: 'ZTD-SLW', max: 14, min: 14 });
      await CommissionIncome.create({
        id,
        user: beforeUser._id,
        fromUser: userId,
        amount: commissionAmount,
        income: incomeAmount,
        percentage: perUserPercentage,
        type: "SINGLE_LEG",
        status: "Completed",
        level: `Before-${level}`,
        legPosition: "Before Registration"
      });

      totalDistributed += incomeAmount;
      console.log(`   ✅ Before-${level}: ${beforeUser.username} → $${incomeAmount.toFixed(2)}`);
      level++;
    }

    // Distribute to AFTER users
    level = 1;
    for (const afterUser of afterUsers) {
      const incomeAmount = perUserAmount;

      let income = afterUser.incomeDetails;
      if (!income) {
        income = await IncomeModel.create({ user: afterUser._id });
        afterUser.incomeDetails = income._id;
        await afterUser.save();
      } else {
        income = await IncomeModel.findById(income._id || income);
      }

      income.income.currentIncome = (income.income.currentIncome || 0) + incomeAmount;
      income.income.totalIncome = (income.income.totalIncome || 0) + incomeAmount;
      await income.save();

      const id = generateCustomId({ prefix: 'ZTD-SLW', max: 14, min: 14 });
      await CommissionIncome.create({
        id,
        user: afterUser._id,
        fromUser: userId,
        amount: commissionAmount,
        income: incomeAmount,
        percentage: perUserPercentage,
        type: "SINGLE_LEG",
        status: "Completed",
        level: `After-${level}`,
        legPosition: "After Registration"
      });

      totalDistributed += incomeAmount;
      console.log(`   ✅ After-${level}: ${afterUser.username} → $${incomeAmount.toFixed(2)}`);
      level++;
    }

    // Calculate remaining amount
    const remainingAmount = commissionAmount - totalDistributed;

    // If remaining amount exists, send to admin wallet
    if (remainingAmount > 0) {
      const { AdminWallet } = require('../models/adminWallet.model');
      const adminUser = await UserModel.findOne({ role: 'admin' }).populate('incomeDetails');
      
      if (adminUser) {
        let adminIncome = adminUser.incomeDetails;
        if (!adminIncome) {
          adminIncome = await IncomeModel.create({ user: adminUser._id });
          adminUser.incomeDetails = adminIncome._id;
          await adminUser.save();
        } else {
          adminIncome = await IncomeModel.findById(adminIncome._id || adminIncome);
        }

        adminIncome.income.currentIncome = (adminIncome.income.currentIncome || 0) + remainingAmount;
        adminIncome.income.totalIncome = (adminIncome.income.totalIncome || 0) + remainingAmount;
        await adminIncome.save();

        // Save to AdminWallet model
        const adminWalletId = generateCustomId({ prefix: 'ZTD-ADW', max: 14, min: 14 });
        await AdminWallet.create({
          id: adminWalletId,
          adminUser: adminUser._id,
          fromUser: userId,
          totalCommission: commissionAmount,
          distributedAmount: totalDistributed,
          remainingAmount: remainingAmount,
          percentage: (remainingAmount / commissionAmount) * 100,
          eligibleUsers: totalEligibleUsers,
          type: 'SINGLE_LEG_COMMISSION',
          status: 'Completed',
          remark: `Remaining Single Leg commission from ${user.username}'s withdrawal`,
          metadata: {
            withdrawalUser: user.username,
            withdrawalUserId: userId,
            beforeUsers: beforeUsers.length,
            afterUsers: afterUsers.length
          }
        });

        console.log(`   💼 Admin Wallet: ${adminUser.username} → $${remainingAmount.toFixed(2)} (remaining amount)`);
      }
    }

    console.log(`✅ [SINGLE LEG] Total distributed: $${totalDistributed.toFixed(2)} to ${totalEligibleUsers} users`);
    if (remainingAmount > 0) {
      console.log(`   💼 Remaining sent to admin: $${remainingAmount.toFixed(2)}\n`);
    } else {
      console.log(``);
    }
    
    return { 
      success: true, 
      totalAmount: commissionAmount,
      distributedAmount: totalDistributed,
      remainingAmount: remainingAmount,
      beforeUsers: beforeUsers.length,
      afterUsers: afterUsers.length,
      perUserAmount: perUserAmount
    };
  } catch (error) {
    console.error("❌ Single Leg Withdrawal Distribution Error:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Trigger Single Leg Income calculation for a user
 */
exports.triggerSingleLegIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await exports.calculateAndDistributeSingleLegIncome(userId);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("❌ Trigger Single Leg Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
