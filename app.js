const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const routertransact = require('./routes/transaction');
const routeruser = require('./routes/user');
const connectDB = require('./config/db');
const authrouter = require('./routes/auth');
connectDB();

app.use(express.json()); 
app.use(cookieParser());

app.use('/api/v1', routertransact);
app.use('/api/v1', routeruser);
app.use('/api/v1', authrouter);
const PORT = process.env.PORT ;
app.listen(PORT, ()=> 
{
    console.log(`Server is running on http://localhost:${PORT}`);
}
);

