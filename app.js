const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const indexRouter = require('./src/routes/index');
const invoiceRouter = require('./src/routes/invoice');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/health-check', indexRouter);
app.use('/invoice', invoiceRouter);

module.exports = app;
