// server.js
import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { app, server } from "./lib/io.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectDB from "./lib/db.js";

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

const startServer = async () => {
  try {
    await ConnectDB(); //  Mongo first

    //   import  route files
    const userRoute = (await import("./route/userRoute.js")).default;
    const profileRoute = (await import("./route/profileRoute.js")).default;
    const friendRoute = (await import("./route/friendRoutes.js")).default;
    const MessageRoute = (await import("./route/MessageRoute.js")).default;
    const StatusRoute = (await import("./route/StatusRoute.js")).default;
    const ConversationRoute = (await import("./route/ConversationRoute.js"))
      .default;

    //  Mount my routes AFTER DB is ready
    app.use("/api/users", userRoute);
    app.use("/api/profile", profileRoute);
    app.use("/api/friends", friendRoute);
    app.use("/api/conversations", ConversationRoute);
    app.use("/api/messages", MessageRoute);
    app.use("/api/status", StatusRoute);

    //  Start my server
    server.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();
