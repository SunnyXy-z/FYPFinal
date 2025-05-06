const express = require('express');
const { registerController, loginController, testController,updateProfileController } = require('../UserController/controller');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware'); // Import middlewares

const router = express.Router();

// Register route
router.post('/register', registerController);

// Login route
router.post('/login', loginController);

// Test route (only accessible by authenticated admin users)
router.get('/test', requireSignIn, isAdmin, testController);

// User authentication check (only checks if user is signed in)
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// Admin authentication check (checks if user is an admin)
// ✅ This allows only admins
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({ ok: true });
});
//update profile
router.put("/profile", requireSignIn, updateProfileController);


module.exports = router;
