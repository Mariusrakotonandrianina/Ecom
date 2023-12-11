import express from "express";
import { getAllEntree, saveEntree, deleteEntree, updateEntree } from "../controller/EntreeController.js";


const entreeRouter = express.Router();

entreeRouter.post("/create", saveEntree);
entreeRouter.get("/entree", getAllEntree);
entreeRouter.delete("/deleteEntree/:id", deleteEntree);
entreeRouter.put("/updEntree/:id", updateEntree);

export default entreeRouter;
