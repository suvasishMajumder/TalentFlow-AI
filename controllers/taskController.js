import prisma from "../utils/prismaClient.js";
import pool from "../db.js";
import * as z from "zod";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

async function doesDepartmentExists(deptId) {
  const isDeptExists = await prisma.department.findFirst({
    where: {
      id: deptId,
    },
  });
  return isDeptExists;
}

export const getAllEmployees = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(req.user);

    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    const response = await prisma.users.findMany({});

    console.log(response);

    if (response.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "No Employees Found" },
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || "Internal Server error",
    });
  }
};

export const getOneSingleEmployee = async (req, res) => {
  const empId = Number(req.params.id);

  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    if (!empId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: "Employee id parameter Missing" },
      });
    }

    const response = await prisma.users.findUnique({
      where: {
        id: empId,
      },
    });

    console.log(response);

    if (!response) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "No Employees Found" },
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || "Internal Server error",
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      email,
      password,
      role = "user",
      dept_id,
      name,
      employeeid,
      phnumbers,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    if (
      !email ||
      !password ||
      !dept_id ||
      !role ||
      !name ||
      !employeeid ||
      !phnumbers
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          message:
            "id , email , password, dept_id , name , employeeid , phnumbers must not be empty",
        },
      });
    }

    const data = {};

    data.password = hashedpassword;
    data.email = email;
    data.role = role || "user";
    data.dept_id = parseInt(dept_id);
    data.name = name;
    data.employeeid = employeeid;

    if (typeof phnumbers === "string") {
      const phonenumbers = phnumbers.replace(/[{}]/g, "").split(",");

      data.phnumbers = phonenumbers;
    } else if (Array.isArray(phnumbers)) {
      data.phnumbers = phnumbers;
    }

    const response = await prisma.users.create({
      data: data,
    });



    return res.status(201).json({ success: true, data: response, error: null });
  } catch (error) {

    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: "Duplicate Record" },
        });
      }
    }

    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const updateEmployeeInfo = async (req, res) => {

  const empId = Number(req.params.id);

  const userId = req.user.id;

  console.log(req.body)


  try {


const isRecordExists = await prisma.users.findUnique({where:{id:empId}})

if(!isRecordExists){

  return res.status(404).json({success:false,data:null,error:{message:"Record does not exist"}})

}

  const {
  
    password,
    role ,
    dept_id,
    name,
    employeeid,
    employeestatusenum,
    phnumbers,
  } = req.body;


    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    if (!empId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: "Employee Id is missing" },
      });
    }

    if (
      !password ||
      !role ||
      !dept_id ||
      !name ||
      !employeeid ||
      !phnumbers
    ) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          message:
            "password, role , dept_id , name , employee_id , phnumbers must not be null",
        },
      });
    }

    const data = {};
    data.password = password;
    data.role = role;
    data.dept_id = Number(dept_id);
    data.name = name;
    data.employeeid = employeeid;
    data.employeestatusenum = { set: employeestatusenum }; 
    data.phnumbers = phnumbers;

    const response = await prisma.users.update({
      where: {
        id: empId,
      },
      data: data,
    });
console.log(response)


    if (!response) {
      throw new Error("Updation Failed");
    }

    return res.status(200).json({ success: true, data: response, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const deleteEmployee = async (req, res) => {
  const empId = Number(req.params.id);
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
  }

  
const isRecordExists = await prisma.users.findUnique({where:{id:empId}})

if(!isRecordExists){

  return res.status(404).json({success:false,data:null,error:{message:"Record does not exist"}})

}

  if (!empId) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: "Employee Id not present" },
    });
  }

  try {
    const response = await prisma.users.delete({
      where: {
        id: empId,
      },
    });

    return res.status(204).json({
      success: true,
      data: response,
      error: { message: "Deletion Successful" },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(req.user);

    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    const result = await prisma.tasks.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        created_on: true,
        deadline: true,
        user_id: true,
      },

      where: {
        user_id: userId,
      },
    });

    if (!result || result.length === 0) {
      return res.status(200).json({
        success: false,
        data: null,
        error: { message: "No Tasks Found" },
      });
    }

    // console.log(result);

    return res.status(200).json({ success: true, data: result, error: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Internal Server error",
    });
  }
};

