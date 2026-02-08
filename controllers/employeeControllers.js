import prisma from "../utils/prismaClient.js";
import {
  ok,
  badReq,
  created,
  notFound,
  serverfail,
  unauthorized,
} from "../utils/utils.js";

export const getMyData = async (req, res) => {
  const userId = req.user.id;
  // console.log(req.user);

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;
  // console.log(req.user);

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.users.update({
      where: {
        id: userId,
      },

      data: payload,
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(error, error?.message);
  }
};

export const getAllDepartmentsByEmp = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return unauthorized(res);
  }

  console.log("The user id is", userId);
  try {
    const departments = await prisma.department.findMany({});

    if (!departments) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: "No Departments Found" },
      });
    }

    return ok(res, departments);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getAllLeaveRequestsOfOneEmployee = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.leave_requests.findMany({
      where: {
        user_id: userId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res);
  }
};

export const getOneSingleLeaveRequestOfOneEmployee = async (req, res) => {
  const leaveReqId = req.params.leaveReqId;
  const userId = req.user.id;

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.leave_requests.findFirst({
      where: {
        user_id: Number(userId),
        id: Number(leaveReqId),
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const createOneNewLeaveRequest = async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;

  if (!userId) {
    return unauthorized(res);
  }

  console.log(userId);

  try {
    const response = await prisma.leave_requests.create({
      data: payload,
    });
    console.log(response);
    return created(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getAllComplaintsOfOneEmployee = async (req, res) => {
  const userId = req?.user.id;

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.complaints.findMany({
      where: {
        user_id: Number(userId),
      },
    });

    if (!response || response.length === 0) {
      return notFound(res, "No complaints found");
    }

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const createOneLeaveRequest = async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;

  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.leave_requests.create({
      data: payload,
    });

    return created(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const submitOneNewComplaint = async (req, res) => {
  const payload = req.body;
  const userId = req.user.id;

  if (!userId) {
    return unauthorized(res);
  }

  payload.user_id = userId;

  try {
    const response = await prisma.complaints.create({
      data: payload,
    });

    return created(res, response);
  } catch (error) {
    console.log(error);
    return serverfail(res, error?.message);
  }
};

export const getSpecificComplaintOfOneEmployee = async (req, res) => {
  const userId = req.user?.id;
  const complaintId = Number(req.params.complaintId);

  if (!userId) {
    return unauthorized(res);
  }

  if (!complaintId) {
    return badReq(res, "Complain id not found");
  }

  try {
    const response = await prisma.complaints.findUnique({
      where: {
        id: complaintId,
        user_id: userId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getAllTasksAsEmployee = async (req, res) => {
  const userId = req.user?.id;
  console.log(`The user id on the backend is ${userId}`);
  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.tasks.findMany({
      where:{
        user_id:Number(userId)
      }
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getSingleTaskAsEmployee = async (req, res) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);

  if (!userId) {
    return unauthorized(res);
  }

  if (!taskId) {
    return badReq(res, "task id is missing");
  }

  try {
    const response = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};
