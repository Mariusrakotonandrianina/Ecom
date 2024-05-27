import express, { Router } from "express";
import {
  getAllUser,
  saveUser,
  deleteUser,
  updateUser,
  updateUserPassword,
} from "../controller/userController.js";
import uploadAvatar from "../middleware/multerAvatar.js";

const userRouter = express.Router();

userRouter.get("/client", getAllUser);
userRouter.post("/save", uploadAvatar, saveUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.put("/update/:id", uploadAvatar, updateUser);
userRouter.put("/updPwd/:id", updateUserPassword);

export default userRouter;
