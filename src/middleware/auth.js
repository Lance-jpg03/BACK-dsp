// // middleware/auth.ts
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   user?: any;
// }

// export const authenticateToken = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token =
//     req.cookies?.auth_token ||
//     req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET as string, (err: Error | null, user: any) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token" });
//     }

//     req.user = user;
//     next();
//   });
// };

// middleware/auth.js
const jwt = require("jsonwebtoken");

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.auth_token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};