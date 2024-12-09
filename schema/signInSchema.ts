import { object, string, z } from "zod"

export const SignInSchema = object({
    username: string({ required_error: "username is required" })
        .min(1, "username is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    userType: string()
})

export type SignInType = z.infer<typeof SignInSchema>