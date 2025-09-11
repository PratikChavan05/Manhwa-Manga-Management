import  express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import FormData from 'form-data';
dotenv.config();
const port=process.env.PORT || 5000;

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
  });

const app=express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());
app.use(cookieParser());


import userRoutes from './routes/userRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import healthRoutes from "./routes/health.js";



app.use('/api/user', userRoutes);       
app.use("/api/manga" , mangaRoutes);
app.use("/api/check", healthRoutes);

app.get("/api/proxy/cover", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url || !url.startsWith("https://uploads.mangadex.org/")) {
      return res.status(400).json({ error: "Invalid MangaDex URL" });
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch cover");

    res.set("Content-Type", response.headers.get("content-type"));
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).json({ error: "Image proxy failed" });
  }
});


app.use((req, res, next) => {
  console.log("Incoming request:", req.path);
  next();
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});



app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})