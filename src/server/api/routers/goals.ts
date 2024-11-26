import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  createGoal: publicProcedure
    .input(
      z.object({
        skillId: z.string(),
        desiredProficiency: z.string().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { skillId, desiredProficiency } = input;
      const userId = "publicProcedure"; // Assuming session-based authentication

      return await ctx.db.goal.create({
        data: {
          userId,
          skillId,
          desiredProficiency,
          status: 'ACTIVE',
        },
      });
    }),

  listGoals: publicProcedure.query(async ({ ctx }) => {
    const userId = "publicProcedure";

    return await ctx.db.goal.findMany({
      where: { userId },
      include: { skill: true },
    });
  }),

  updateGoal: publicProcedure
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
          status: isActive ? 'ACTIVE' : isCompleted ? 'COMPLETED' : 'INACTIVE',
        },
      });
    }),

  deleteGoal: publicProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { goalId } = input;

      return await ctx.db.goal.delete({
        where: { id: goalId },
      });
    }),
});
