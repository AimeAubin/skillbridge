import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import {
  AddSkillSchema,
  DeleteSchema,
  UpdateSkillSchema,
} from "@/utils/validators/skill";

export const skillsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const skills = await ctx.db.skill.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return skills;
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
    .input(AddSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const existingSkill = await ctx.db.skill.findUnique({
        where: { name: input.name },
      });
      if (existingSkill) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A skill with this name already exists.",
        });
      }

      return await ctx.db.skill.create({
        data: input,
      });
    }),

  edit: protectedProcedure
    .input(UpdateSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const existingSkill = await ctx.db.skill.findUnique({
        where: { name: input.name },
      });

      if (existingSkill && existingSkill.id !== input.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A skill with this name already exists.",
        });
      }

      return await db.skill.update({
        where: { id: input.id },
        data: {
          name: input.name,
          category: input.category,
        },
      });
    }),

  delete: protectedProcedure.input(DeleteSchema).mutation(async ({ input }) => {
    return await db.skill.delete({
      where: { id: input.id },
    });
  }),
});
