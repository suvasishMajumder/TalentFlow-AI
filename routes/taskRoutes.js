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

const router = Router();

router.get(
  "/api/admin/employees",
  authorizeRole("admin", "manager"),
  getAllEmployees
);

router.get(
  "/api/admin/employees/:id",
  authorizeRole("admin", "manager"),
  getOneSingleEmployee
);

router.post("/api/admin/employees", authorizeRole("admin"), createEmployee);

router.put(
  "/api/admin/employees/:id",
  authorizeRole("admin", "manager"),
  updateEmployeeInfo
);

router.delete(
  "/api/admin/employees/:id",
  authorizeRole("admin"),
  deleteEmployee
);

router.get("/todos", authorizeRole("user", "admin", "manager"), getAllTodos);

router.get(
  "/todos/:id",
  authorizeRole("user", "admin", "manager"),
  getSingleTodo
);

router.post(
  "/createtask",
  authorizeRole("user", "admin", "manager"),
  createTodo
);

router.delete(
  "/deletetask/:id",
  authorizeRole("user", "admin", "manager"),
  deleteTodo
);

router.put(
  "/updatetask/:id",
  authorizeRole("user", "admin", "manager"),
  updateTodo
);

router.get("/notices", authorizeRole("admin", "manager"), getAllNotices);

router.get(
  "/notices/getsinglenotice/:id",
  authorizeRole("admin", "manager"),
  getSingleNotice
);

router.put(
  "/notices/:id",
  authorizeRole("user", "admin", "manager"),
  updateNoticeViewCount
);

router.post("/profile", authorizeRole("admin", "manager"), createProfile);

router.get("/requests", authorizeRole("admin", "manager"), getRequests);

router.delete(
  "/admin/notice/deletesinglenotice/:id",
  authorizeRole("admin"),
  deleteSingleNotice
);

router.delete(
  "/admin/notice/deleteallnotices",
  authorizeRole("admin"),
  deleteAllNotice
);

router.get(
  "/admin/leave_requests",
  authorizeRole("admin"),
  getAllLeaveRequests
);

router.get(
  "/admin/leave_requests/:id",
  authorizeRole("admin"),
  getSingleLeaveRequests
);

router.get("/admin/getallcomplaints", authorizeRole("admin"), getAllComplaints);

router.get(
  "/admin/getsinglecomplaints/:id",
  authorizeRole("admin"),
  getSingleComplaint
);

router.patch(
  "/admin/updateComplaintStatus/:id",
  authorizeRole("admin"),
  updateComplaintStatus
);

router.get(
  "/admin/getAllDepartments",
  authorizeRole("admin"),
  getAllDepartments
);

router.get(
  "/admin/getSingleDepartment/:id",
  authorizeRole("admin"),
  getSingleDepartment
);

router.post(
  "/admin/createNewDepartment",
  authorizeRole("admin"),
  createNewDepartment
);

router.put(
  "/admin/updateDepartment/:id",
  authorizeRole("admin"),
  updateDepartment
);

router.delete(
  "/admin/deleteasingledepartment/:id",
  authorizeRole("admin"),
  deleteDepartment
);

export default router;
