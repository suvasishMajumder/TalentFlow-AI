import { Router } from "express";
import { createOneITticket, deleteOneTicket, getAllTickets, getOneSingleTicket, updateOneTicket } from "../controllers/techSupportController.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";
import { supportTicketCreateSchema, supportTicketPatchSchema } from "../validator/validator.js";


const router = Router();

//API Tested
router.get("/api/support/getalltickets",authorizeRole("IT", "admin", "manager"),getAllTickets); 

//API tested
router.get("/api/support/getsingleticket/:id",authorizeRole("IT", "admin", "manager"),getOneSingleTicket); 

//API tested
router.post("/api/support/createsingleticket",authorizeRole("IT","admin","manager"),validationMiddleware(supportTicketCreateSchema),createOneITticket);

//API tested
router.patch("/api/support/updateonesingleticket/:id",authorizeRole("IT","admin","manager"),validationMiddleware(supportTicketPatchSchema) ,updateOneTicket);

//API Tested
router.delete("/api/support/deleteoneticket/:id",authorizeRole("IT","admin","manager"),deleteOneTicket)

export default router;