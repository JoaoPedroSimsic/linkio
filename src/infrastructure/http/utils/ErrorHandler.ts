import { Response } from "express";
import { AppError } from "@application/exceptions/AppError";
import { ZodError } from "zod"; 

export const handleHttpError = (err: unknown, res: Response): Response => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ 
            status: "error",
            message: err.message 
        }); 
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "validation_error",
            message: "The provided data is invalid",
            details: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    if (err instanceof Error) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            return res.status(400).json({ 
                status: "error",
                message: "Invalid data format or database ID" 
            }); 
        }

        console.error(`[Internal Error]: ${err.stack}`);

        return res.status(500).json({
            status: "critical_error",
            message: process.env.NODE_ENV === "production" 
                ? "An internal server error occurred" 
                : err.message, 
        }); 
    }

    return res.status(500).json({ 
        status: "error",
        message: "An unexpected error occurred" 
    }); 
};