export const getSingleTodo = async (req, res) => {
  const id = Number(req.params.id);
  const user_id = req.user.id;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
  }

  try {
    const response = await prisma.tasks.findFirst({
      where: {
        id: id,
        user_id: user_id,
      },
    });

    if (response === null) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: `Not task found with this task id ${id}` },
      });
    }

    return res.status(200).json({ success: true, data: response, error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const createTodo = async (req, res) => {
  // Grab the currently logged-in user's ID from the request.
  // This assumes you have some authentication middleware attaching `req.user`.
  const user_id = req?.user?.id;

  // Destructure task data from the request body
  const { title, description, status, deadline } = req.body;

  // ---- Step 1: Authentication check ----
  // If there's no user, block the request.
  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
  }

  // ---- Step 2: Input validation ----
  // Ensure required fields are provided.
  if (!title || !description || !status || !deadline) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "title, description, status, and deadline must not be blank",
      },
    });
  }

  const validStatuses = ["assigned", "doing", "under_review", "done"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message:
          "Invalid Task Status (It must be any of these:assigned , doing , under_review , done ",
      },
    });
  }

  // ---- Step 3: Convert deadline into a Date object ----
  const deadLineTime = new Date(deadline);

  // Check if the date is valid (invalid dates give NaN timestamps).

  // Explanation:
  /*
    The code if (Number.isNaN(deadlineDate.getTime())) { return res.status(400).json({ error: 'Invalid deadline date' }); } 
    checks if a JavaScript Date object is valid, and if it's not, it sends a "Bad Request" response from the server.
    Here is a breakdown of the code's components:

    deadlineDate.getTime()
    This method is called on a Date object, deadlineDate, and returns the number of milliseconds that have elapsed 
    since January 1, 1970, 00:00:00 UTC.
    If the deadlineDate object represents an invalid date (for example, if it was created with an unparsable 
    string like "invalid-date", or "February 30, 2024"), this method will return NaN (Not-a-Number).
  */

  if (Number.isNaN(deadLineTime.getTime())) {
    return res
      .status(400)
      .json({ success: false, data: null, error: { message: "Invalid Date" } });
  }

  try {
    // ---- Step 4: Create a new task in the database ----
    // Prisma will automatically enforce the unique constraint defined in schema:
    //   @@unique([user_id, title, description, status])

    // -- OnSuccess:
    /*
      If the create operation is successful, the await statement will resolve with a plain JavaScript object. 
      This object represents the new row in the database table and has properties that correspond to the columns 
      in your tasks model.
    */

    // -- OnFailure:
    /*
      If the database operation fails, the promise is rejected and an error is thrown. 
      You can capture this error and handle it using a try...catch block.
    */

    const response = await prisma.tasks.create({
      data: {
        user_id, // always tied to the current user
        title, // short title of the task
        description, // longer description
        status, // must match the `task_status` enum (assigned, doing, etc.)
        deadline: deadLineTime, // properly stored as a Date object
        // Note: `created_on` field is filled automatically by schema default
      },
    });

    const newdata = await prisma.tasks.findMany({ where: { user_id } });

    // Send the created task back with status 201 (Created)
    return res.status(201).json({ success: true, data: newdata, error: null });
  } catch (error) {
    // ---- Step 5: Error handling ----

    // Prisma uses specific error codes for DB-level issues
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Error code P2002 means "Unique constraint failed".
        // This happens if the same user tries to create a task with the
        // same title+description+status again (duplicate).
        return res.status(409).json({
          success: false,
          data: null,
          error: { message: "Duplicate entry" },
        });
      }
      if (error.code === "P2003") {
        // Error code P2003 means "Foreign key constraint failed".
        // This could happen if `user_id` does not exist in the users table.
        // Shouldn’t normally happen if auth middleware is correct.
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: "Invalid user reference" },
        });
      }
    }

    // For all other unexpected errors, return generic 500
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message ?? "Internal Server Error" },
    });
  }
};

