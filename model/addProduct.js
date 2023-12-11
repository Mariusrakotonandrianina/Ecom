import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  numeroProduit: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  imageProduit: {
    type: String,
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
  description: {
    type: String,
    required: true,
  },
  entrees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entree" }],
  achats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achat" }],
});


ProductSchema.pre('save', async function (next) {
  if (this.isModified('quantite') && this.quantite < 0) {
    throw new Error("La quantité ne peut pas devenir négative.");
  }
  next();
});

export default mongoose.model("Product", ProductSchema);
