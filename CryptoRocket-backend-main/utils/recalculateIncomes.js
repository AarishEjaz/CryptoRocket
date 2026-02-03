const { UserModel } = require("../models/user.model");
const { TransactionModel } = require("../models/transaction.model");
const { IncomeModel } = require("../models/income.model");
const { CommissionIncome } = require("../models/commission.model");
const { generateCustomId } = require("./generator.uniqueid");

// Referral bonus calculation (same as referralBonus.calculation.js)
const getReferralBonusAmount = (amount) => {
    if (amount >= 50000) return 500;
    if (amount >= 25000) return 200;
    if (amount >= 5000) return 75;
    if (amount >= 500) return 25;
    if (amount >= 100) return 10;
    return 0;
};

// Level income percentages
const levelIncomePercentages = [
    0,          // 1st (Handled separately by referral bonus)
    0.05,       // 2nd - Level 2-3: 5%
    0.05,       // 3rd - Level 2-3: 5%
    0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,         // 4th-10th - Level 4-10: 2%
    0.01, 0.01, 0.01, 0.01, 0.01, 0.01,               // 11th-16th - Level 11-16: 1%
    0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005    // 17th-25th - Level 17-25: 0.5%
];

// Calculate user level qualification
const calculateUserLevel = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user || !user.investment || user.investment < 100) return 0;

        const qualifiedDirects = await UserModel.countDocuments({
            sponsor: userId,
            'active.isActive': true,
            investment: { $gte: 100 }
        });

        if (qualifiedDirects >= 15) return 25;
        if (qualifiedDirects >= 10) return 16;
        if (qualifiedDirects >= 6) return 10;
        if (qualifiedDirects >= 3) return 3;
        if (qualifiedDirects >= 1) return 1;
        return 0;
    } catch (error) {
        console.error('Error calculating user level:', error);
        return 0;
    }
};

// Recalculate referral and level income for all users
const recalculateAllIncomes = async () => {
    try {
        console.log("🔄 Starting income recalculation for all users...");
        
        // Get all users with their total investments
        const users = await UserModel.find({}).select('_id username investment sponsor active incomeDetails');
        console.log(`📊 Found ${users.length} users to process`);

        let processedUsers = 0;
        let totalReferralBonus = 0;
        let totalLevelIncome = 0;
        const results = [];

        for (const user of users) {
            try {
                if (!user.investment || user.investment < 100) {
                    console.log(`⏭️ Skipping ${user.username}: Investment < $100 (${user.investment || 0})`);
                    continue;
                }

                console.log(`\n🔍 Processing User: ${user.username} (Investment: $${user.investment})`);

                // Find all direct referrals
                const directReferrals = await UserModel.find({
                    sponsor: user._id,
                    'active.isActive': true,
                    investment: { $gte: 100 }
                }).select('_id username investment');

                if (directReferrals.length === 0) {
                    console.log(`  ℹ️ No qualified direct referrals found`);
                    continue;
                }

                console.log(`  👥 Found ${directReferrals.length} qualified direct referrals`);

                let userReferralBonus = 0;
                let userLevelIncome = 0;

                // Calculate referral bonus for each direct referral
                for (const referral of directReferrals) {
                    const referralInvestment = referral.investment || 0;
                    const bonus = getReferralBonusAmount(referralInvestment);
                    
                    if (bonus > 0) {
                        userReferralBonus += bonus;
                        console.log(`    💰 Referral ${referral.username}: $${referralInvestment} → $${bonus} bonus`);
                    }
                }

                // Calculate level income (user's investment distributed to their upline)
                if (user.sponsor) {
                    const maxLevel = await calculateUserLevel(user.sponsor);
                    let currentSponsor = user.sponsor;
                    
                    for (let level = 0; level < levelIncomePercentages.length && level < maxLevel; level++) {
                        if (!currentSponsor) break;
                        
                        const sponsor = await UserModel.findById(currentSponsor).select('sponsor username investment active');
                        if (!sponsor || !sponsor.active?.isActive || (sponsor.investment || 0) < 100) break;
                        
                        const percentage = levelIncomePercentages[level];
                        if (percentage > 0) {
                            const levelBonus = user.investment * percentage;
                            userLevelIncome += levelBonus;
                            console.log(`    📈 Level ${level + 1} to ${sponsor.username}: ${(percentage * 100).toFixed(1)}% of $${user.investment} = $${levelBonus.toFixed(2)}`);
                        }
                        
                        currentSponsor = sponsor.sponsor;
                    }
                }

                totalReferralBonus += userReferralBonus;
                totalLevelIncome += userLevelIncome;
                processedUsers++;

                results.push({
                    userId: user._id,
                    username: user.username,
                    investment: user.investment,
                    directReferrals: directReferrals.length,
                    referralBonus: userReferralBonus,
                    levelIncome: userLevelIncome,
                    totalEarnings: userReferralBonus + userLevelIncome
                });

                console.log(`  ✅ ${user.username} Summary: $${userReferralBonus} referral + $${userLevelIncome.toFixed(2)} level = $${(userReferralBonus + userLevelIncome).toFixed(2)} total`);

            } catch (userError) {
                console.error(`❌ Error processing user ${user.username}:`, userError.message);
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log("📊 RECALCULATION SUMMARY");
        console.log("=".repeat(60));
        console.log(`👥 Total Users Processed: ${processedUsers}`);
        console.log(`💰 Total Referral Bonus: $${totalReferralBonus.toFixed(2)}`);
        console.log(`📈 Total Level Income: $${totalLevelIncome.toFixed(2)}`);
        console.log(`💵 Grand Total: $${(totalReferralBonus + totalLevelIncome).toFixed(2)}`);
        console.log("=".repeat(60));

        return {
            success: true,
            summary: {
                totalUsers: users.length,
                processedUsers,
                totalReferralBonus: parseFloat(totalReferralBonus.toFixed(2)),
                totalLevelIncome: parseFloat(totalLevelIncome.toFixed(2)),
                grandTotal: parseFloat((totalReferralBonus + totalLevelIncome).toFixed(2))
            },
            userResults: results
        };

    } catch (error) {
        console.error("❌ Error in income recalculation:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { recalculateAllIncomes };