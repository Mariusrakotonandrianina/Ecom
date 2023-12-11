import express from "express";
import { searchController } from "../controller/SearchController.js";

const searchRouter = express.Router();

searchRouter.get("/recherche", searchController);
export default searchRouter;