import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import {
  UserSkillFormSchema,
  DeleteSchema,
  UpdateUserSkillSchema,
} from "@/utils/validators/skill";

export const userskillsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      const userSkills = await ctx.db.userSkill.findMany({
        where: {
          userId: userId,
        },
        include: {
          skill: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return userSkills;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch skills. Please try again later.",
        cause: error,
      });
    }
  }),

  add: protectedProcedure
    .input(UserSkillFormSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const skillIds = input.skills.map((skill) => skill.skillId);
      const existingSkills = await ctx.db.userSkill.findMany({
        where: {
          userId,
          skillId: { in: skillIds },
        },
        select: {
          skillId: true,
        },
      });

      const existingSkillIds = existingSkills.map((skill) => skill.skillId);
      const newSkills = input.skills.filter(
        (skill) => !existingSkillIds.includes(skill.skillId),
      );

      if (newSkills.length === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No new skills to add. All selected skills already exist.",
        });
      }
      const newUserSkills = newSkills.map((skill) => ({
        userId,
        skillId: skill.skillId,
        proficiencyLevel: skill.proficiencyLevel,
      }));

      try {
        const createdUserSkills = await ctx.db.userSkill.createMany({
          data: newUserSkills,
        });

        return {
          message: `${createdUserSkills.count} new skill(s) added successfully.`,
          skills: newUserSkills,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add user skills.",
          cause: error,
        });
      }
    }),

  edit: protectedProcedure
    .input(UpdateUserSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const { skillId, proficiencyLevel, id } = input;

      const existingUserSkill = await ctx.db.userSkill.findUnique({
        where: { id },
      });

      if (!existingUserSkill) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Skill not found for the given user.",
        });
      }

      const existingSkills = await ctx.db.userSkill.findMany({
        where: {
          userId,
          skillId: { not: skillId },
        },
        select: { skillId: true },
      });

      const existingSkillIds = existingSkills.map((skill) => skill.skillId);

      if (existingSkillIds.includes(skillId)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This skill already exists for the user.",
        });
      }

      try {
        const updatedUserSkill = await ctx.db.userSkill.update({
          where: { id },
          data: {
            skillId,
            proficiencyLevel,
          },
        });

        return {
          message: "Skill updated successfully.",
          skill: updatedUserSkill,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user skill.",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure.input(DeleteSchema).mutation(async ({ input }) => {
    return await db.userSkill.delete({
      where: { id: input.id },
    });
  }),
});
