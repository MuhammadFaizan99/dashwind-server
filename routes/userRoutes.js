const express = require("express");
const userRouter = express.Router();
const { signUp, signIn, verifySignUp, verifySignIn } = require("../controller/user.js");

// User registration route
userRouter.post("/signUp", signUp);

// User sign-in route
userRouter.post("/signIn", signIn);

// Verify user registration route
userRouter.post("/verifySignUp", verifySignUp);

// Verify user sign-in route
userRouter.post("/verifySignIn", verifySignIn);

module.exports = { userRouter };