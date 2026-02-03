const { CommissionIncome } = require("../models/commission.model");
const { IncomeModel } = require("../models/income.model");
const { UserModel } = require("../models/user.model");
const { generateCustomId } = require("./generator.uniqueid");
const { NumberFixed } = require("./NumberFixed");

/**
 * Calculate user's max unlocked level based on direct referrals
 */
const calculateUserLevel = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user || !user.investment || user.investment < 100) {
            return 0;
        }

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
        console.error('❌ Error calculating user level:', error);
        return 0;
    }
};

/**
 * Get all users at specific depth levels from a user
 */
const getUsersAtDepthLevels = async (userId, maxDepth) => {
    try {
        const allUsers = [];
        let currentLevelUsers = [userId];
        
        for (let depth = 1; depth <= maxDepth; depth++) {
            const nextLevelUsers = [];
            
            for (const currentUserId of currentLevelUsers) {
                const directReferrals = await UserModel.find({
                    sponsor: currentUserId,
                    'active.isActive': true,
                    investment: { $gte: 100 }
                }).select('_id');
                
                for (const ref of directReferrals) {
                    nextLevelUsers.push(ref._id);
                    allUsers.push({
                        userId: ref._id,
                        depth: depth
                    });
                }
            }
            
            if (nextLevelUsers.length === 0) break;
            currentLevelUsers = nextLevelUsers;
        }
        
        return allUsers;
    } catch (error) {
        console.error('❌ Error getting users at depth:', error);
        return [];
    }
};

/**
 * Calculate total ROI from downline users at specific depth range
 */
const calculateDownlineROI = async (userId, maxDepth) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const downlineUsers = await getUsersAtDepthLevels(userId, maxDepth);
        const userIds = downlineUsers.map(u => u.userId);
        
        if (userIds.length === 0) return 0;
        
        // Get today's ROI for all downline users
        const roiRecords = await CommissionIncome.find({
            user: { $in: userIds },
            type: "Trading Profit Income",
            status: "Completed",
            createdAt: { $gte: today }
        });
        
        const totalROI = roiRecords.reduce((sum, record) => sum + (record.income || 0), 0);
        return totalROI;
    } catch (error) {
        console.error('❌ Error calculating downline ROI:', error);
        return 0;
    }
};

/**
 * Calculate total ROI from downline users at specific depth range (startDepth to endDepth) for a specific date
 */
const calculateDownlineROIInRangeForDate = async (userId, startDepth, endDepth, targetDate) => {
    try {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const downlineUsers = await getUsersAtDepthLevels(userId, endDepth);
        
        // Filter users only in the specific depth range
        const filteredUsers = downlineUsers.filter(u => u.depth >= startDepth && u.depth <= endDepth);
        const userIds = filteredUsers.map(u => u.userId);
        
        if (userIds.length === 0) return 0;
        
        // Get ROI for filtered users on target date
        const roiRecords = await CommissionIncome.find({
            user: { $in: userIds },
            type: "Trading Profit Income",
            status: "Completed",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        const totalROI = roiRecords.reduce((sum, record) => sum + (record.income || 0), 0);
        return totalROI;
    } catch (error) {
        console.error('❌ Error calculating downline ROI in range for date:', error);
        return 0;
    }
};

/**
 * Calculate total ROI from downline users at specific depth range (startDepth to endDepth)
 */
const calculateDownlineROIInRange = async (userId, startDepth, endDepth) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const downlineUsers = await getUsersAtDepthLevels(userId, endDepth);
        
        // Filter users only in the specific depth range
        const filteredUsers = downlineUsers.filter(u => u.depth >= startDepth && u.depth <= endDepth);
        const userIds = filteredUsers.map(u => u.userId);
        
        if (userIds.length === 0) return 0;
        
        // Get today's ROI for filtered users
        const roiRecords = await CommissionIncome.find({
            user: { $in: userIds },
            type: "Trading Profit Income",
            status: "Completed",
            createdAt: { $gte: today }
        });
        
        const totalROI = roiRecords.reduce((sum, record) => sum + (record.income || 0), 0);
        return totalROI;
    } catch (error) {
        console.error('❌ Error calculating downline ROI in range:', error);
        return 0;
    }
};

