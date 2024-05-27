 import Achats from "../model/achat.js";
import Products from "../model/addProduct.js";
import { checkStockAndTriggerAlert } from "../controller/EvaluationController.js";
import stripe from "stripe";

export const getAllAchat = async (req, res) => {
  try {
    const allAchats = await Achats.find().populate("product");
    res.status(200).json({ achats: allAchats });
  } catch (error) {
    res.status(500).send(error);
  }
};

async function generateAchatNumber() {
  const achatCount = await Achats.countDocuments();
  const nextNumber = (achatCount + 1).toString().padStart(5, "0");
  return `A${nextNumber}`;
}

export const saveAchat = async (req, res) => {
  try {
    const { nom, description, email, product, quantite, prix, paymentMethod } =
      req.body;
    const quantiteNum = parseInt(quantite);

    if (isNaN(quantiteNum) || isNaN(prix)) {
      return res.status(400).json({ error: "Données du formulaire invalides" });
    }

    const existingProduct = await Products.findById(product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }

    const soldeTotal = quantiteNum * prix;
    const numeroAchat = await generateAchatNumber();

    existingProduct.quantite -= quantiteNum;
    await existingProduct.save();

    const achat = new Achats({
      numeroAchat,
      nom,
      description,
      email,
      product,
      quantite: quantiteNum,
      prix,
      soldeTotal,
      paymentMethod,
      dateAchat: new Date(),
    });

    const savedAchat = await achat.save();

    res.status(201).json({ savedAchat });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement de l'entrée" });
  }
};

export const deleteAchat = async (req, res) => {
  try {
    const achat = await Achats.findById(req.params.id);
    if (!achat) {
      return res.status(400).json({ error: "Achat introuvable" });
    }

    const existingProduct = await Products.findById(achat.product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }

    existingProduct.quantite += achat.quantite;
    await existingProduct.save();

    await Achats.findByIdAndDelete(req.params.id);

    res.status(200).json({ achat });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateAchat = async (req, res) => {
  try {
    const { quantite, prix } = req.body;
    const dateAchat = new Date();

    const achat = await Achats.findById(req.params.id);

    if (!achat) {
      return res.status(400).json({ error: "Achat introuvable" });
    }

    const existingProduct = await Products.findById(achat.product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }

    const oldQuantite = achat.quantite;

    const differenceQuantite = quantite - oldQuantite;

    if (differenceQuantite > 0) {
      existingProduct.quantite -= differenceQuantite;
    } else if (differenceQuantite < 0) {
      if (existingProduct.quantite + differenceQuantite >= 0) {
        existingProduct.quantite -= differenceQuantite;
      } else {
        return res
          .status(400)
          .json({ error: "Quantité de produit insuffisante" });
      }
    }

    achat.quantite = quantite;
    achat.prix = prix;
    achat.dateAchat = dateAchat;

    const soldeTotal = quantite * prix;
    achat.soldeTotal = soldeTotal;

    await existingProduct.save();
    const updatedAchat = await achat.save();

    res.status(200).json({ updatedAchat });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const amountInCents = amount * 100;

    const stripe = req.app.locals.stripe;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "USD",
      payment_method: paymentMethod,
      confirmation_method: "manual",
      confirm: true,
      return_url: "http://localhost:3001/product/product",
    });

    const clientEmail = paymentIntent?.charges?.data[0]?.billing_details?.email;

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erreur lors du traitement du paiement" });
  }
};

export const getHistoriqueAchatsUtilisateur = async (req, res) => {
  try {
    const utilisateurConnecteEmail = req.query.email;

    const historiqueAchats = await Achats.find({ email: utilisateurConnecteEmail })
      .populate('product') 
      .sort({ dateAchat: -1 });

    res.status(200).json({ historiqueAchats });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des achats :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique des achats.' });
  }
};
