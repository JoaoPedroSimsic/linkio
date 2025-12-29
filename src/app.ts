import "reflect-metadata";
import "@infrastructure/di";
import express, { Application } from "express";
import { initMongoConnection } from "@infrastructure/db/mongoConnection";
import { orderRoutes } from "@infrastructure/http/routes/orderRoutes";
import { authRoutes } from "@infrastructure/http/routes/authRoutes";
import { Request, Response, NextFunction } from "express";
import { handleHttpError } from "@infrastructure/http/utils/ErrorHandler";
import cookieParser from "cookie-parser";

class App {
	app: Application;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
	}

	async dbs(): Promise<void> {
		await initMongoConnection();
	}

	middlewares(): void {
		this.app.use(express.json());
		this.app.use(cookieParser());
	}

	routes(): void {
		this.app.use("/orders", orderRoutes);
		this.app.use("/auth", authRoutes);

		this.app.use(
			(err: unknown, _req: Request, res: Response, _next: NextFunction) => {
				handleHttpError(err, res);
			},
		);
	}
}

export const appInstance = new App();
