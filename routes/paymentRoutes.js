const express = require('express');
const paymentRouter = express.Router();
const {createPaymentIntent} = require("../controller/payment")


paymentRouter.post('/process-payment',createPaymentIntent );

module.exports = {paymentRouter};