const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    username: { type: String, required: true, unique: true },
    accNo: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    currentbalance:Number,
});

const User = mongoose.model('User', userSchema);
module.exports = User;