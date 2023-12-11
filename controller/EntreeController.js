import Entrees from "../model/entree.js"; // Utilisez "Entree" au lieu de "Entrees"
import Products from "../model/addProduct.js";

export const getAllEntree = async (req, res) => {
  try {
    const allEntrees = await Entrees.find().populate("product");
    res.status(200).json({ entrees: allEntrees });
  } catch (error) {
    res.status(500).send(error);
  }
};

async function generateEntreeNumber() {
  const entreeCount = await Entrees.countDocuments(); // Utilisez "Entree" au lieu de "Entrees"
  const nextNumber = (entreeCount + 1).toString().padStart(5, "0");
  return `E${nextNumber}`;
}

export const saveEntree = async (req, res) => {
  try {
    const { product, quantite, prix } = req.body;

    if (isNaN(quantite) || isNaN(prix)) {
      return res.status(400).json({ error: "Données du formulaire invalides" });
    }

    const existingProduct = await Products.findById(product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }

    const soldeTotal = quantite * prix;
    const numeroEntree = await generateEntreeNumber();

    existingProduct.quantite += quantite;
    await existingProduct.save();

    const entree = new Entrees({
      numeroEntree,
      product,
      quantite,
      prix,
      soldeTotal,
      dateEntree: new Date(),
    });

    const savedEntree = await entree.save();

    res.status(201).json({ savedEntree });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement de l'entrée" });
  }
};

export const deleteEntree = async (req, res) => {
  try {
    const entree = await Entrees.findById(req.params.id);

    if (!entree) {
      return res.status(400).json({ error: "Entrée introuvable" });
    }

    const existingProduct = await Products.findById(entree.product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }
    
    existingProduct.quantite -= entree.quantite;
    await existingProduct.save();

    await Entrees.findByIdAndDelete(req.params.id);

    res.status(200).json({ entree });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateEntree = async (req, res) => {
  try {
    const { quantite, prix } = req.body;
    const dateEntree = new Date();

    const entree = await Entrees.findById(req.params.id);

    if (!entree) {
      return res.status(400).json({ error: "Entrée introuvable" });
    }

    const existingProduct = await Products.findById(entree.product);

    if (!existingProduct) {
      return res.status(400).json({ error: "Produit introuvable" });
    }

    const differenceQuantite = quantite - entree.quantite;

    existingProduct.quantite += differenceQuantite;
    await existingProduct.save();

    const soldeTotal = quantite * prix;

    entree.quantite = quantite;
    entree.prix = prix;
    entree.soldeTotal = soldeTotal;
    entree.dateEntree = dateEntree;

    const updatedEntree = await entree.save();

    res.status(200).json({ updatedEntree });
  } catch (error) {
    res.status(500).send(error);
  }
};
