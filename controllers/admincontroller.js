const Adlogin = require('../models/adminlog');
const Register = require('../models/authregister');
const Transaction = require('../models/transaction');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
///
exports.createAdmin = async (req, res) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;

    try {
        const existingAdmin = await Adlogin.findOne({ email });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Adlogin({
                email: email,
                password: hashedPassword,
            });
            await admin.save();
            console.log('Initial admin user created:', email);
            return res.status(201).json({ message: 'Admin user created.', email });
        } else {
            return res.status(400).json({ message: 'Admin user already exists.' });
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingAdmin = await Adlogin.findOne({ email });
        if (!existingAdmin) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ adminId: existingAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
            message: 'Login successful!',
            admin: {
                id: existingAdmin._id,
                email: existingAdmin.email,
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


