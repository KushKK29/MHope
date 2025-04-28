import express from "express";
import {
  login,
  signup,
  getAllUsers,
  deleteUser,
  updateUser,
  searchUsers,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/getusers", getAllUsers);
userRouter.post("/deleteuser", deleteUser);
userRouter.put(`/updateUser/:id`, updateUser);
userRouter.get("/search", searchUsers);

export default userRouter;
