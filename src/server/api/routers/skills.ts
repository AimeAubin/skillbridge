import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Category } from '@prisma/client';
import { db } from '@/server/db';

export const skillsRouter = createTRPCRouter({
 
  list: publicProcedure.query(async ({ctx}) => {
    return await ctx.db.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }),


  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Skill name is required'),
        category: z.nativeEnum(Category, { errorMap: () => ({ message: 'Category is required' }) }),
      })
    )
    .mutation(async ({ input }) => {
      return await db.skill.create({
        data: input,
      });
    }),


  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Skill name is required'),
        category: z.nativeEnum(Category, { errorMap: () => ({ message: 'Category is required' }) }),
      })
    )
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
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.skill.delete({
        where: { id: input.id },
      });
    }),
});
