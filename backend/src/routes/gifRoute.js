import axios, { isAxiosError } from "axios";
import { Router } from "express";

const GifRoute = Router();

GifRoute.get("/trending", async (req, res) => {});

GifRoute.get("/search/:query/:lang", async (req, res) => {
  try {
    const { query, lang = "en" } = req.params || {};

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "INVALID_QUERY" });
    }

    const searchRes = await axios.get(process.env.GIPHY_SEARCH_ENDPOINT, {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q: query,
        limit: 50,
        bundle: "messaging_non_clips",
        lang,
        fields: "id,images",
      },
    });

    const gifData = searchRes.data.data || [];

    const filtered = gifData.map((gif) => ({
      id: gif.id,
      preview: gif.images.fixed_width.mp4,
      full: gif.images.downsized_medium?.url || gif.images.original.mp4,
      width: parseInt(gif.images.fixed_width.width),
      height: parseInt(gif.images.fixed_width.height),
    }));

    return res.status(200).json({
      message: filtered.length > 0 ? "SUCCESS" : "NO_RESULTS",
      data: filtered, // Empty array if no results
    });
  } catch (error) {
    console.error("GIF search error:", error);
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
});

export default GifRoute;
