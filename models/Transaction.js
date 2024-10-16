const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    currentbalance : {type: Number, required: true},
    accNo: { type: String, required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    createdAt: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    
}
);
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

