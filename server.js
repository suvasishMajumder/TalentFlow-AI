import dotenv from "dotenv";
dotenv.config();
// 👇 force Prisma to use pooler at runtime if provided
if (process.env.DATABASE_URL_POOLER) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_POOLER;
}
import express from "express";
import pkg from "pg";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db.js";
// import {CreateError} from '../utils/error.js'
import taskRoutes from "../backend/routes/taskRoutes.js";
import supportRoutes from '../backend/routes/techSupportRoute.js';
import hrRoutes from '../backend/routes/hrRoutes.js';
import employeeRoutes from '../backend/routes/employeeRoutes.js';
import authRoutes from "../backend/routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import { rateLimiterMiddleware } from "./middleware/ratelimiterMilddleware.js";

const app = express();

const port = process.env.PORT || 4000;



// ✅ Apply limiter to ALL endpoints
app.use(rateLimiterMiddleware);
app.use((req, res, next) => {
  console.log("Limit info: total limit:", req?.rateLimit.limit);
  console.log('The ip = ',req.ip)
   console.log("Limit info: remaining:", req?.rateLimit.remaining);
  next();
});
app.use(express.json()); // Needed for req.body to work

// 2️⃣ (Optional) Parse URL-encoded bodies if you ever post form data
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.set("trust proxy", 1); // ✅ required for correct IP detection
// Note: xss-clean removed - incompatible with Express 5.x (read-only query property)

app.use("/auth", authRoutes);

// Protected task routes
// All routes in taskRoutes will require a verified JWT
app.use("/tasks", verifyToken, taskRoutes);
app.use("/support",verifyToken,supportRoutes);
app.use("/hr",verifyToken,hrRoutes);
app.use("/employees", verifyToken, employeeRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.disable('etag');
// app.get("/todos", async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT * FROM tasks`);
//     // console.log(result.rowCount);

//     if (result.rows.length > 0) {
//       res.status(200).json(result);
//     } else {
//       throw new Error();
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//get a single todo

// app.get("/todos/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log("ID received:", id);

//   try {
//     const response = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
//       id,
//     ]);

//     if (response.rows.length > 0) {
//       return res.status(200).json(response.rows);
//     } else {
//       // throw new Error("No Data Dound With This id");
//       res.status(404).json({error:"No Data Dound With This id"})
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Srver Error" });
//   }
// });

//create new task
// app.post("/createtask", async (req, res) => {
//   const created_on = new Date();
//   const { title, description, status, deadline } = req.body;

//   try {
//     const response = await pool.query(
//       `INSERT INTO tasks (title,description,status,created_on,deadline) VALUES($1,$2,$3,$4,$5)
//   RETURNING *`,
//       [title, description, status, created_on, deadline]
//     );

//     if (response.rows.length > 0) {
//       res.status(201).json(response.rows);
//     } else {
//       throw new Error("Error inserting the data");
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error.messege || "Internal Server Error")
//   }
// });

//delete a task

// app.delete("/todos/:id", async (req, res) => {
//   const id = parseInt(req.params.id);

//   //Note:

//   /*
//   RETURNING * returns the deleted row(s) before they were deleted.
// When you use RETURNING * in a DELETE statement:

// If a row is deleted: response.rows will contain an array with the deleted row data
// If no row is deleted: response.rows will be an empty array []
//   */
//   try {
//     const response = await pool.query(
//       `DELETE FROM tasks WHERE id = $1 RETURNING *`,
//       [id]
//     );

//     // if (response.rows.length === 0) {
//     //   return res.status(404).json({ error: "Task not found" });
//     // }

//     res.status(200).json({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message || "Internal Server Error" });
//   }
// });

//update task

// app.put('/updatetask/:id',async(req,res)=>{

// const id = parseInt(req.params.id);

//   const { title, description, status, deadline } = req.body;

// try {

// const response = await pool.query(`UPDATE tasks
// SET title = $1, description = $2, status = $3, deadline = $4
// WHERE id = $5 RETURNING *`,[title,description,status,deadline,id]);

// if(response.rows.length===0){

//   return res.status(404).json({error:'Task Not Found'});

// }else{

//   const result = await pool.query(`SELECT * FROM tasks ORDER BY id ASC`);

//   if(result.rows.length === 0){

//     throw new Error("No Data Found");

//   }else{

//      res.status(200).json(result.rows);

//   }

// }

// } catch (error) {
//   console.log(error);

//   res.status(500).json({error:error.message || "Internal Server Error" })
// }

// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
