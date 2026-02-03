// trading.roi.cron.js
const cron = require("node-cron");
const { UserModel } = require("../models/user.model");
const { calculateAndDistributeROI } = require("../controllers/roiAndSingleLeg.controller");

// Run every day at 5:30 AM to distribute ROI to all active users with investment
cron.schedule("30 5 * * *", async () => {
  try {
    console.log(`⏰ Trading ROI Cron started at: ${new Date().toISOString()}`);

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get all active users with investment >= $1 and AI trade activated in last 24 hours
    const eligibleUsers = await UserModel.find({
      "active.isActive": true,
      investment: { $gte: 1 },
      lastAiTradeActivation: { $gte: last24Hours }
    });

    console.log(`📊 Processing ${eligibleUsers.length} active users with investment...`);

    let successCount = 0;
    let failCount = 0;
    let totalDistributed = 0;

    for (const user of eligibleUsers) {
      try {
        const result = await calculateAndDistributeROI(user._id, null);
        
        if (result.success) {
          successCount++;
          totalDistributed += result.amount;
          console.log(`✅ ROI: ${user.username} → $${result.amount.toFixed(2)}`);
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
        console.error(`❌ Error: ${user.username} - ${error.message}`);
      }
    }

    console.log(`\n✅ Trading ROI Cron completed:`);
    console.log(`   - Success: ${successCount} users`);
    console.log(`   - Failed: ${failCount} users`);
    console.log(`   - Total Distributed: $${totalDistributed.toFixed(2)}`);
  } catch (err) {
    console.error("❌ Trading ROI Cron Error:", err.message);
  }
});

console.log("🚀 Trading ROI Cron Job initialized (runs daily at 5:30 AM)");
