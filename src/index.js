// // import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import fs from "fs"; // Added to write to files
// import path from "path";
// import { fileURLToPath } from 'url';

// import loginRoutes from "./router/login.js";
// import dspRoutes from "./router/dsp.js";
// import logoutRouter from "./router/logout.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cookieParser());
// app.use(express.json()); 

// app.use(
//   cors({
//     origin: "http://localhost:3000", 
//     credentials: true,
//   })
// );

// app.get("/licensees", (req, res) => {
//     const dataPath = path.join(__dirname, "licenseeList.json");
//     if (fs.existsSync(dataPath)) {
//         const fileData = fs.readFileSync(dataPath, "utf-8");
//         res.json(JSON.parse(fileData));
//     } else {
//         res.json([]);
//     }
// });

// app.post("/licensees", (req, res) => {
//     const newEntry = req.body; 
//     const dataPath = path.join(__dirname, "licenseeList.json");

//     let currentData = [];
//     if (fs.existsSync(dataPath)) {
//         currentData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
//     }

//     currentData.push(newEntry);
    
//     fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    
//     res.status(201).json({ message: "Saved successfully", data: newEntry });
// });

// app.use("/login", loginRoutes);
// app.use("/dsp", dspRoutes);
// app.use("/logout", logoutRouter);

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

// --- START OF NEW LOGGING FUNCTIONALITY ---
const logsPath = path.join(__dirname, "activityLogs.json");

// Helper function to save logs (to be used by other routes)
export const saveLog = (logEntry) => {
    let logs = [];
    if (fs.existsSync(logsPath)) {
        try {
            logs = JSON.parse(fs.readFileSync(logsPath, "utf-8"));
        } catch (e) {
            logs = [];
        }
    }
    logs.unshift({
        id: Date.now(),
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
        ...logEntry
    });
    // Keep only the last 50 logs
    fs.writeFileSync(logsPath, JSON.stringify(logs.slice(0, 50), null, 2));
};

// GET Endpoint for the notification bell
app.get("/api/logs", (req, res) => {
    if (fs.existsSync(logsPath)) {
        const fileData = fs.readFileSync(logsPath, "utf-8");
        res.json(JSON.parse(fileData));
    } else {
        res.json([]);
    }
});
// --- END OF NEW LOGGING FUNCTIONALITY ---

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
    
    // Log the licensee creation
    saveLog({
        user: req.body.userName || "System",
        action: "Licensee Added",
        details: `Added ${newEntry.COMPANY || 'new licensee'}`
    });

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