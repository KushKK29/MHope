import express from "express";
import {
  getAllDoctors,
  deleteDoctor,
  updateDoctor,
  createDoctor,
} from "../controllers/doctor.controller.js";
const doctorRouter = express.Router();
doctorRouter.post("/addDoctor",createDoctor);
doctorRouter.get("/getAllDoctors", getAllDoctors);
doctorRouter.post("/deleteDoctor/:id", deleteDoctor);
doctorRouter.put(`/updateDoctor/:id`, updateDoctor);

export default doctorRouter;