export const updateTodo = async (req, res) => {
  const id = Number(req.params.id);

  const user_id = req.user?.id;

  const { title, description, status, deadline } = req.body;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
  }

  if (!title && !description && !status && !deadline) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: "No Fields to update" },
    });
  }

  const existing = await prisma.tasks.findFirst({
    where: {
      id: id,
    },
  });

  if (!existing) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: `The task Not found with id ${id}` },
    });
  }

  if (existing.user_id !== user_id) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: "Unauthorized for updating this task" },
    });
  }

  try {
    const response = await prisma.tasks.update({
      where: {
        id: id,
        user_id: user_id,
      },
      data: {
        title: title,
        description: description,
        status: status,
        deadline: deadline,
      },
    });

    const result = await prisma.tasks.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        user_id,
      },
    });

    if (result.length === 0) {
      throw new Error("No Data Found");
    } else {
      res.status(200).json({ success: true, data: result, error: null });
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: "Bad Request !" },
        });
      }
    }

    res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const deleteTodo = async (req, res) => {
  const id = parseInt(req.params.id);

  const userId = req?.user.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid Task id" });
  }

  const res1 = await prisma.tasks.findFirst({
    where: {
      id: id,
    },
  });

  if (!res1) {
    return res.status(200).json({ error: "No task found to delete" });
  }

  if (res1.user_id !== userId) {
    return res
      .status(401)
      .json({ error: "You are not Authorized to delete this task !" });
  }

  //Note:

  /*
  RETURNING * returns the deleted row(s) before they were deleted.
When you use RETURNING * in a DELETE statement:

If a row is deleted: response.rows will contain an array with the deleted row data
If no row is deleted: response.rows will be an empty array []
  */
  try {
    //on failure prisma.delete throws an error
    const response = await prisma.tasks.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(500).json({ error: "No record found with this id to delete" });
    }
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    // const result = await pool.query(`SELECT * FROM notice`);

    const result = await prisma.notice.findMany();

    // console.log(result);

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (result.length === 0) {
      return res.status(204).json({ error: "No Content" });
    }

    if (result) {
      return res.status(200).json(result);
    } else {
      throw new Error("Error Fetching Notices");
    }
  } catch (error) {
    return res
      .status(404)
      .json({ error: error.message || "Error Getting Notices" });
  }
};

export const getSingleNotice = async (req, res) => {
  const id = Number(req.params?.id);

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Id Not Found !" });
  }

  try {
    const result = await prisma.notice.findFirst({
      where: {
        id,
      },
    });

    if (result.length === 0) {
      return res.status(204).json({ error: "No Noitce Found with this id" });
    }

    if (result.length !== 0) {
      return res.status(200).json(result);
    } else {
      throw new Error("Error Fetching Notices");
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: error.message || "Error Getting Notices" },
    });
  }
};

export const getRequests = async (req, res) => {
  const userId = req.user.id;
  console.log(req.user);

  let complaints = [];
  let leave_requests = [];

  try {
    const response = await prisma.complaints.findMany({
      where: {
        user_id: userId,
      },
    });

    const data = await prisma.leave_requests.findMany({
      where: {
        user_id: userId,
      },
    });

    if (response.length === 0 && data.length > 0) {
      res.status(200).json({ complaints: [], leave_requests: data });
    } else if (response.length > 0 && data.length === 0) {
      res.status(200).json({ complaints: response, leave_requests: [] });
    } else if (response.length === 0 && data.length === 0) {
      res.status(200).json({ complaints: [], leave_requests: [] });
    } else {
      // both have data
      res.status(200).json({ complaints: response, leave_requests: data });
    }
  } catch (error) {
    res.staus(500).json({ error: "Internal Server Error" });
  }
};

