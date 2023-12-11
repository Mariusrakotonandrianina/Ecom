import express from "express";
import passport from 'passport';
import { registerInfoUser,
         getAllInfoUser,
         deleteInfoUser,
         updateInfoUser,
         login,
         isAuthenticated,
 } from "../controller/signinController.js";
 import { ensureAuthenticated } from "../middle/auth.js";

const signinRouter = express.Router();
signinRouter.use(express.json());
signinRouter.use(express.urlencoded({ extended: true }));

signinRouter.post('/register', registerInfoUser);
signinRouter.post('/login', passport.authenticate('local'), login);
signinRouter.get('/infoUsers', getAllInfoUser);
signinRouter.delete("/delInfoUsers/:id", deleteInfoUser);
signinRouter.put("/updInfoUsers/:id", updateInfoUser);

export default signinRouter;
