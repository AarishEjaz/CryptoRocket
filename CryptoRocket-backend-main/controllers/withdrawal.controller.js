const { UserModel } = require("../models/user.model");
const { IncomeModel } = require("../models/income.model");
const { getOtpGenerate } = require("../utils/getOtpGenerate");
const { sendToOtp } = require("../utils/sendtootp.nodemailer");

/**
 * Generate and send OTP for withdrawal
 */
exports.getOtpForWithdrawal = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Generate OTP
    const otp = getOtpGenerate();
    
    // Store OTP in user document with expiry (5 minutes)
    user.withdrawalOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    };
    
    await user.save();

    // Send OTP via email
    try {
      await sendToOtp({
        email: user.email,
        otp: otp,
        subject: "Withdrawal OTP - Zeptodefi",
        message: `Your withdrawal OTP is: ${otp}. This OTP will expire in 5 minutes.`
      });

      res.status(200).json({
        success: true,
        message: "OTP sent successfully to your registered email address"
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again."
      });
    }
  } catch (error) {
    console.error("getOtpForWithdrawal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Process withdrawal request without OTP verification
 */
exports.withdrawalRequest = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;

    // Validate input
    if (!amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Amount and wallet address are required"
      });
    }

    // Forward to the main withdrawal function in transaction controller
    const transactionController = require("./transaction.controller");
    
    return await transactionController.WalletWithdrawalRequest(req, res);

  } catch (error) {
    console.error("withdrawalRequest Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};