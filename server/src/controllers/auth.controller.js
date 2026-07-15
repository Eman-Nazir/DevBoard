import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAndSaveTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  await User.findByIdAndUpdate(userId, { refreshToken });
  return { accessToken, refreshToken };
};

// ─── Register ──────────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isSuperAdmin: false,
    createdAt: user.createdAt,
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(201, { user: userPayload, accessToken }, "Account created successfully"));
});

// ─── Login ─────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Select password AND isSuperAdmin — both have select:false on schema
  const user = await User.findOne({ email }).select("+password +isSuperAdmin");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isSuperAdmin: user.isSuperAdmin || false, // ← included in response
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user: userPayload, accessToken }, "Logged in successfully"));
});

// ─── Logout ────────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
  return res
    .status(200)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── Refresh Access Token ──────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "No refresh token — please log in");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user) throw new ApiError(401, "User no longer exists");

  if (user.refreshToken !== incomingRefreshToken) {
    await User.findByIdAndUpdate(user._id, { refreshToken: "" });
    throw new ApiError(401, "Refresh token reuse detected — please log in again");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

// ─── Get Current User ──────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // Re-fetch with isSuperAdmin to keep it consistent everywhere
  const user = await User.findById(req.user._id).select("+isSuperAdmin");
  if (!user) throw new ApiError(404, "User not found");

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isSuperAdmin: user.isSuperAdmin || false,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userPayload }, "User fetched successfully"));
});

// ─── Update Profile ────────────────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (name?.trim()) user.name = name.trim();

  if (req.file?.path) {
    if (user.avatar) await deleteFromCloudinary(user.avatar);
    const avatarUrl = await uploadToCloudinary(req.file.path, "devboard/avatars");
    if (avatarUrl) user.avatar = avatarUrl;
  }

  await user.save();

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isSuperAdmin: user.isSuperAdmin || false,
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userPayload }, "Profile updated successfully"));
});

// ─── Change Password ───────────────────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isCurrentPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isCurrentPasswordValid) throw new ApiError(400, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { register, login, logout, refreshAccessToken, getMe, updateProfile, changePassword };