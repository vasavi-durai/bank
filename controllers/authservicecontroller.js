const Register = require('../models/authregister');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
    try {
        const { username, accNo, password } = req.body;
        if (!password || !username || !accNo) {
            return res.status(400).json({ message: 'Please Ensure username, account number, password' });
        }
        const alreadyRegistered = await Register.findOne({ accNo });
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already Registered User' });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newReg = new Register({
            username, 
            accNo,       
            password: hashedPass,
            currentbalance: 0 
        });
        await newReg.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration', error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { accNo, password } = req.body;
        if (!accNo || !password) {
            return res.status(400).json({ message: 'Please provide account number and password' });
        }
        const reg = await Register.findOne({ accNo });
        if (!reg) {
            return res.status(400).json({ message: 'User not registered yet' });
        }
        const isMatch = await bcrypt.compare(password, reg.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password does not match' });
        }
        const token = jwt.sign({ userId: reg._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
        });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
    }
};
