import express from "express";
import {
  deleteProduit,
  getAllProduit,
  saveProduit,
  updateProduit,
  checkDeletable
} from "../controller/addProductController.js";
import imagesUpload from "../middle/upload.js";

const produitRouter = express.Router();

produitRouter.get("/produit", getAllProduit);
produitRouter.post("/create", imagesUpload, saveProduit);
produitRouter.delete("/del/:id", deleteProduit);
produitRouter.put("/upd/:id", imagesUpload, updateProduit);
produitRouter.get("/checkdeletable/:productId", checkDeletable);

export default produitRouter;