export const updateNoticeViewCount = async (req, res) => {
  const notice_id = Number(req?.params.id);
  const userId = req?.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!notice_id || isNaN(notice_id)) {
    return res.staus(400).json({ error: "Invalid Notice Id" });
  }

  try {
    const response = await prisma.notice.update({
      where: {
        id: notice_id,
      },

      data: {
        viewcount: {
          increment: 1,
        },
      },
    });

    console.log(response.rows);

    const updatedNotices = await prisma.notice.findMany();

    return res.status(201).json(updatedNotices.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const createProfile = async (req, res) => {
  const {
    user_id,
    education,
    hard_skill,
    degree,
    soft_skill,
    address,
    city,
    nationality,
    gender,
    status,
    mobile1,
    mobile2,
    type_of_hire,
    job_role,
    postal_code,
  } = req.body;

  const profileSchema = z.object({
    user_id: z.number().int(),
    education: z.string().min(1, "Education is Required"),
    hard_skill: z.string().min(1, "Hard Skill is required"),
    degree: z.string().min(1, "Degree is required"),
    soft_skill: z.string().min(1, "Soft skill is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    nationality: string.min(1, "Nationality is required"),
    gender: z.string().min(1, "Gender is required"),
    status: z.boolean().default(true),
    mobile1: z.string
      .min(10, "Mobile Number must be at least 10 digits")
      .max(15, "Mobile Number must be at most 15 digits"),
    mobile2: z
      .string()
      .min(10, "Mobile Number must be at least 10 digits")
      .max(15, "Mobile Number must be at most 15 digits"),
    type_of_hire: z.string().min(1, "Type of hire field must be specified"),
    job_role: z.string().min(1, "Job role fields must be specified"),
    postal_code: z.string.min(
      4,
      "Postal_code field must be specified and it should be at least 4 digits"
    ),
  });

  try {
    const validatedData = profileSchema.parse(req.body);

    console.log(validatedData);

    const response = await prisma.profiles.create({
      data: { validatedData },
    });

    if (response) {
      res.status(201).json(response);
    } else {
      throw new Error("Failed to Create");
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteSingleNotice = async (req, res) => {
  const userId = req?.user.id;
  const id = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id || isNaN(id)) {
    return res.status().json({ error: "Invalid id" });
  }

  try {
    const response = await prisma.notice.delete({
      where: {
        id: id,
      },
    });

    const newResponse = await prisma.notice.findMany({});

    return res.status(200).json(newResponse);
  } catch (error) {
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Notice with this id is not found" });
      }
    } else {
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  }
};

export const deleteAllNotice = async (req, res) => {
  const userId = req?.user.id;
  const id = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await prisma.notice.deleteMany({});

    return res
      .status(200)
      .json({ message: "All Notices Deleted Successfully" });
  } catch (error) {
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Notice with this id is not found" });
      }
    } else {
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  }
};

export const getAllLeaveRequests = async (req, res) => {
  const userId = req?.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await prisma.leave_requests.findMany({});

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(404)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getSingleLeaveRequests = async (req, res) => {
  const userId = req?.user.id;
  const lr_id = Number(req.params.id);

  if (!lr_id || isNaN(lr_id)) {
    return res.status(404).json({ error: "Leave request id not present" });
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await prisma.leave_requests.findFirst({
      where: {
        id: lr_id,
      },
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res
      .status(404)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getAllComplaints = async (req, res) => {
  const userId = req?.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
  }

  try {
    const response = await prisma.complaints.findMany({});
    console.log(response);

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "No Complaints Found" },
      });
    }

    return res
      .status(200)
      .json({ success: true, data: response || null, error: null });
  } catch (error) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: "No Complaints Found" },
    });
  }
};

