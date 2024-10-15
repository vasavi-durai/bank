const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB,{
            useNewUrlParser: true,
            useunifiedTopology:true});
        console.log('MongoDB connected');
    }
        catch(error){
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    };
    module.exports = connectDB;