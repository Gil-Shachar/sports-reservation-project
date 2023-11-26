//#region Configuration and Middleware

// Importing modules and setting up express app
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configuring middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

//#endregion Configuration and Middleware

//#region Route Handlers

// Importing and setting up route handlers
const signUpRoute = require('./routes/signup');
const logInRouter = require('./routes/login');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contact');
const orderRoute = require('./routes/order');
const myOrdersRoute = require('./routes/myorders');
const getAvailableGamesToJoinRoute = require('./routes/joinToOtherGame');

const myProfileRoute = require('./routes/myProfile');
const adminDashboard = require('./routes/adminDashboard');
const adminReports = require('./routes/adminReports');
const adminContacts = require('./routes/adminContacts');
const adminBlackList = require('./routes/adminBlackList');

// Defining route endpoints
app.use('/signup', signUpRoute);
app.use('/login', logInRouter);
app.use('/auth', authRoute);
app.use('/contact', contactRoute);
app.use('/order', orderRoute);
app.use('/myOrders', myOrdersRoute);
app.use('/get-available-games-to-join', getAvailableGamesToJoinRoute);
app.use('/myProfile', myProfileRoute);
app.use('/adminDashboard', adminDashboard);
app.use('/adminReports', adminReports);
app.use('/adminContacts', adminContacts);
app.use('/adminBlackList', adminBlackList);
//#endregion Route Handlers

app.listen(5000, () => {
  console.log('Server Started On PORT 5000!');
});
