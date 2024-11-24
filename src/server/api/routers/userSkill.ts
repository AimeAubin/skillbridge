import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import {
  AddUserSkillSchema,
  DeleteSchema,
  UpdateUserSkillSchema,
} from "@/utils/validators/skill";

export const userskillsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userSkills = await ctx.db.userSkill.findMany({
          where: {
            userId: input.userId,
          },
          include: {
            skill: true,
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

  add: publicProcedure
    .input(AddUserSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = input.userId;
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

  edit: publicProcedure
    .input(UpdateUserSkillSchema)
    .mutation(async ({ input }) => {
      return await db.userSkill.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: publicProcedure.input(DeleteSchema).mutation(async ({ input }) => {
    return await db.userSkill.delete({
      where: { id: input.id },
    });
  }),
});
