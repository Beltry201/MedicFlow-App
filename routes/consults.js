import { Router } from "express";
import {
  createConsult,
  generateJsonResponse,
  storeJsonData,
  // getConsultDetails,
  // getDoctorConsults,
  // updateConsult,
  // deactivateConsult,
} from "../controllers/consults.js";
import { validateToken } from "../helpers/jwt.js";

const router = Router();

// Routes
// router.post("/", validateToken, createConsult);
router.post("/", validateToken, storeJsonData);
router.get("/", validateToken, generateJsonResponse);

// router.get("/:id", validateToken, getConsultDetails);
// router.get("/doctor/:doctorId", validateToken, getDoctorConsults);
// router.put("/:id", validateToken, updateConsult);
// router.put("/deactivate/:id", validateToken, deactivateConsult);

export default router;