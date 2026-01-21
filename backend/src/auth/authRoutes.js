import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // Code block to check if user already exists

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const existingUsername = await User.findOne({ username }); 
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Get profile image 
    const profileImg =`https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${username}`

    const user = new User({
      email,
      username,
      password,
      profileImg,
    })
  } catch (error) {}
});
router.post("/login", async (req, res) => {
  res.send("Login");
});

export default router;
