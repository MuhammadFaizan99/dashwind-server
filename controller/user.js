const { userModel } = require("../model/userSch");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Create a transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Replace with your Gmail email address
    pass: process.env.EMAIL_PASSWORD, // Replace with your Gmail password
  },
});

// Function to send verification code via email
const sendVerificationCode = async (email, code) => {
  try {
    // Email message
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Replace with your sender email and name
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${code}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const signUp = async (req, res) => {
  try {
    const { UserName, Email, Password } = req.body;

    // Generate a random verification code
    const verificationCode = generateVerificationCode();

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Save the user in the database with the verification code
    const user = new userModel({ UserName, Email, Password: hashedPassword, verificationCode });
    await user.save();

    // Send the verification code via email
    await sendVerificationCode(Email, verificationCode);

    res.json({ message: "Verification code sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

const signIn = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ Email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    // Check if the provided password matches the hashed password
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed. Invalid password." });
    }

    // Generate a random verification code
    const verificationCode = generateVerificationCode();

    // Update the user's verification code in the database
    user.verificationCode = verificationCode;
    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the new verification code via email
    await sendVerificationCode(Email, verificationCode);

    res.json({ token, message: "Verification code sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifySignUp = async (req, res) => {
  try {
    const { Email, verificationCode } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifySignIn = async (req, res) => {
  try {
    const { Email, verificationCode } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signUp, signIn, verifySignUp, verifySignIn };