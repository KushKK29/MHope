import express from "express";

import { createPatient, deletePatient, getAllPatients, updatePatient } from "../controllers/Patient.controller.js";

const patientRouter = express.Router();
patientRouter.post("/addPatient",createPatient);
patientRouter.get("/getAllPatients", getAllPatients);
patientRouter.post("/deletePatient/:id", deletePatient);
patientRouter.put(`/updatePatient/:id`, updatePatient);

export default patientRouter;