/**
 * Distribute ROI Dividend to user for a specific date (for testing/backfill)
 */
const distributeROIDividendForDate = async (userId, targetDate) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user || !user.active.isActive) return { success: false, reason: 'User not active' };
        
        // Check if user already received ROI Dividend for this date
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const existingDividend = await CommissionIncome.findOne({
            user: userId,
            type: "Level ROI Dividend",
            status: "Completed",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        if (existingDividend) {
            return { success: false, reason: 'Already received dividend for this date' };
        }
        
        // Get user's max unlocked level
        const maxLevel = await calculateUserLevel(userId);
        if (maxLevel === 0) {
            return { success: false, reason: 'No levels unlocked' };
        }
        
        // Determine current level range and percentage
        let percentage = 0;
        let levelRange = '';
        let startDepth = 1;
        let endDepth = maxLevel;
        
        if (maxLevel >= 17 && maxLevel <= 25) {
            percentage = 0.005;
            levelRange = '17-25';
            startDepth = 17;
            endDepth = maxLevel;
        } else if (maxLevel >= 11 && maxLevel <= 16) {
            percentage = 0.01;
            levelRange = '11-16';
            startDepth = 11;
            endDepth = maxLevel;
        } else if (maxLevel >= 4 && maxLevel <= 10) {
            percentage = 0.02;
            levelRange = '4-10';
            startDepth = 4;
            endDepth = maxLevel;
        } else if (maxLevel >= 1 && maxLevel <= 3) {
            percentage = 0.05;
            levelRange = '1-3';
            startDepth = 1;
            endDepth = maxLevel;
        }
        
        // Calculate total ROI from current level range for target date
        const totalDownlineROI = await calculateDownlineROIInRangeForDate(userId, startDepth, endDepth, targetDate);
        
        if (totalDownlineROI <= 0) {
            return { success: false, reason: 'No downline ROI' };
        }
        
        const dividend = Number(totalDownlineROI * percentage);
        
        // Update income details
        const incomeDetails = await IncomeModel.findById(user.incomeDetails);
        if (!incomeDetails) return { success: false, reason: 'No income details' };
        
        incomeDetails.levelIncome.income = NumberFixed(incomeDetails.levelIncome.income, dividend);
        incomeDetails.income.totalIncome = NumberFixed(incomeDetails.income.totalIncome, dividend);
        incomeDetails.income.levelIncomeWallet = NumberFixed(incomeDetails.income.levelIncomeWallet || 0, dividend);
        
        // Save commission record with target date
        const id = generateCustomId({ prefix: 'ZTD-ROID', max: 14, min: 14 });
        const newDividend = new CommissionIncome({
            id,
            user: userId,
            amount: totalDownlineROI,
            income: dividend,
            percentage: percentage * 100,
            level: levelRange,
            type: "Level ROI Dividend",
            status: "Completed",
            remark: `ROI Dividend from depth ${levelRange} (Max Level: ${maxLevel})`,
            createdAt: targetDate
        });
        
        incomeDetails.levelIncome.history.push(newDividend._id);
        await newDividend.save();
        await incomeDetails.save();
        
        return { 
            success: true, 
            username: user.username,
            dividend,
            totalDownlineROI,
            levelRange,
            percentage: percentage * 100
        };
    } catch (error) {
        console.error('❌ Error distributing ROI Dividend for date:', error);
        return { success: false, reason: error.message };
    }
};

/**
 * Distribute ROI Dividend to user based on their unlocked level
 */
