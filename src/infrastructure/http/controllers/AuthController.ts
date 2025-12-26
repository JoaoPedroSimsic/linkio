import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { CreateUserUseCase } from "@application/use-cases/user/CreateUserUseCase";
import { LoginUserUseCase } from "@application/use-cases/user/LoginUserUseCase";
import { handleHttpError } from "../utils/ErrorHandler";
import { AppError } from "@shared/errors/AppError";
import validator from "validator";
import { authSchema } from "../validators/AuthValidator";

@injectable()
export class AuthController {
	constructor(
		private createUserUseCase: CreateUserUseCase,
		private loginUserUseCase: LoginUserUseCase,
	) { }

	async create(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = authSchema.parse(req.body);

			if (!validator.isEmail(email)) {
				throw new AppError("Invalid email format", 400);
			}

			await this.createUserUseCase.execute({
				email,
				password,
			});

			return res.status(201).json({ message: "User created" });
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const validatedRequest = authSchema.parse(req.body);

			const result = await this.loginUserUseCase.execute(validatedRequest);

			return res.status(200).json(result);
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}
}
