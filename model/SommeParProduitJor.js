import mongoose from "mongoose";

const SommeParProduitSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  description: String,
  total: Number,
  quantiteTotal: Number,

});

export default mongoose.model("SommePproduit", SommeParProduitSchema);
