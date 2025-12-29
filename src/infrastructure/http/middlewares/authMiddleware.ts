import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@application/exceptions/AppError";

interface IPayload {
	sub: string;
}

export function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const token = req.cookies?.auth_token;

	if (!token) {
		throw new AppError("Auth token missing", 401);
	}

	try {
		const secret = process.env.JWT_SECRET as string;
		const { sub: user_id } = jwt.verify(token, secret) as IPayload;

		req.user = { id: user_id };

		return next();
	} catch {
		throw new AppError("Invalid token", 401);
	}
}
