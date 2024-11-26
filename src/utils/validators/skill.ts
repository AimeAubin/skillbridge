import { z } from "zod";
import { Category } from "@prisma/client";

export const AddSkillSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Skill name is required" })
    .max(50, { message: "Skill name must not exceed 50 characters" }),
  category: z.nativeEnum(Category).default(Category.SOFTSKILLS),
});

export const UpdateSkillSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
  name: z
    .string()
    .min(1, { message: "Skill name is required" })
    .max(50, { message: "Skill name must not exceed 50 characters" }),
  category: z.nativeEnum(Category).default(Category.SOFTSKILLS),
});

export const UserSkillFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  skills: z
    .array(
      z.object({
        skillId: z.string().min(1, "Skill is required"),
        proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
      }),
    )
    .min(1, "At least one skill is required"),
});

export const UpdateUserSkillSchema = z.object({
  id: z.string().min(1, "UserSkill ID is required"),
  userId: z.string(),
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export const DeleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});
