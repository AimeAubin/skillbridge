import { UserRole } from "@prisma/client";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email must be a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/.test(
          value ?? "",
        ),
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    ),
});

export const RegisterSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters long",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email must be a valid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/.test(
          value ?? "",
        ),
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    ),
});

export const SettingSchema = z.object({
  name: z.optional(
    z
      .string({
        required_error: "Name is required",
      })
      .min(2, {
        message: "Name must be at least 2 characters long",
      }),
  ),
  email: z.optional(
    z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email"),
  ),
  password: z.optional(
    z
      .string({
        required_error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/.test(
            value ?? "",
          ),
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      ),
  ),
  newPassword: z.optional(
    z
      .string({
        required_error: "New Password is required",
      })
      .min(8, { message: "New Password must be at least 8 characters long" })
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/.test(
            value ?? "",
          ),
        "New Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      ),
  ),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});
