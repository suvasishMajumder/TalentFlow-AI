import express, { Router } from "express"
import { signupUser , loginUser } from "../controllers/authController.js";
import pool from "../db.js";
import { createOneNewLeaveRequest, getAllComplaintsOfOneEmployee, getAllDepartmentsByEmp, getAllLeaveRequestsOfOneEmployee,  getAllTasksAsEmployee, getMyData,  getOneSingleLeaveRequestOfOneEmployee, getSingleTaskAsEmployee, getSpecificComplaintOfOneEmployee, submitOneNewComplaint, updateMyProfile } 
from "../controllers/employeeControllers.js";
import { getAllNotices, getOneSingleEmployee, getSingleNotice } from "../controllers/taskController.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";
import { complaintSchema, leaveRequestSchema, userSchema, userUpdateSchema } from "../validator/validator.js";


const router = Router();



router.get("/me",  getMyData); //api tested

router.patch("/me",validationMiddleware(userUpdateSchema),updateMyProfile); //api tested

router.get("/getAllTasks",getAllTasksAsEmployee); //API Tested

router.get("/getSingleTask/:id",getSingleTaskAsEmployee); //API Tested

router.get("/departments",getAllDepartmentsByEmp); //api tested

router.get("/getallnotices",getAllNotices); //api tested

router.get("/getsinglenotice/:id",getSingleNotice); //api tested

router.get("/me/leave-requests",getAllLeaveRequestsOfOneEmployee);//api tested

router.get("/getonesingleleaverequest/:leaveReqId",getOneSingleLeaveRequestOfOneEmployee); // api tested

router.post("/createOneNewLeaveRequest", validationMiddleware(leaveRequestSchema),createOneNewLeaveRequest); //api tested

router.get("/getAllComplaintsOfOneEmployee",getAllComplaintsOfOneEmployee); // api tested

router.post("/submitOneNewComplaint", validationMiddleware(complaintSchema),submitOneNewComplaint);  //api tested

router.get("/getSpecificComplainOfOneEmployee/:complaintId",getSpecificComplaintOfOneEmployee); //api tested

export default router;