const Register = require('../models/authregister');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, accNo, password } = req.body;
        if (!password || !username || !accNo) {
            return res.status(400).json({ message: 'Please provide username, account number, and password' });
        }
        const existingUser = await User.findOne({ accNo });
        if (!existingUser) {
            return res.status(400).json({ message: 'Only pre-existing users can register' });
        }
        const alreadyRegistered = await Register.findOne({ accNo });
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'User is already registered' });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newReg = new Register({
            username: existingUser.username, 
            accNo: existingUser.accNo,       
            password: hashedPass
        });
        await newReg.save();
        res.status(201).json({ message: 'User registered successfully' });
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
        const existingUser = await User.findOne({ accNo });
        if (!existingUser) {
            return res.status(400).json({ message: 'Only pre-existing users can log in' });
        }
        const reg = await Register.findOne({ accNo });
        if (!reg) {
            return res.status(400).json({ message: 'User not registered yet' });
        }
        const isMatch = await bcrypt.compare(password, reg.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password does not match' });
        }
        const token = jwt.sign({ username: reg.username }, 'verysecretvalue', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
    }
};
