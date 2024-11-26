"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { signIn } from "@/server/auth";
import { db } from "@/server/db";
import { LoginSchema } from "@/utils/validators/user";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validateFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser?.email || !existingUser?.password) {
    return { error: "Invalid credentials. Please try again." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please try again." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    throw error;
  }
};
