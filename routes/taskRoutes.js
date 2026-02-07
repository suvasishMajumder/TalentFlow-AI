import express, { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllNotices,
  getAllTodos,
  getSingleTodo,
  updateTodo,
  createProfile,
  deleteAllNotice,
  getRequests,
  getSingleLeaveRequests,
  getSingleNotice,
  getAllComplaints,
  getSingleComplaint,
  updateNoticeViewCount,
  updateDepartment,
  updateComplaintStatus,
  getAllDepartments,
  createNewDepartment,
  getSingleDepartment,
  deleteSingleNotice,
  deleteDepartment,
  getAllLeaveRequests,
  getAllEmployees,
  getOneSingleEmployee,
  updateEmployeeInfo,
  deleteEmployee,
  createEmployee,
} from "../controllers/taskController.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";
import {
  departmentSchema,
  departmentUpdateSchema,
  noticeUpdateSchema,
  taskSchema,
  taskUpdateSchema,
  updateComplaintStatusSchema,
  userSchema,
  userUpdateSchema,
} from "../validator/validator.js";

const router = Router();


//API tested
router.get(
  "/api/admin/employees",
  authorizeRole("admin", "manager"),
  getAllEmployees,
);


//API tested
router.get(
  "/api/admin/employees/:id",
  authorizeRole("admin", "manager"),
  getOneSingleEmployee,
);


//API Tested
router.post(
  "/api/admin/employees",
  authorizeRole("admin"),
  validationMiddleware(userSchema),
  createEmployee,
); //


//API Tested
router.put(
  "/api/admin/employees/:id",
  authorizeRole("admin", "manager"),
  validationMiddleware(userUpdateSchema),
  updateEmployeeInfo,
); //2


//API Tested
router.delete(
  "/api/admin/employees/:id",
  authorizeRole("admin"),
  deleteEmployee,
);

//API Tested
router.get("/admin/todos/:empid", authorizeRole("hr", "admin", "manager"), getAllTodos);

//API Tested
router.get(
  "/admin/todos/:empid/:id",
  authorizeRole("hr", "admin", "manager"),
  getSingleTodo,
);


//API Tested
router.post(
  "/createtask",
  authorizeRole("hr", "admin", "manager"),
  validationMiddleware(taskSchema),
  createTodo,
); //3

//Later
router.delete(
  "/deletetask/:id",
  authorizeRole("user", "admin", "manager"),
  deleteTodo,
);

//API tested
router.patch(
  "/updatetask/:id",
  authorizeRole("admin", "manager"),
  validationMiddleware(taskUpdateSchema),
  updateTodo,
); //4

//API tested
router.get("/notices", authorizeRole("admin", "manager"), getAllNotices);


//API tested
router.get(
  "/notices/getsinglenotice/:id",
  authorizeRole("admin", "manager"),
  getSingleNotice,
);

//Later
router.patch(
  "/notices/:id",
  authorizeRole("user", "admin", "manager"),
  validationMiddleware(noticeUpdateSchema),
  updateNoticeViewCount,
); //5

router.post("/admin/profile", authorizeRole("admin", "manager"), createProfile); //6 -- add validation later later 

router.get("/admin/requests", authorizeRole("admin", "manager"), getRequests); //later 

//API Tested
router.delete(
  "/admin/notice/deletesinglenotice/:id",
  authorizeRole("admin"),
  deleteSingleNotice,
);

//API Tested
router.delete(
  "/admin/notice/deleteallnotices",
  authorizeRole("admin"),
  deleteAllNotice,
);

//API Tested
router.get(
  "/admin/leave_requests",
  authorizeRole("admin"),
  getAllLeaveRequests,
);

//API Tested
router.get(
  "/admin/leave_requests/:id",
  authorizeRole("admin"),
  getSingleLeaveRequests,
);

//API Tested
router.get("/admin/getallcomplaints", authorizeRole("admin"), getAllComplaints);

//API Tested
router.get(
  "/admin/getsinglecomplaints/:id",
  authorizeRole("admin"),
  getSingleComplaint,
);

//API Tested
router.patch(
  "/admin/updateComplaintStatus/:id",
  authorizeRole("admin"),
  validationMiddleware(updateComplaintStatusSchema),
  updateComplaintStatus,
); //7

//API Tested
router.get(
  "/admin/getAllDepartments",
  authorizeRole("admin"),
  getAllDepartments,
);

//API Tested
router.get(
  "/admin/getSingleDepartment/:id",
  authorizeRole("admin"),
  getSingleDepartment,
);

//API Tested
router.post(
  "/admin/createNewDepartment",
  authorizeRole("admin"),
  validationMiddleware(departmentSchema),
  createNewDepartment,
); //8

//API Tested
router.put(
  "/admin/updateDepartment/:id",
  authorizeRole("admin"),
  validationMiddleware(departmentUpdateSchema),
  updateDepartment,
); //9

//API Tested
router.delete(
  "/admin/deleteasingledepartment/:id",
  authorizeRole("admin"),
  deleteDepartment,
);

export default router;
