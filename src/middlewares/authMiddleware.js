import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

export const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Auth.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      return res.status(401);
      throw new Error("Not Authorised,Invalid Token");
    }
  } else {
    return res.status(401);
    throw new Error("Not Authorised,No Token");
  }
};

