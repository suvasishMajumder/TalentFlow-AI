import { ZodError } from "zod";

export const validationMiddleware = (schema) => (req, res, next) => {
  // Use safeParse to avoid throwing and return structured errors to caller
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const zodError = result.error;
    // Return concise error details for easier debugging in client/postman
    console.log(zodError)
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "Invalid request payload",
        details: zodError.errors,
      },
    });
  }

  // Replace body with parsed/validated data and continue
  req.body = result.data;
  next();
};
