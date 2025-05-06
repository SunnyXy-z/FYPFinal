const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const userModel = require("../models/user.js");
const { comparePassword,hashPassword } = require("../helpers/authHelper.js");

// ✅ Register New User
const registerController = async (req, res) => {
    try {
        const { username, email, password, contact } = req.body;

        if (!username || !email || !password || !contact) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // ✅ Fixed hash function

        const newUser = new userModel({ username, email, password: hashedPassword, contact });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "New user created",
            user: { username: newUser.username, email: newUser.email, contact: newUser.contact },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error in register callback", error: error.message });
    }
};

// ✅ Login & Get Token
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email is not registered" });
        }

        const isMatch = await comparePassword(password, user.password); // ✅ Fixed function call
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Generate token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // ✅ Securely store token in HttpOnly Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: { username: user.username, email: user.email, contact: user.contact , role:user.role},
            token,  
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error in login callback", error });
    }
};

// ✅ Protected Route Example
const testController = (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed successfully",
        user: req.user,

    });
};

// Update profile controller
const updateProfileController = async (req, res) => {
    try {
      const { username, email, password, contact } = req.body; // Match the field names
      const user = await userModel.findById(req.user._id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // Password validation
      if (password && password.length < 6) {
        return res.json({ error: "Password is required and must be at least 6 characters long" });
      }

      const hashedPassword = password ? await hashPassword(password) : undefined;

      // Update user details
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          username: username || user.username, // Change name to username
          email: email || user.email,
          password: hashedPassword || user.password,
          contact: contact || user.contact, // Change phone to contact
        },
        { new: true }
      );

      // Send updated user in the response
      res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while updating profile",
        error: error.message,
      });
    }
};


module.exports = { registerController, loginController, testController,updateProfileController };
