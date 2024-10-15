const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
 const transactionRouter = require('./routes/transaction');
const userRouter = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
 
app.use(bodyParser.json());

 app.use('/api/transact', transactionRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});