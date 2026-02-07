import { string, z } from "zod";

export const createCatalogueSchema = z.object({
  name: z.string().min(2),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).default("ACTIVE"),
  catalogue_desc: z.string().min(20).max(500).optional(),
  catalogue_image: z.string().optional(),
  allow_seller_requests: z.boolean().optional().default(false), // ✅ lowercase `false`
  auto_approve_products: z.boolean().optional().default(false), // ✅ lowercase `false`
  catalogue_visibility: z
    .enum(["VISIBLE_TO_EVERYONE", "DRAFT"])
    .default("VISIBLE_TO_EVERYONE"),
});

export const updateCatalogueSchema = createCatalogueSchema.partial();

export const updateCategoriesStatusOfCataloguesSchema = z.object({
  updates: z.array(
    z.object({
      categoryId: z.number(),
      status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
    }),
  ),
});

export const updateAssignedSellerOfOneCatalogueSchema = z.object({
  updates: z.array(
    z.object({
      sellerId: z.string().min(2),
      status: z.enum(["ACTIVE", "SUSPENDED"]),
    }),
  ),
});

export const userSchema = z.object({
  id: z.number().int().optional(), // autoincrement, usually not required on create
  email: z.email().max(254),
  password: z.string().min(6), // you can adjust min length
  role: z.string().max(30).default("user").optional(),
  created_on: z.date().optional(), // Prisma default is now()
  dept_id: z.number().int(),
  name: z.string().max(255),
  employeeid: z.string().max(100).optional(),
  phnumbers: z.array(z.string()), // array of phone numbers
  employeestatusenum: z.string().max(20).default("ACTIVE").optional(),

  // Relations are usually validated separately, but you can represent them as arrays/objects if needed:
  complaints: z.array(z.any()).optional(),
  department_department_manager_idTousers: z.array(z.any()).optional(),
  job_information: z.array(z.any()).optional(),
  leave_requests: z.array(z.any()).optional(),
  profiles: z.any().optional(),
  reg_letters: z.array(z.any()).optional(),
  salary_structures: z.array(z.any()).optional(),
  support_tickets_support_tickets_assignee_idTousers: z
    .array(z.any())
    .optional(),
  support_tickets_support_tickets_requester_idTousers: z
    .array(z.any())
    .optional(),
  tasks: z.array(z.any()).optional(),
  department_users_dept_idTodepartment: z.any().optional(),
});

const employeeStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
const roleEnum = z.enum(["user", "admin", "manager", "hr"]);

export const userUpdateSchema = z.object({
  email: z.email("Invalid email").max(254).optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: roleEnum.optional(),
  dept_id: z.number().int().positive().nullable().optional(),
  name: z.string().max(255).nullable().optional(),
  employeeid: z.string().max(100).nullable().optional(),
  phnumbers: z
    .array(z.string().regex(/^[0-9]{7,15}$/, "Invalid phone number"))
    .optional(),
  employeestatusenum: employeeStatusEnum.optional(),
});

// If you have a Prisma enum for task_status, replace with actual values
const taskStatusEnum = z.enum([
  "assigned",
  "in_progress",
  "completed",
  "overdue",
]); // adjust to match your enum

export const taskSchema = z.object({
  // id: z.number().int().positive().optional(), // autoincrement, optional on create
  title: z.string().min(1, "Title is required").max(30),
  description: z.string().min(1, "Description is required").max(200),
  status: taskStatusEnum.optional().default("assigned"),
  created_on: z.date().optional(), // handled by DB
  deadline: z.date({ required_error: "Deadline is required" }),
  user_id: z.number().int().positive().nullable(),
});

export const taskUpdateSchema = z.object({
  title: z.string().max(30).optional(),
  description: z.string().max(200).optional(),
  status: taskStatusEnum.optional(),
  deadline: z.date().optional(),
  user_id: z.number().int().positive().nullable().optional(),
});

export const complaintSchema = z.object({
  complaint_type: z
    .string()
    .min(1, "Complaint type is required")
    .nullable()
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .nullable()
    .optional(),
  status: z.string().min(1, "Status is required").nullable().optional(),
  created_at: z.date().optional(), // default now() handled by DB
  updated_at: z.date().optional(), // default now() handled by DB
});

