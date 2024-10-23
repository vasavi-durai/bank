const Register = require('../models/authregister');
const Transaction = require('../models/transaction');

const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdraw',
};

exports.admintranscontroller = async (req, res) => {
    try {
        const { type, amount, accNo } = req.body;
        if (!type || !amount || !accNo) {
            return res.status(400).json({ message: 'Transaction type, amount, and account number are required.' });
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }
        let user = await Register.findOne({ accNo });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        let currentbalance = user.currentbalance || 0;
        if (type === TRANSACTION_TYPES.DEPOSIT) {
            currentbalance += amount;
        } else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
            if (currentbalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }
            currentbalance -= amount;
        } else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }
        user.currentbalance = currentbalance;
        await user.save();
        const transaction = new Transaction({
            user_id: user._id,
            type,
            amount,
            username: user.username,
            currentbalance: user.currentbalance,
            date: new Date(),
        });
        await transaction.save();
        res.status(200).json({
            message: type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!',
            transaction,
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


exports.adminhistorycontroller = async (req, res) => {
    try {
        const { accNo } = req.query;
        if (!accNo) {
            return res.status(400).json({ message: 'Please provide an account number.' });
        }
        let user = await Register.findOne({ accNo });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const userTransactions = await Transaction.find({ user_id: user._id });
        const updatedTransactions = userTransactions.map(transaction => ({
            date: transaction.date || transaction.createdAt,
            type: transaction.type,
            amount: transaction.amount,
            currentbalance: transaction.currentbalance,
        }));
        return res.status(200).json({
            success: true,
            data: {
                user,
                transactions: updatedTransactions,
            }
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