export const getSingleComplaint = async (req, res) => {
  const userId = req?.user?.id;
  const complaintId = Number(req.params.id);

  // --- Step 1: Auth & input validation ---
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } }); //
  }

  if (!complaintId || isNaN(complaintId)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: "Invalid complaint ID" },
    });
  }

  try {
    // --- Step 2: Fetch complaint from DB ---
    const complaint = await prisma.complaints.findFirst({
      where: { id: complaintId },
    });

    console.log(complaintId);
    console.log(req.user.id);

    // --- Step 3: Not found check ---
    if (!complaint) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "Complaint not found" },
      });
    }

    console.log(complaint);
    // --- Step 4: Ownership check ---
    // if (complaint.user_id !== userId) {
    //   return res
    //     .status(403)
    //     .json({ success: false, data: null, error: { message: "Forbidden" } });
    // }

    // --- Step 5: Success response ---
    return res
      .status(200)
      .json({ success: true, data: complaint, error: null });
  } catch (error) {
    // --- Step 6: Prisma-specific errors ---
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          data: null,
          error: { message: "Complaint with this ID not found" },
        });
      }
    }

    // --- Step 7: Generic server error ---
    console.error("getSingleComplaint error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  const userId = req.user.id;
  const complaintId = Number(req.params.id);
  const { status } = req.body;

  console.log(typeof userId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: "Forbidden" },
    });
  }

  if (!complaintId && isNaN(complaintId)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: "Complaint id not found or invalid" },
    });
  }

  const isComplaintExists = await prisma.complaints.findUnique({
    where: { id: complaintId },
  });

  if (!isComplaintExists) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: "Complaint does not exists" },
    });
  }

  const date = new Date();
  try {
    const updatedComplaint = await prisma.complaints.update({
      where: {
        id: complaintId,
      },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "Complaint Update Failed" },
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedComplaint,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};

export const getAllDepartments = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Forbidden" } });
  }

  try {
    const departments = await prisma.department.findMany({});

    if (!departments) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "No Departments Found" },
      });
    }

    res.status(200).json({ success: true, data: departments, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: "Internal server error" },
    });
  }
};

export const getSingleDepartment = async (req, res) => {
  const userId = req.user.id;
  const dept_id = Number(req.params.id);
  console.log(userId);
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Forbidden" } });
  }

  if (!dept_id || isNaN(dept_id)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: "Department id not present" },
    });
  }

  console.log(dept_id, userId);
  try {
    const department = await prisma.department.findUnique({
      where: { id: dept_id },
    });

    console.log(department);

    if (!department) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: `No Departments Found with the id ${dept_id}` },
      });
    }

    res.status(200).json({ success: true, data: department, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal server error" },
    });
  }
};

export const createNewDepartment = async (req, res) => {
  const userId = req.user.id;

  const { id, dep_name, dep_description, manager_id, email, status, location } =
    req.body;

  console.log(userId);

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Forbidden" } });
  }

  try {
    const date = new Date();

    const response = await prisma.department.create({
      data: {
        dep_name,
        dep_description,
        manager_id,
        email,
        status,
        location,
        updated_at: new Date(),
      },
      select: {
        id: true,
        dep_name: true,
      },
    });

    console.log(response);
    if (!response) {
      return res.status(200).json({
        success: false,
        data: null,
        error: { message: "Failed to create new department" },
      });
    }

    res.status(201).json({ success: true, data: response, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const updateDepartment = async (req, res) => {
  const userId = req.user.id;

  const deptId = Number(req.params.id);

  const { dep_name, dep_description, manager_id, email, status, location } =
    req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Forbidden" } });
  }

  if (!deptId) {
    return res.status.json({
      success: false,
      data: null,
      error: { message: `Deaprtment with id ${deptId} not present` },
    });
  }

  const isDeptExists = await prisma.department.findFirst({
    where: {
      id: deptId,
    },
  });

  if (!isDeptExists) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: `Department with id ${deptId} does not exits` },
    });
  }

  try {
    const response = await prisma.department.update({
      where: { id: deptId },
      data: {
        dep_name,
        dep_description,
        manager_id,
        email,
        status,
        location,
        updated_at: new Date(),
      },
    });

    if (!response) {
      return res.status(500).json({
        success: false,
        data: null,
        error: { message: "Updation Failed" },
      });
    }

    res.status(200).json({ success: true, data: response, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

export const deleteDepartment = async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, data: null, error: { message: "Forbidden" } });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: `${id} not present` },
    });
  }

  const idDepartmentExists = doesDepartmentExists(deptId);

  if (!idDepartmentExists) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: `Department with the id ${deptId} does not exist` },
    });
  }

  try {
    const response = await prisma.department.delete({
      where: { id },
    });

    res.status(204).json({ success: false, data: response, error: null });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          data: null,
          error: { message: `deparment with the ${id} not foound` },
        });
      }
    }
  }
};