// Create schema (required fields for new applicant)
export const recruitmentApplicantCreateSchema = z.object({
  applicant_name: z.string().min(1).max(255),

  stage: z.enum([
    "interviewing",
    "hired",
    "not_interested",
    "not_selected",
    "call_not_picked",
    "intern_offer",
    "rejected_offer",
  ]).nullable().optional(),

  job_role: z.enum([
    "FE_Developer",
    "BE_developer",
    "FS_developer__MERN_",
    "FS_developer_JAVA_",
    "FS_Developer__Python_",
    "AI_LLM_engineer",
    "UI_UX_Designer",
    "Graphic_Designer",
    "Digital_Marketing",
    "DevOps",
    "Automation_Tester",
    "Mobile_Developer",
    "HR",
    "BDE",
    "Operation_Executive",
    "IT_Support",
    "Data_Analyst",
    "Video_Editor",
    "Special_Hire",
  ]).nullable().optional(),

  resume_link: z.string().url().nullable().optional(),
  email_id: z.string().email().max(255).nullable().optional(),

  mobile_number: z
    .string()
    .regex(/^[+]?[0-9\-]{7,20}$/)
    .nullable()
    .optional(),

  interview_date: z
    .string()
    .transform((val) => new Date(val))
    .nullable()
    .optional(),

  interview_time: z.enum([
    "3:00-400",
    "4:00-5:00",
    "5:00-6:00",
  ]).nullable().optional(),

  meet_link: z.string().url().nullable().optional(),
  mail_reply_status: z.string().nullable().optional(),
});



// Patch schema (all optional)
export const recruitmentApplicantPatchSchema = z.object({
  applicant_name: z.string().max(255).optional(),
  stage: z.string().optional(),
  job_role: z.string().optional(),
  resume_link: z.url("Invalid resume link").optional(),
  email_id: z.string().email("Invalid email").max(255).optional(),
  mobile_number: z
    .string()
    .regex(/^[0-9]{7,20}$/, "Invalid mobile number")
    .optional(),
  interview_date: z.date().optional(),
  interview_time: z.string().optional(),
  meet_link: z.string().url("Invalid meet link").optional(),
  mail_reply_status: z.string().optional(),
});

const ticketStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const ticketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const supportTicketCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: ticketStatusEnum.optional().default("OPEN"),
  priority: ticketPriorityEnum.optional().default("MEDIUM"),
  requester_id: z.number().int().positive(), // required foreign key
  assignee_id: z.number().int().positive().nullable().optional(),
  resolution_notes: z.string().nullable().optional(),
});

export const supportTicketPatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  requester_id: z.number().int().positive().optional(),
  assignee_id: z.number().int().positive().nullable().optional(),
  resolution_notes: z.string().optional(),
});

// If you have a fixed set of priority levels, replace with z.enum([...])
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]); // adjust to match your actual values

export const noticeSchema = z.object({
  id: z.number().int().positive().optional(), // autoincrement, optional on create
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(200).nullable().optional(),
  priority_level: priorityEnum, // required
  target_department: z.string().nullable().optional(),
  created_at: z.date().optional(), // handled by DB
  updated_at: z.date().optional(), // handled by DB
  viewcount: z.number().int().nonnegative().optional().default(0),
});

export const leaveRequestSchema = z.object({
  id: z.number().int().positive().optional(),
  user_id: z.number().int().positive(),
  start_date: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  end_date: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  reason: z.string().max(200).nullable(),
  status: z.boolean().default(true),
  created_at: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  updated_at: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});

export const noticeUpdateSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(200).optional(),
  priority_level: priorityEnum.optional(),
  target_department: z.string().optional(),
  viewcount: z.number().int().nonnegative().optional(),
});

export const departmentSchema = z.object({
  id: z.number().int().positive().optional(), // autoincrement, optional on create
  dep_name: z.string().min(1, "Department name is required").max(50),
  dep_description: z.string().max(200).nullable().optional(),
  manager_id: z.number().int().positive().nullable().optional(),
  email: z.email("Invalid email").max(60).nullable().optional(),
  status: z.boolean().optional().default(true),
  location: z.string().nullable().optional(),
  created_at: z.date().optional(), // handled by DB
  updated_at: z.date().optional(), // handled by DB
});

export const departmentUpdateSchema = z.object({
  dep_name: z.string().max(50).optional(),
  dep_description: z.string().max(200).optional(),
  manager_id: z.number().int().positive().nullable().optional(),
  email: z.email("Invalid email").max(60).optional(),
  status: z.boolean().optional(),
  location: z.string().optional(),
});

// If you have fixed complaint statuses, replace with z.enum([...])
const complaintStatusEnum = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]); // adjust to match your actual values

export const updateComplaintStatusSchema = z.object({
  status: complaintStatusEnum, // required for this API
});
