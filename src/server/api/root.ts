import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { skillsRouter } from "./routers/skills";
import { userRouter } from "@/server/api/routers/user";
import { userskillsRouter } from "./routers/userSkill";

export const appRouter = createTRPCRouter({
  skills: skillsRouter,
  userSkills: userskillsRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
