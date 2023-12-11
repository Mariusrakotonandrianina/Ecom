import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import expressSession from "express-session";
import stripePackage from "stripe";
import { ensureAuthenticated } from './middle/auth.js';

import produitRouter from "./route/produitRouter.js";
import signinRouter from "./route/signinRouter.js";
import achatRouter from "./route/achatRouter.js";
import entreeRouter from "./route/entreeRouter.js";
import searchRouter from "./route/searchRouter.js";
import authRouter from "./route/auth.js";
import userRouter from "./route/userRouter.js";

const app = express();
const stripe = stripePackage("sk_test_51NxFJkCLci3B102StaLn2SbhOS9ON0znomS2f963a6pPoWDrTfexqeGEdmLRN17qciYEb78x330Tzo291fDkS2Kr00Hzxa6Cqt");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/DatabaseProjet");
    console.log("connected");
  } catch (err) {
    throw err;
  }
};

app.use(cors());
app.use(express.json());
app.locals.stripe = stripe;

app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "rakotonandrianina",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(ensureAuthenticated);

app.use("/api/produit", produitRouter);
app.use("/api/infoUser", signinRouter);

app.use("/api/achat", achatRouter);
app.use("/api/entree", entreeRouter);
app.use("/api/recherche", searchRouter);
app.use("/api/admin", authRouter);
app.use("/api/client", userRouter);

app.get("/", (req, res) => {
  res.send("hello mf!");
});

app.listen(5000, () => {
  connect();
  console.log(`Le serveur est connecté à https://localhost:5000`);
});
