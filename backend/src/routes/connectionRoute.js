import { Router } from "express";
import { HandleNewConnection } from "../controller/connectionController.js";
import ProtectRoute from "../middleware/protectUser.js";

const connectionRoute = Router();

connectionRoute.post("/new", ProtectRoute, HandleNewConnection);


export default connectionRoute