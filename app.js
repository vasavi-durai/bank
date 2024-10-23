const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routertransact = require('./routes/transaction');
const routeruser = require('./routes/user');
const routeradmin = require('./routes/admin');
const authrouter = require('./routes/auth');
const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', routertransact);
app.use('/api/v1', routeruser);
app.use('/api/v1', authrouter);
app.use('/api/v2', routeradmin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
