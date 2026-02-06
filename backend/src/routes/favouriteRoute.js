import { Router } from "express";
import ProtectRoute from "../middleware/protectUser.js";
import { handleAddGifToFavourites } from "../controller/favouritesController.js";

const favouritesRoute = Router();

favouritesRoute.post("/gifs", ProtectRoute, handleAddGifToFavourites);

export default favouritesRoute;
