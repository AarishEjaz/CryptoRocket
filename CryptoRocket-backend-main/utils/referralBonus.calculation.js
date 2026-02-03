const { UserModel } = require("../models/user.model");
const { IncomeModel } = require("../models/income.model");
const { CommissionIncome } = require("../models/commission.model");
const { generateCustomId } = require("./generator.uniqueid");

const getReferralBonusAmount = (amount) => {
    if (amount >= 50000) return 500;
    if (amount >= 25000) return 200;
    if (amount >= 5000) return 75;
    if (amount >= 500) return 25;
    if (amount >= 100) return 10;
    return 0;
};

exports.distributeReferralBonus = async ({ userId, amount, session = null }) => {
    try {
        if (!amount || amount < 100) return; // Min eligible amount is 100 based on table

        const bonus = getReferralBonusAmount(amount);
        if (bonus === 0) return;

        // Find user to get sponsor
        const user = await UserModel.findById(userId).session(session);

        if (!user || !user.sponsor) return;

        const sponsorId = user.sponsor;

        // ✅ CHECK: Has sponsor already received referral bonus from this user?
        const existingReferralBonus = await CommissionIncome.findOne({
            user: sponsorId,
            fromUser: userId,
            type: "Referral Income",
            status: "Completed"
        }).session(session);

        if (existingReferralBonus) {
            console.log(`⏭️ Skipping: Sponsor already received referral bonus from user ${user.username || userId} (First investment bonus already paid)`);
            return;
        }

        // Find Sponsor (populate incomeDetails only to get the ID/doc, we need to save it separately usually)
        const sponsor = await UserModel.findById(sponsorId).populate('incomeDetails').session(session);
        if (!sponsor) return;

        let incomeDetails = sponsor.incomeDetails;

        // If it's an ObjectId (populated failed or structure varying), fetch it
        // Note: .populate() usually returns null if not found or the doc if found.
        // If incomeDetails is null in sponsor doc, we can't credit.
        if (!incomeDetails) return;

        // If for some reason it wasn't populated (e.g. race condition), fetch by ID
        if (incomeDetails.constructor.name === 'ObjectId') {
            incomeDetails = await IncomeModel.findById(incomeDetails).session(session);
        }

        if (!incomeDetails) return;

        // Credit Bonus
        incomeDetails.referralIncome.income = (incomeDetails.referralIncome.income || 0) + bonus;
        incomeDetails.income.currentIncome = (incomeDetails.income.currentIncome || 0) + bonus;
        incomeDetails.income.totalIncome = (incomeDetails.income.totalIncome || 0) + bonus;

        // Create Commission Record
        const id = generateCustomId({ prefix: 'ZTD-REF', max: 14, min: 14 });

        // Prepare object
        const commissionData = {
            id,
            user: sponsor._id,
            fromUser: user._id,
            amount: amount, // invested amount
            income: bonus, // bonus received
            percentage: 0, // Flat bonus
            type: "Referral Income",
            status: "Completed",
            level: 1
        };

        let newCommission;
        if (session) {
            const created = await CommissionIncome.create([commissionData], { session });
            newCommission = created[0];
        } else {
            newCommission = new CommissionIncome(commissionData);
            await newCommission.save();
        }

        incomeDetails.referralIncome.history.push(newCommission._id);

        if (session) {
            await incomeDetails.save({ session });
        } else {
            await incomeDetails.save();
        }

        console.log(`✅ Referral Bonus of $${bonus} derived from $${amount} deposit credited to Sponsor ${sponsor.username}`);

    } catch (error) {
        console.error("Error distributing referral bonus:", error.message);
    }
};
