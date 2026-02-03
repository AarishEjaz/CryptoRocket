const { recalculateAllIncomes } = require("../utils/recalculateIncomes");

// API to recalculate referral and level income for all users
exports.recalculateAllUserIncomes = async (req, res) => {
    try {
        console.log("🚀 Starting income recalculation API...");
        
        const result = await recalculateAllIncomes();
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Income recalculation completed successfully",
                data: result
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Income recalculation failed",
                error: result.error
            });
        }
        
    } catch (error) {
        console.error("❌ API Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// API to get income calculation preview (without saving to database)
exports.previewIncomeCalculation = async (req, res) => {
    try {
        console.log("🔍 Generating income calculation preview...");
        
        const result = await recalculateAllIncomes();
        
        if (result.success) {
            // Sort users by total earnings (highest first)
            const topEarners = result.userResults
                .sort((a, b) => b.totalEarnings - a.totalEarnings)
                .slice(0, 20); // Top 20 earners
            
            return res.status(200).json({
                success: true,
                message: "Income calculation preview generated",
                data: {
                    summary: result.summary,
                    topEarners,
                    totalUsers: result.userResults.length
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Preview generation failed",
                error: result.error
            });
        }
        
    } catch (error) {
        console.error("❌ Preview API Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};