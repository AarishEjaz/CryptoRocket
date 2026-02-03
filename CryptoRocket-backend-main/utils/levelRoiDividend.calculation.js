// levelRoiDividend.calculation.js
const { CommissionIncome } = require("../models/commission.model");
const { IncomeModel } = require("../models/income.model");
const { UserModel } = require("../models/user.model");
const { generateCustomId } = require("./generator.uniqueid");
const { NumberFixed } = require("./NumberFixed");

// Level ROI Dividend Structure (4 Steps)
const levelRoiDividendPercentages = [
    0.05, 0.05, 0.05,                                    // Level 1-3: 5%
    0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,           // Level 4-10: 2%
    0.01, 0.01, 0.01, 0.01, 0.01, 0.01,                 // Level 11-16: 1%
    0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005  // Level 17-25: 0.5%
];

/**
 * Calculate user's maximum unlocked level
 * Same logic as levelIncome.calculation.js
 */
const calculateUserLevel = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) return 0;

        // Check self investment requirement
        if (!user.investment || user.investment < 100) {
            return 0;
        }

        // Count qualified direct referrals
        const qualifiedDirects = await UserModel.countDocuments({
            sponsor: userId,
            'active.isActive': true,
            investment: { $gte: 100 }
        });

        // Z-1 QUALIFICATION: 10+ direct + 30+ team members
        if (qualifiedDirects >= 10) {
            let totalTeamMembers = 0;
            const directReferrals = await UserModel.find({
                sponsor: userId,
                'active.isActive': true,
                investment: { $gte: 100 }
            }).select('_id');
            
            for (const directRef of directReferrals) {
                const { getDownlineArray } = require('./getteams.downline');
                const dlResult = await getDownlineArray({ userId: directRef._id, listShow: true });
                
                const qualifiedInLeg = (dlResult.downline || []).filter(d =>
                    d.active && d.active.isActive && d.investment >= 100
                ).length;
                
                const legContribution = Math.min(qualifiedInLeg, 15);
                totalTeamMembers += legContribution;
            }
            
            const totalPeople = qualifiedDirects + totalTeamMembers;
            if (totalTeamMembers >= 30 && totalPeople >= 40) {
                return 25;
            }
        }

        // Fallback levels
        if (qualifiedDirects >= 15) return 16;
        if (qualifiedDirects >= 10) return 10;
        if (qualifiedDirects >= 6) return 6;
        if (qualifiedDirects >= 3) return 3;
        if (qualifiedDirects >= 1) return 1;
        
        return 0;
    } catch (error) {
        console.error('❌ Error calculating user level:', error);
        return 0;
    }
};

/**
 * Distribute Level ROI Dividend to uplines
 * Called after Trading ROI is distributed
 * @param {String} userId - User who received Trading ROI
 * @param {Number} tradingRoiAmount - Amount of Trading ROI received
 */
const distributeLevelRoiDividend = async (userId, tradingRoiAmount) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) return;

        console.log(`\n💰 [LEVEL ROI DIVIDEND] Starting distribution for ${user.username} (Trading ROI: $${tradingRoiAmount.toFixed(2)})`);

        let currentUser = user;
        
        for (let level = 0; level < levelRoiDividendPercentages.length; level++) {
            if (!currentUser.sponsor) break;
            
            const sponsor = await UserModel.findById(currentUser.sponsor);
            if (!sponsor) break;
            if (sponsor.active.isBlocked) break;

            // Check if sponsor's account is active
            if (!sponsor.active.isActive) {
                console.log(`⏭️ Level ${level + 1}: Sponsor ${sponsor.username} is inactive - skipping`);
                currentUser = sponsor;
                continue;
            }

            // Calculate sponsor's maximum unlocked level
            const maxUnlockedLevel = await calculateUserLevel(sponsor._id);
            const currentLevel = level + 1;

            // Check if this level is unlocked for sponsor
            if (currentLevel <= maxUnlockedLevel) {
                const incomeDetails = await IncomeModel.findById(sponsor.incomeDetails);
                if (!incomeDetails) break;

                const percentage = levelRoiDividendPercentages[level];
                const income = Number(tradingRoiAmount * percentage);

                // Add to Level Income
                incomeDetails.levelIncome.income = NumberFixed(incomeDetails.levelIncome.income, income);
                incomeDetails.income.totalIncome = NumberFixed(incomeDetails.income.totalIncome, income);
                incomeDetails.income.levelIncomeWallet = NumberFixed(incomeDetails.income.levelIncomeWallet || 0, income);

                // Create commission record
                const id = generateCustomId({ prefix: 'ZTD-LROI', max: 14, min: 14 });
                const newLevelRoi = new CommissionIncome({
                    id,
                    user: sponsor._id,
                    fromUser: user._id,
                    level: currentLevel,
                    income: income,
                    percentage: percentage * 100,
                    amount: Number(tradingRoiAmount),
                    type: "Level ROI Dividend",
                    status: "Completed"
                });

                incomeDetails.levelIncome.history.push(newLevelRoi._id);
                await newLevelRoi.save();
                await incomeDetails.save();

                console.log(`✅ Level ${currentLevel} ROI Dividend: $${income.toFixed(2)} (${(percentage * 100)}%) → ${sponsor.username}`);
            } else {
                console.log(`⏭️ Level ${currentLevel} locked for ${sponsor.username} (max unlocked: ${maxUnlockedLevel})`);
            }

            currentUser = sponsor;
        }

        console.log(`✅ [LEVEL ROI DIVIDEND] Distribution completed for ${user.username}\n`);
    } catch (error) {
        console.error("❌ Error in Level ROI Dividend Distribution:", error.message);
    }
};

module.exports = { distributeLevelRoiDividend };
