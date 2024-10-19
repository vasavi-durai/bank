const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    accNo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    currentbalance:{type: Number, required: true},
});

const User = mongoose.model('User', userSchema);
module.exports = User;