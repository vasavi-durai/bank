const User = require('../models/Users');

const TRANSACTION_TYPES = {
    DEPOSIT: 1,
    WITHDRAWAL: 0
};

exports.ucontroller = async (req, res) => {
    try {
        const { type, username, accno, amount } = req.body;

        if (type === undefined || !username || !accno || amount === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        const date = new Date();
        let user = await User.findOne({ accno });

        if (!user) {
            user = new User({
                type,
                username,
                accno,
                date,
                currentbalance: type === TRANSACTION_TYPES.DEPOSIT ? amount : 0
            });
            await user.save();
            return res.status(201).json({ message: 'User created successfully!', user });
        }

        if (type === TRANSACTION_TYPES.DEPOSIT) {
            user.currentbalance += amount;
            user.type = type;
        } else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
            if (user.currentbalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }
            user.currentbalance -= amount;
            user.type = type;
        } else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }

        user.date = date;
        await user.save();

        res.status(200).json({ message: type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};