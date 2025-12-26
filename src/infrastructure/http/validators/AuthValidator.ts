import { z } from "zod";

export const authSchema = z.object({
	email: z.string().min(1, "Email is required").trim().toLowerCase(),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(72, "Password is too long"),
});
