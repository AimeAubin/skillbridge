import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    return await ctx.db.goal.findMany({
      where: { userId },
      include: { skill: true },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
        desiredProficiency: z.string().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { skillId, desiredProficiency } = input;
      const userId = ctx.session.user?.id;

      return await ctx.db.goal.create({
        data: {
          userId,
          skillId,
          desiredProficiency,
          status: "ACTIVE",
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        desiredProficiency: z.string().min(1).max(10),
        isActive: z.boolean().optional(),
        isCompleted: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { goalId, desiredProficiency, isActive, isCompleted } = input;

      return await ctx.db.goal.update({
        where: { id: goalId },
        data: {
          desiredProficiency,
          status: isActive ? "ACTIVE" : isCompleted ? "COMPLETED" : "INACTIVE",
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { goalId } = input;

      return await ctx.db.goal.delete({
        where: { id: goalId },
      });
    }),
});
