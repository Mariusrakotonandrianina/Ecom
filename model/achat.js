import mongoose from "mongoose";

const AchatSchema = new mongoose.Schema({
  numeroAchat: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
  paymentMethod: {
    type: String,
    required: true,
  },
  dateAchat: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Achat", AchatSchema);
