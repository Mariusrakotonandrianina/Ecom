/*import Produit from "../model/Product.js";
import Product from "../model/addProduct.js";

export const getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await Product.find();
    res.status(200).json({ getAllProduct });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const saveProduct = async (req, res) => {
  try {
    const { NomProd, Description, Price, avatar, Stock } = req.body;

    const newProduit = new Produit({
      NomProd,
      Description,
      Price,
      avatar,
      Stock,
    });
    //ajout image
    if (req.file) {
      newProduit.avatar = req.file.path;
    } else {
      console.log(error);
    }

    const saveProduit = await newProduit.save();
    res.status(200).json({ saveProduct });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    res.status(200).json({ produit });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    //ajout image
    if (req.file) {
      produit.avatar = req.file.path;
    } else {
      console.log(error);
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).send(error);
  }
};
*/