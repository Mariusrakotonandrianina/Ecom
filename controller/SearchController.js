import Product from "../model/addProduct.js";
import Info from "../model/signin.js";
import Achat from "../model/achat.js";
import Entree from "../model/entree.js";

const loadProductName = async (productId) => {
  try {
    const product = await Product.findById(productId).exec();
    if (product) {
      return product.nom;
    } else {
      return "Nom de produit non trouvé";
    }
  } catch (error) {
    console.error("Erreur lors du chargement du nom du produit :", error);
    return "Erreur de chargement du nom du produit";
  }
};

const loadProductDescription = async (productId) => {
  try {
    const product = await Product.findById(productId).exec();
    if (product) {
      return product.description;
    } else {
      return "Description de produit non trouvée";
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la description du produit :", error);
    return "Erreur de chargement de la description du produit";
  }
};

export const searchController = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    const productResults = await Product.find({
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { numeroProduit: { $regex: "^P" + searchQuery, $options: "i" } },
      ],
    });

    const userResults = await Info.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const achatResults = await Achat.find({
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { numeroAchat: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const entreeResults = await Entree.find({
      $or: [
        { numeroEntree: { $regex: searchQuery, $options: "i" } },
        { nom: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { "product.nom": { $regex: searchQuery, $options: "i" } },
        { "product.description": { $regex: searchQuery, $options: "i" } },
      ],
    });

    const entreeResultsWithProductInfo = await Promise.all(
      entreeResults.map(async (entree) => {
        const nomProduit = await loadProductName(entree.product);
        const descriptionProduit = await loadProductDescription(entree.product);
        return {
          ...entree.toObject(),
          nomProduit,
          descriptionProduit,
        };
      })
    );

    res
      .status(200)
      .json({ productResults, userResults, achatResults, entreeResults: entreeResultsWithProductInfo });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." });
  }
};

