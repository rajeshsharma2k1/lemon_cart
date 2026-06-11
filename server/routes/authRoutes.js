const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
// router.post("/verify-email", verifyEmail); OTP verification route (to be implemented)

module.exports = router;