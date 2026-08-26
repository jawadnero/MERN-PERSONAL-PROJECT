const userModel = require("../models/auth.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../services/sendEmail.service")



const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires after 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "User registration failed",
      });
    }

    // Email message
    const message = `
Welcome to ShopNest, ${username}.

Your OTP for ShopNest registration is: ${otp}

This OTP will expire in 10 minutes.
`;

    // Send OTP email
    await sendEmail(
      email,
      "Welcome to ShopNest - Your OTP",
      message
    );

    // IMPORTANT:
    // Registration ke waqt JWT generate nahi karna.
    // Pehle OTP verify hoga.

    return res.status(201).json({
      message: "Registration successful. Please verify your email with the OTP.",
      _id: user._id,
      name: user.username,
      email: user.email,
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};


const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try{
        const user = await userModel.findOne({ email });
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token,);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users"
        });
    }
};

const verifyPost = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check email and OTP
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Verify user
    user.isVerified = true;

    // Remove OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Generate JWT AFTER verification
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set JWT cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    // Response
    return res.status(200).json({
      message: "Email verified successfully",
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);

    return res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, getUsers, verifyPost};