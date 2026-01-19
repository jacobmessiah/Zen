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
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import axios from "axios";

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", userRoutes);
app.use("/api/connections", connectionRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

app.get("/cdn/file", async (req, res) => {
  const { path, mimeType, download } = req.query || {};

  if (!path || !mimeType) {
    return res.status(400).end();
  }

  try {
    const baseEndPoint = process.env.IMAGEKIT_CDN_SERVE_URL_ENDPOINT;
    const url = `${baseEndPoint}${path}`;

    // 1. Read the Range header from the browser
    const range = req.headers.range;

    // 2. Forward the Range header to ImageKit if it exists
    const axiosRes = await axios.get(url, {
      responseType: "stream",
      headers: range ? { Range: range } : {},
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // 3. Get headers from ImageKit response
    const contentLength = axiosRes.headers["content-length"];
    const contentRange = axiosRes.headers["content-range"];
    const lastModified = axiosRes.headers["last-modified"];
    const etag = axiosRes.headers["etag"];
    const cacheControl = axiosRes.headers["cache-control"];

    // 4. Set common headers
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Accept-Ranges", "bytes");

    if (lastModified) res.setHeader("Last-Modified", lastModified);
    if (etag) res.setHeader("ETag", etag);
    if (cacheControl) res.setHeader("Cache-Control", cacheControl);

    // 5. If browser requested a range, respond with 206 Partial Content
    if (range && contentRange) {
      res.status(206);
      res.setHeader("Content-Range", contentRange);
      if (contentLength) res.setHeader("Content-Length", contentLength);
    } else {
      // Full file
      if (contentLength) res.setHeader("Content-Length", contentLength);
    }

    // 6. Download vs inline
    if (download === "true") {
      const filename = path.toString().split("/").pop() || "download";
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    // 7. Pipe stream to client
    axiosRes.data.pipe(res);
  } catch (error) {
    console.error("CDN fetch error:", error.message);
    if (!res.headersSent) {
      res.status(404).end();
    }
  }
});

app.set("trust proxy", true);

ConnectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
