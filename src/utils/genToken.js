import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const genToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export const clearCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
