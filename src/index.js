// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import loginRoutes from "./router/login";
// import dspRoutes from "./router/dsp";
// import logoutRouter from "./router/logout";


// const app = express();
// const PORT = process.env.PORT || 4000;

// // ✅ REQUIRED: parse cookies
// app.use(cookieParser());

// // ✅ REQUIRED: allow frontend to send & receive cookies
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Next.js frontend
//     credentials: true,
//   })
// );

// app.use(express.json());

// // routes
// app.use("/login", loginRoutes);
// app.use("/dsp", dspRoutes);

// app.get("/", (_req, res) => {
//   res.json({
//     service: "DSP API",
//     status: "running",
//     version: "1.0.0",
//   });
// });

// app.listen(PORT, () => {
//   console.log(`DSP Server running at http://localhost:${PORT}`);
// });

// app.use("/logout", logoutRouter);

// index.js (or server.js)
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Note: In Node.js ES Modules, you usually need the .js extension 
// unless your build tool (like Vite/Webpack) handles it for you.
import loginRoutes from "./router/login.js";
import dspRoutes from "./router/dsp.js";
import logoutRouter from "./router/logout.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware: parse cookies from headers
app.use(cookieParser());

// ✅ Middleware: allow frontend to send & receive cookies
// This is critical for the 'auth_token' cookie to work
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js/React URL
    credentials: true,
  })
);

// ✅ Middleware: parse incoming JSON bodies
app.use(express.json());

// Registering Routes
app.use("/login", loginRoutes);
app.use("/dsp", dspRoutes);
app.use("/logout", logoutRouter);

// Health Check Route
app.get("/", (_req, res) => {
  res.json({
    service: "DSP API",
    status: "running",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`DSP Server running at http://localhost:${PORT}`);
});