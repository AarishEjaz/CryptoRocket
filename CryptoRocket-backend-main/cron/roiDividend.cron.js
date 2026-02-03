const cron = require("node-cron");
const moment = require("moment-timezone");
const { processAllROIDividends } = require("../utils/roiDividend.calculation");

let isProcessing = false;

/**
 * ROI Dividend Cron Job
 * Runs daily at 5:30 AM IST (after Trading ROI distribution)
 */
const roiDividendCron = async () => {
    if (isProcessing) {
        console.log('⏭️ ROI Dividend cron already running, skipping...');
        return;
    }
    
    isProcessing = true;
    
    try {
        const istTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(`⏰ ROI Dividend Cron started at IST: ${istTime}`);
        
        await processAllROIDividends();
        
        console.log('✅ ROI Dividend Cron completed successfully');
    } catch (error) {
        console.error('❌ Error in ROI Dividend Cron:', error);
    } finally {
        isProcessing = false;
    }
};

// Schedule: Every day at 5:30 AM IST (30 5 * * *)
cron.schedule('30 5 * * *', () => {
    const istTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    console.log(`⏰ ROI Dividend Cron triggered at IST: ${istTime}`);
    roiDividendCron();
});

console.log('✅ ROI Dividend Cron scheduled: Daily at 5:30 AM IST');

module.exports = roiDividendCron;
