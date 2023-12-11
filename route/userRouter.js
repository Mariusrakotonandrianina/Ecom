import express, { Router } from "express";
import {
  getAllUser,
  saveUser,
  deleteUser,
  updateUser,
} from "../controller/userController.js";
import uploadAvatar from "../middleware/multerAvatar.js";

const userRouter = express.Router();

userRouter.get("/client", getAllUser);
userRouter.post("/save", uploadAvatar, saveUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.patch("/update/:id", uploadAvatar, updateUser);

export default userRouter;
