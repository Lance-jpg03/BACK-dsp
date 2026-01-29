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

import loginRoutes from "./router/login.js";
import dspRoutes from "./router/dsp.js";
import logoutRouter from "./router/logout.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);


app.use(express.json());

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