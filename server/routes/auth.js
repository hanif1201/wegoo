// routes/auth.js
const express = require("express");
const {
  registerUser,
  loginUser,
  registerRider,
  loginRider,
} = require("../controllers/authController");

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/rider/register", registerRider);
router.post("/rider/login", loginRider);

module.exports = router;
