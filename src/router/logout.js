// import express, { Request, Response } from "express";

// const router = express.Router();

// router.post("/", (_req: Request, res: Response) => {
//   res.clearCookie("auth_token", {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// });

// export default router;

// src/router/logout.js
import express from "express";

const router = express.Router();

router.post("/", (_req, res) => {
  // We clear the cookie by name
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    // Must match the same settings used when the cookie was created
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;