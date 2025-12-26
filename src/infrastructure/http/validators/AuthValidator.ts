import { z } from "zod";
import { isEmail, isStrongPassword } from "validator";

export const authSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.trim()
		.toLowerCase()
		.refine((value) => isEmail(value), {
			message: "Invalid email format",
		}),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(72, "Password is too long")
		.refine(
			(value) =>
				isStrongPassword(value, {
					minLength: 6,
					minLowercase: 1,
					minUppercase: 1,
					minNumbers: 1,
					minSymbols: 0,
				}),
			{
				message:
					"Password must contain at least one uppercase and lowercase letter and one number",
			},
		),
});
