const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.getByaccNo = async (req, res) => {
    try {
        const { accNo, username } = req.query;
        if (!accNo && !username) {
            return res.status(400).json({ message: 'Please provide either an account number or a username.' });
        }
        let user;
        if (accNo) {

            user = await User.findOne({ accNo });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const userTransactions = await Transaction.find({ user_id: user._id });

            const updatedTransactions = [];
            userTransactions.forEach(transaction => {
                updatedTransactions.push({
                    dateTime: transaction.dateTime,
                    type: transaction.type,
                    amount: transaction.amount,
                    currentbalance: transaction.currentbalance,
                    date:transaction.date
                });
            });
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    transactions: updatedTransactions,
                }
            });
        }
        if (username) {
            if (!isNaN(username)) {
                return res.status(400).json({ message: 'Username must contain only alphabets.' });
            }

            user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({
                success: true,
                data: {
                    username: user.username,
                    accNo: user.accNo,
                    currentbalance: user.currentbalance,
                }
            });
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
