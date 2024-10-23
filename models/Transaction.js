const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    username:String,
    currentbalance: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
