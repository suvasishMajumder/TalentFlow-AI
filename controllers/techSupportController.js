import prisma from "../utils/prismaClient.js";
import {
  badReq,
  created,
  notFound,
  ok,
  serverfail,
  unauthorized,
} from "../utils/utils.js";

export const getAllTickets = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: "Unauthorized" },
    });
  }

  try {
    const response = await prisma.support_tickets.findMany({});

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const getOneSingleTicket = async (req, res) => {
  const userId = req.user.id;
  const ticketId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: "Unauthorized" },
    });
  }

  if (!ticketId) {
    return notFound(res, "No Ticket Id Found");
  }

  try {
    const response = await prisma.support_tickets.findFirst({
      where: {
        id: ticketId,
      },
    });

    if (!response) {
      return notFound(res, "No records found");
    }

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const createOneITticket = async (req, res) => {
  const payload = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: "Unauthorized" },
    });
  }

  try {
    const response = await prisma.support_tickets.create({
      data: payload,
    });

    return created(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const updateOneTicket = async (req, res) => {
  const ticketId = Number(req.params.id);
  const payload = req.body;
  const userId = req.user.id;

  if (!userId) {
    return unauthorized(res, "User id not available");
  }

  if (!ticketId) {
    return badReq(res, "Ticket id is not present");
  }

  try {
    const response = await prisma.support_tickets.update({
      where: {
        id: ticketId,
      },
      data: payload,
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(res, error?.message);
  }
};

export const deleteOneTicket = async (req, res) => {
  const ticketId = Number(req.params.id);
console.log('inside the delete support ticket controller')
  if (!ticketId) {
    return badReq(res, "Ticket id is missing");
  }

  try {
    const response = await prisma.support_tickets.delete({
      where: {
        id: ticketId,
      },
    });

    return ok(res, response);
  } catch (error) {
    return serverfail(error, error?.message);
  }
};
