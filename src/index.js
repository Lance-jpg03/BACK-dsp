// import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs"; // Added to write to files
import path from "path";
import { fileURLToPath } from 'url';

import loginRoutes from "./router/login.js";
import dspRoutes from "./router/dsp.js";
import logoutRouter from "./router/logout.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json()); 

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.get("/licensees", (req, res) => {
    const dataPath = path.join(__dirname, "licenseeList.json");
    if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, "utf-8");
        res.json(JSON.parse(fileData));
    } else {
        res.json([]);
    }
});

app.post("/licensees", (req, res) => {
    const newEntry = req.body; 
    const dataPath = path.join(__dirname, "licenseeList.json");

    let currentData = [];
    if (fs.existsSync(dataPath)) {
        currentData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    }

    currentData.push(newEntry);
    
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    
    res.status(201).json({ message: "Saved successfully", data: newEntry });
});

app.use("/login", loginRoutes);
app.use("/dsp", dspRoutes);
app.use("/logout", logoutRouter);

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