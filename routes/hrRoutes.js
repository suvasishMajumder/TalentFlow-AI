import { Router } from "express";
import {
  createHrData,
  deleteHrRecord,
  getAllHrData,
  getHrDataById,
  updateHrdata,
} from "../controllers/hrControllers.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";
import {
  recruitmentApplicantCreateSchema,
  recruitmentApplicantPatchSchema,
} from "../validator/validator.js";

const router = Router();


//API tested
router.get(
  "/getallhrdata",
  authorizeRole("hr", "admin", "manager"),
  getAllHrData,
);


//API tested
router.get(
  "/gethrdata/:id",
  authorizeRole("hr", "admin", "manager"),
  getHrDataById,
);



//API tested
router.patch(
  "/updatehrdata/:id",
  authorizeRole("hr", "admin", "manager"),
  validationMiddleware(recruitmentApplicantPatchSchema),
  updateHrdata,
);


//API tested
router.delete(
  "/deletesinglehrrecord/:id",
  authorizeRole("hr", "admin", "manager"),
  deleteHrRecord,
);


//API tested
router.post(
  "/createhrdata",
  authorizeRole("hr", "admin", "manager"),
  validationMiddleware(recruitmentApplicantCreateSchema),
  createHrData,
);

export default router;
