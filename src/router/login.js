// // src/router/login.ts
// import express, { Request, Response } from "express";
// import sql, { config as SQLConfig } from "mssql";
// import jwt from "jsonwebtoken";
// import { env } from "process";

// const router = express.Router();

// router.post("/", async (req: Request, res: Response) => {
//   const { username, password } = req.body as {
//     username?: string;
//     password?: string;
//   };

//   if (!username || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Username and password required",
//     });
//   }

//   const config: SQLConfig = {
//     user: username,
//     password,
//     server: env.SQL_SERVER || "10.10.0.14",
//     database: env.SQL_DATABASE || "PROJECT_LEGO",
//     options: {
//       encrypt: false,
//       trustServerCertificate: true,
//     },
//     pool: {
//       max: 10,
//       min: 0,
//       idleTimeoutMillis: 30000,
//     },
//   };

//   let pool: sql.ConnectionPool | null = null;

//   try {
//     pool = await sql.connect(config);

//     const roleResult = await pool
//       .request()
//       .input("username", sql.VarChar, username)
//       .query(`
//         SELECT roleFlag
//         FROM DSP_access
//         WHERE username = @username
//       `);

//     if (roleResult.recordset.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: "No DSP access assigned",
//       });
//     }

//     const roleFlag: number = roleResult.recordset[0].roleFlag;

//     const token = jwt.sign(
//       { username, roleFlag },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );

//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 1000,
//     });

//     return res.json({
//       success: true,
//       username,
//       roleFlag,
//     });
//   } catch (err: any) {
//     console.error("Login error:", err?.message || err);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid SQL credentials",
//     });
//   } finally {
//     if (pool) {
//       try {
//         await pool.close();
//       } catch {}
//     }
//   }
// });

// export default router;

// src/router/login.js
import express from "express";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { env } from "process";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password required",
    });
  }

  // No need for 'SQLConfig' type here
  const config = {
    user: username,
    password: password,
    server: env.SQL_SERVER || "10.10.0.14",
    database: env.SQL_DATABASE || "PROJECT_LEGO",
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  let pool = null;

  try {
    // Attempt to connect to SQL Server using the provided credentials
    pool = await sql.connect(config);

    const roleResult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query(`
        SELECT roleFlag
        FROM DSP_access
        WHERE username = @username
      `);

    if (roleResult.recordset.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No DSP access assigned",
      });
    }

    const roleFlag = roleResult.recordset[0].roleFlag;

    // Generate the JWT
    const token = jwt.sign(
      { username, roleFlag },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      success: true,
      username,
      roleFlag,
    });
  } catch (err) {
    console.error("Login error:", err?.message || err);

    return res.status(401).json({
      success: false,
      message: "Invalid SQL credentials",
    });
  } finally {
    // Crucial: Close the pool so you don't leak connections
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        // Silently fail on close
      }
    }
  }
});

export default router;