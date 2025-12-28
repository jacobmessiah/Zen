// server.js
import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { app, server } from "./lib/io.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import ConnectDB from "./lib/db.js";
import connectionRoute from "./routes/connectionRoute.js";

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", userRoutes);
app.use("/api/connections", connectionRoute);

app.set("trust proxy", true);

ConnectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
