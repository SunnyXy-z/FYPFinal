const JWT = require('jsonwebtoken');
const userModel = require('../models/user'); // Ensure the correct path to your User model

// Require SignIn Middleware
const jwt = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// Admin Access Middleware
const isAdmin = async (req, res, next) => {
    try {
        // Retrieve the user using the ID from the JWT token
        const user = await userModel.findById(req.user._id);

        // If user not found or role is not admin (role === 1), send an error response
        if (!user || user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes

        // Send an error response if something goes wrong in the try block
        res.status(401).send({
            success: false,
            message: 'Error in admin middleware',
            error: error.message  // Optional: send the error message for debugging
        });
    }
};



module.exports = { requireSignIn, isAdmin };
