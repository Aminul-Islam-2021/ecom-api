import Auth from "../models/authModel.js";
import { clearCookie, genToken } from "../utils/genToken.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }
    // Create new user
    const user = new Auth({
      username,
      email,
      password,
    });
    await user.save();
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User registration failed",
      });
    }
    genToken(res, user._id);
    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // Check if user exists
    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "This email doesn't exist. Please enter a valid email",
      });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Generate token and send response
    genToken(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    clearCookie(res);
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
