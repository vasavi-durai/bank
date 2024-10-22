const mongoose = require('mongoose')


const authregisterSchema = new mongoose.Schema(
    {
        username:{type: String , required : true },
        accNo:{type: String, required : true, unique : true },
        password:{type: String, required : true},
        currentbalance:{type: Number, default: 0},
    }, {timestamps: true}
);
const Register = mongoose.model('authregister', authregisterSchema);
module.exports =  Register