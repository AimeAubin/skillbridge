import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { AddSkillSchema, DeleteSchema, UpdateSkillSchema } from '@/utils/validators/skill';

export const skillsRouter = createTRPCRouter({
 
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const skills = await ctx.db.skill.findMany({
        orderBy: { name: 'asc' },
      });
      return skills;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch skills. Please try again later.',
        cause: error, 
      });
    }
  }),

  add: publicProcedure
  .input(AddSkillSchema)
  .mutation(async ({ input, ctx }) => {
    const existingSkill = await ctx.db.skill.findUnique({
      where: { name: input.name },
    });
    if (existingSkill) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A skill with this name already exists.',
      });
    }
    
    return await ctx.db.skill.create({
      data: input,
    });
  }),




  edit: publicProcedure
    .input(UpdateSkillSchema)
    .mutation(async ({ input }) => {
      return await db.skill.update({
        where: { id: input.id },
        data: {
          name: input.name,
          category: input.category,
        },
      });
    }),


  delete: publicProcedure
    .input(DeleteSchema)
    .mutation(async ({ input }) => {
      return await db.skill.delete({
        where: { id: input.id },
      });
    }),
});
