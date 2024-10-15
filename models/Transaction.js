const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    currentbalance : Number,
    accNo: { type: String, required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    createdAt: { type: Date, default: Date.now },
}
);
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;