import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { skillsRouter } from "./routers/skills";
import { userRouter } from "@/server/api/routers/user";
import { userskillsRouter } from "./routers/userSkill";
import { goalsRouter } from "./routers/goals";

export const appRouter = createTRPCRouter({
  skills: skillsRouter,
  userSkills: userskillsRouter,
  goals:goalsRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
