import bcrypt from "bcrypt";
import InfoUsers from "../model/signin.js";
import jwt from "jsonwebtoken";
import { generateToken } from '../middle/auth.js';

const jwtSecretKey = "rakotonandrianina";

export const getAllInfoUser = async (req, res) => {
  try {
    const allInfoUsers = await InfoUsers.find();
    res.status(200).json({ allInfoUsers });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const registerInfoUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingInfoUser = await InfoUsers.findOne({ email });

    if (existingInfoUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newInfoUser = new InfoUsers({ name, email, password: hashedPassword });

    await newInfoUser.save();
    const token = generateToken(newInfoUser);

    res.status(201).json({ message: 'Inscription réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
  }
};

export const deleteInfoUser = async (req, res) => {
  try {
    const infoUser = await InfoUsers.findByIdAndDelete(req.params.id);
    res.status(200).json({ infoUser });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
export const updateInfoUser = async (req, res) => {
  try {
    const infoUser = await InfoUsers.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.newName,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ infoUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const login = (req, res) => {
  const token = generateToken(req.user);

  res.status(200).json({ message: 'Connexion réussie', token });
};

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token non valide" });
  }
};