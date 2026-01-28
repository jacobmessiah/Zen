import axios, { isAxiosError } from "axios";
import { Router } from "express";

const GifRoute = Router();

GifRoute.get("/trending", async (req, res) => {});

GifRoute.get("/search/:query/:lang", async (req, res) => {
  try {
    const { query, lang = "en" } = req.params || {};

    if (!query) return res.status(500).json({ message: "NO_PARAMS" });
    if (typeof query !== "string")
      return res.status(400).json({ message: "INVALID_PARAM" });

    const searchRes = await axios.get(process.env.GIPHY_SEARCH_ENDPOINT, {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q: query,
        limit: 40,
        bundle: "messaging_non_clips",
        lang,
        fields: "id,images",
      },
    });

    const resData = searchRes.data;
    const gifData = resData.data;

    if (Array.isArray(gifData) && gifData.length > 0) {
      const filtered = gifData.map((gif) => ({
        id: gif.id,
        preview: gif.images.fixed_height.mp4,
        full: gif.images.original.mp4,
        width: gif.images.fixed_height.width,
        height: gif.images.fixed_height.height,
      }));

      return res.status(200).json({ message: "Data Received", Data: filtered });
    } else {
      return res.status(500).json({ message: "NO_DATA_RECEIVED", Data: [] });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("Error From Fetching Error Res -->  ", error.response.data);
    }

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
});



export default GifRoute;
