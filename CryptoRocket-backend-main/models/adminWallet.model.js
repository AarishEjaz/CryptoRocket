const mongoose = require('mongoose');

const adminWalletSchema = new mongoose.Schema({
    id: {
        type: String,
        default: null
    },
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    totalCommission: {
        type: Number,
        default: 0
    },
    distributedAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    eligibleUsers: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'SINGLE_LEG_COMMISSION'
    },
    status: {
        type: String,
        default: 'Completed'
    },
    remark: {
        type: String,
        default: ''
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true, versionKey: false });

exports.AdminWallet = mongoose.model('AdminWallet', adminWalletSchema);
