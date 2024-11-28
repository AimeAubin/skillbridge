import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { GoalFormSchema, UpdateGoalSchema } from "@/utils/validators/goal";

export const goalsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return await ctx.db.goal.findMany({
      where: { userId },
      include: { skill: true },
    });
  }),

  add: protectedProcedure
    .input(GoalFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { skillId, desiredProficiency, notes } = input;
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const existingGoal = await ctx.db.goal.findFirst({
        where: {
          userId,
          skillId,
          notes,
          desiredProficiency,
        },
      });

      if (existingGoal) {
        throw new Error(
          "A goal for this skill with the same proficiency level already exists",
        );
      }

      return await ctx.db.goal.create({
        data: {
          userId,
          skillId,
          notes,
          desiredProficiency,
          status: "ACTIVE",
        },
      });
    }),

  edit: protectedProcedure
    .input(UpdateGoalSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const { id, skillId, desiredProficiency, notes } = input;

      const existingGoal = await ctx.db.goal.findFirst({
        where: {
          id: { not: id },
          userId,
          skillId,
          notes,
          desiredProficiency,
        },
      });

      if (existingGoal) {
        throw new Error(
          "A goal with this skill and proficiency level already exists",
        );
      }
      return await ctx.db.goal.update({
        where: { id: id },
        data: {
          skillId,
          notes,
          desiredProficiency,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const { goalId } = input;

      return await ctx.db.goal.delete({
        where: { id: goalId },
      });
    }),

  complete: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        status: z.enum(["ACTIVE", "COMPLETED"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const { goalId, status } = input;
      const goal = await ctx.db.goal.findUnique({
        where: { id: goalId },
        include: { skill: true },
      });

      if (!goal) {
        throw new Error("Goal not found");
      }

      if (goal.userId !== userId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.goal.update({
        where: { id: goalId },
        data: { status },
      });

      if (status === "COMPLETED") {
        const existingUserSkill = await ctx.db.userSkill.findUnique({
          where: {
            userId_skillId: {
              userId,
              skillId: goal.skillId,
            },
          },
        });

        if (existingUserSkill) {
          await ctx.db.userSkill.update({
            where: {
              id: existingUserSkill.id,
            },
            data: {
              proficiencyLevel: goal.desiredProficiency as
                | "BEGINNER"
                | "INTERMEDIATE"
                | "ADVANCED",
            },
          });
        } else {
          await ctx.db.userSkill.create({
            data: {
              userId,
              skillId: goal.skillId,
              proficiencyLevel: goal.desiredProficiency as
                | "BEGINNER"
                | "INTERMEDIATE"
                | "ADVANCED",
            },
          });
        }
      }

      return { message: "Goal status updated successfully" };
    }),
});
