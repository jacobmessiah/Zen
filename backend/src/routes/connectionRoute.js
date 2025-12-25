import { Router } from "express";
import { HandleNewConnection } from "../controller/connectionController";
import ProtectRoute from "../middleware/protectUser";

const connectionRoute = Router();

connectionRoute.post("/new", ProtectRoute, HandleNewConnection);
