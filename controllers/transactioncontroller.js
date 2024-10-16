
const mongoose = require('mongoose');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Type_Transaction = {
    deposit: 'deposit',
    withdrawal: 'withdraw'
};
exports.transcontroller = async (req, res) => {
    try {
        const { type, username, accNo, amount } = req.body;
        if (!type || amount === undefined || !username || !accNo) {
            return res.status(400).json({ message: "Please ensure you have all fields" });
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: "Enter a Valid Amount" });
        }
        if (!accNo || accNo.length !== 10) {
            return res.status(400).json({ message: "Enter a Valid Account Number" });
        }
        let user = await User.findOne({ accNo });
        if (!user) {
            return res.status(400).json({ message: "New Users are Not allowed to Withdraw or Deposit" });
        }
        let currentbalance = user.currentbalance;
        if (type === Type_Transaction.deposit) {
            currentbalance += amount;
        }
        else if (type === Type_Transaction.withdrawal) {
            if (currentbalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            } else {
                currentbalance -= amount;
            }
        } else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }
        user.currentbalance = currentbalance;
        await user.save();
        const transaction = new Transaction({
            user_id: user._id,
            type,
            amount,
            currentbalance: user.currentbalance,
            createdAt: new Date(),
            username,
            accNo
        });
        await transaction.save();
        res.status(200).json({ message: "Transaction successful", transaction });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};







