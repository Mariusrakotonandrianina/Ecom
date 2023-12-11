import mongoose from "mongoose";
import Product from "./addProduct.js";

const EntreeSchema = new mongoose.Schema({
  numeroEntree: {
    type: String,
    required: true,
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: "La quantité ne peut pas être négative.",
    },
  },
  prix: {
    type: Number,
    required: true,
  },
  soldeTotal: {
    type: Number,
    required: true,
  },
  dateEntree: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Entree", EntreeSchema);
