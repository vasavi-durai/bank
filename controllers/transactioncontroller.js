const jwt = require('jsonwebtoken');
const Register = require('../models/authregister');
const Transaction = require('../models/transaction');
const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdraw',
};
exports.transcontroller = async (req, res) => {
    try {
        const token = 
            (req.cookies && req.cookies.token) || 
            (req.headers['authentication'] ? req.headers['authentication'].split(' ')[1] : null);
        if (!token) {
            return res.status(401).json({ message: 'Authorisation token is required.' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not defined.');
        }
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token.', error: err.message });
        }
        const user = await Register.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid user.' });
        }
        const { type, amount } = req.body;
        if (!type || !amount) {
            return res.status(400).json({ message: 'Transaction type and amount are required.' });
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
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
