import { z } from "zod";

export const GoalFormSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  desiredProficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  notes: z.string(),
});

export const UpdateGoalSchema = z.object({
  id: z.string().min(1, "Goal ID is required"),
  skillId: z.string().min(1, "Skill is required"),
  notes: z.string(),
  desiredProficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});
