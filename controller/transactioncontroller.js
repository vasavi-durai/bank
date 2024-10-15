const Transaction = require('../models/Transaction');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');

exports.getUserByAccno = [
    body('accno').isNumeric().withMessage('Account number must be numeric.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { accno } = req.body;
            const user = await User.findOne({ accno });

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const userTransactions = await Transaction.find({ accno });

            res.status(200).json({
                success: true,
                data: {
                    username: user.username,
                    accno: user.accno,
                    currentbalance: user.currentbalance,
                    type:user.type,
                    transactions: user,
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
];

