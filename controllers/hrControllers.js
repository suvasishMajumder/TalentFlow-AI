import { record } from "zod";
import prisma from "../utils/prismaClient.js";
import {
  ok,
  created,
  badReq,
  notFound,
  serverfail,
  unauthorized,
} from "../utils/utils.js";

export const getAllHrData = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return unauthorized(res);
  }

  try {
    const response = await prisma.recruitment_applicants.findMany({});

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const updateHrdata = async (req, res) => {
  const payload = req.body;
  const userId = Number(req.user.id);
  const recordId = Number(req.params.id);

  if (!userId) {
    return unauthorized(res);
  }

  if (!recordId) {
    return badReq(res, "record id is missing");
  }

  try {
    const response = await prisma.recruitment_applicants.update({
      data: payload,

      where: {
        id: recordId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getHrDataById = async (req, res) => {
  const candidateID = Number(req.params.id);

  if (!candidateID) {
    return badReq(res, "Candidate id is missing");
  }

  try {
    const response = await prisma.recruitment_applicants.findFirst({
      where: {
        id: candidateID,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

import { interview_slot } from "@prisma/client";

export const createHrData = async (req, res) => {
  try {
    const {
      interview_time,
      interview_date,
      ...rest
    } = req.body;

    // 🔁 Human-readable → Prisma enum mapping
    const interviewSlotMap = {
      "3:00-400": interview_slot.SLOT_3_00_400,
      "4:00-5:00": interview_slot.SLOT_4_00_500,
      "5:00-6:00": interview_slot.SLOT_5_00_600,
    };

    const payload = {
      ...rest,
      interview_date: interview_date ? new Date(interview_date) : null,
      interview_time: interview_time
        ? interviewSlotMap[interview_time]
        : null,
    };

   

    const response = await prisma.recruitment_applicants.create({
      data: payload,
    });

    return created(res, response);
  } catch (error) {
    console.log(error);
    return serverfail(res, error?.message);
  }
};


export const deleteHrRecord = async (req, res) => {
  const userId = Number(req.user.id);
  const recordId = Number(req.params.id);

  if (!userId) {
    return unauthorized(res);
  }

  if (!recordId) {
    return badReq(res, "Record id is missing or invalid");
  }

  try {
    const response = await prisma.recruitment_applicants.delete({
      where: {
        id: recordId,
      },
    });

    return ok(res, "Record got deleted successfully");
  } catch (error) {
    return serverfail(res, error?.message);
  }
};
