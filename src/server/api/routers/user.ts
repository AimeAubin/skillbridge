import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email address is already in use.",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.optional(z.string()),
        email: z.optional(z.string()),
        password: z.optional(z.string()),
        newPassword: z.optional(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const { name, email } = input;
      let password = input.password;
      let newPassword = input.password;

      const user = await ctx.db.user.findUnique({
        where: {
          id,
        },
      });

      if (email && email !== user?.email) {
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email,
          },
        });

        if (existingUser && existingUser.id !== user?.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email address is already in use.",
          });
        }
      }

      if (password && newPassword && user?.password) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Current password is incorrect.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        password = hashedPassword;
        newPassword = undefined;
      }

      return await ctx.db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
          email,
          password,
        },
      });
    }),
});
