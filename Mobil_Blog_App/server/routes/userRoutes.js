const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSingIn,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.put("/update-user", requireSingIn, updateUserController);

module.exports = router;
