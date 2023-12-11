import express from "express";
import { saveAdmin, fetchAdmins, deleteAdmin, updateAdminPassword, updateAdminInfo } from "../controller/authController.js";
import avatarUpload from "../middle/uploadAvatar.js";

const authRouter = express.Router();

authRouter.get("/admin", fetchAdmins);
authRouter.post("/save", avatarUpload, saveAdmin);
authRouter.delete("/delete/:id", deleteAdmin);
authRouter.put("/updPassword/:id", updateAdminPassword);
authRouter.put("/updInfoAdmin/:id", avatarUpload, updateAdminInfo);

export default authRouter;