const distributeROIDividend = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user || !user.active.isActive) return { success: false, reason: 'User not active' };
        
        // Check if user already received ROI Dividend today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingDividend = await CommissionIncome.findOne({
            user: userId,
            type: "Level ROI Dividend",
            status: "Completed",
            createdAt: { $gte: today }
        });
        
        if (existingDividend) {
            console.log(`⏭️ User ${user.username} already received ROI Dividend today`);
            return { success: false, reason: 'Already received today' };
        }
        
        // Get user's max unlocked level
        const maxLevel = await calculateUserLevel(userId);
        if (maxLevel === 0) {
            console.log(`⏭️ User ${user.username} has no levels unlocked`);
            return { success: false, reason: 'No levels unlocked' };
        }
        
        // Determine current level range and percentage
        let percentage = 0;
        let levelRange = '';
        let startDepth = 1;
        let endDepth = maxLevel;
        
        if (maxLevel >= 17 && maxLevel <= 25) {
            percentage = 0.005; // 0.5%
            levelRange = '17-25';
            startDepth = 17;
            endDepth = maxLevel;
        } else if (maxLevel >= 11 && maxLevel <= 16) {
            percentage = 0.01; // 1%
            levelRange = '11-16';
            startDepth = 11;
            endDepth = maxLevel;
        } else if (maxLevel >= 4 && maxLevel <= 10) {
            percentage = 0.02; // 2%
            levelRange = '4-10';
            startDepth = 4;
            endDepth = maxLevel;
        } else if (maxLevel >= 1 && maxLevel <= 3) {
            percentage = 0.05; // 5%
            levelRange = '1-3';
            startDepth = 1;
            endDepth = maxLevel;
        }
        
        // Calculate total ROI from current level range only
        const totalDownlineROI = await calculateDownlineROIInRange(userId, startDepth, endDepth);
        
        console.log(`🔍 DEBUG - User: ${user.username}, MaxLevel: ${maxLevel}, Range: ${levelRange}, Total ROI: $${totalDownlineROI}, Percentage: ${percentage * 100}%`);
        
        if (totalDownlineROI <= 0) {
            console.log(`⏭️ User ${user.username} has no downline ROI in range ${levelRange}`);
            return { success: false, reason: 'No downline ROI' };
        }
        
        const dividend = Number(totalDownlineROI * percentage);
        console.log(`💰 Calculated Dividend: $${dividend}`);
        
        // Update income details
        const incomeDetails = await IncomeModel.findById(user.incomeDetails);
        if (!incomeDetails) return { success: false, reason: 'No income details' };
        
        incomeDetails.levelIncome.income = NumberFixed(incomeDetails.levelIncome.income, dividend);
        incomeDetails.income.totalIncome = NumberFixed(incomeDetails.income.totalIncome, dividend);
        incomeDetails.income.levelIncomeWallet = NumberFixed(incomeDetails.income.levelIncomeWallet || 0, dividend);
        
        // Save commission record
        const id = generateCustomId({ prefix: 'ZTD-ROID', max: 14, min: 14 });
        const newDividend = new CommissionIncome({
            id,
            user: userId,
            amount: totalDownlineROI,
            income: dividend,
            percentage: percentage * 100,
            level: levelRange,
            type: "Level ROI Dividend",
            status: "Completed",
            remark: `ROI Dividend from depth ${levelRange} (Max Level: ${maxLevel})`
        });
        
        incomeDetails.levelIncome.history.push(newDividend._id);
        await newDividend.save();
        await incomeDetails.save();
        
        console.log(`✅ Commission Record Saved - ID: ${newDividend.id}, Type: ${newDividend.type}, Status: ${newDividend.status}`);
        
        console.log(`✅ ROI Dividend distributed to ${user.username}: $${dividend.toFixed(2)} (${percentage * 100}% of $${totalDownlineROI.toFixed(2)} from depth ${levelRange})`);
        
        return { 
            success: true, 
            username: user.username,
            dividend,
            totalDownlineROI,
            levelRange,
            percentage: percentage * 100
        };
    } catch (error) {
        console.error('❌ Error distributing ROI Dividend:', error);
        return { success: false, reason: error.message };
    }
};

/**
 * Process ROI Dividend for all active users
 */
const processAllROIDividends = async () => {
    try {
        console.log('🔄 Starting ROI Dividend distribution...');
        
        const users = await UserModel.find({
            'active.isActive': true,
            'active.isVerified': true,
            'active.isBlocked': false,
            investment: { $gte: 100 }
        });
        
        let processed = 0;
        let totalAmount = 0;
        
        for (const user of users) {
            const result = await distributeROIDividend(user._id);
            if (result && result.success) {
                processed++;
                totalAmount += result.dividend || 0;
            }
        }
        
        console.log('✅ ROI Dividend distribution completed');
        return { success: true, processed, totalAmount };
    } catch (error) {
        console.error('❌ Error processing ROI Dividends:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    distributeROIDividend,
    distributeROIDividendForDate,
    processAllROIDividends,
    calculateUserLevel
};
