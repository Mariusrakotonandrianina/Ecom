import Products from "../model/addProduct.js";
import Entrees from "../model/entree.js";
import Achats from "../model/achat.js";

export const getAllProduit = async (req, res) => {
  try {
    const allProducts = await Products.find();
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).send(error);
  }
};

async function generateProductNumber() {
  const productCount = await Products.countDocuments();
  const nextNumber = (productCount + 1).toString().padStart(5, "0");
  return `P${nextNumber}`;
}

export const saveProduit = async (req, res) => {
  try {
    const { nom, quantite, prix, description } = req.body;
    const imageProduit = req.file.filename;

    const numeroProduit = await generateProductNumber();

    const newProduct = new Products({
      numeroProduit,
      nom,
      imageProduit,
      quantite,
      prix,
      description,
    });

    const savedProduct = await newProduct.save();

    res.status(200).json({ savedProduct });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteProduit = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const checkDeletable = async (req, res) => {
  try {
    const productId = req.params.productId;

    const hasEntries = await Entrees.exists({ product: productId });

    const hasPurchases = await Achats.exists({ product: productId });

    if (hasEntries || hasPurchases) {
      res.json({ deletable: false });
    } else {
      res.json({ deletable: true });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la suppression du produit :", error);
    res.status(500).json({ error: "Erreur lors de la vérification de la suppression du produit" });
  }
};

export const updateProduit = async (req, res) => {
  try {
    const { nom, quantite, prix, description } = req.body;

    const updateFields = {
      nom,
      quantite,
      prix,
      description,
    };
    if (req.file) {
      updateFields.imageProduit = req.file.filename;
    }

    const product = await Products.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).send(error);
  }
};
