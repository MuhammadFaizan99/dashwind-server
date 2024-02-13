const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ message: "Authentication failed. Token missing." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the decoded user to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = { authenticateUser };