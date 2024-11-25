"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Skill } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  UserSkillFormSchema,
  UpdateUserSkillSchema,
} from "@/utils/validators/skill";

interface AddSkillsSheetProps {
  button: React.ReactNode;
  initialSkills?: {
    id: string;
    skillName: string;
    skillId: string;
    proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  }[];
}

export function UserSkillForm({ button, initialSkills }: AddSkillsSheetProps) {
  const trpcUtils = api.useUtils();
  const { toast } = useToast();
  const [predefinedSkills, setPredefinedSkills] = useState<Skill[]>([]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof UserSkillFormSchema>>({
    resolver: zodResolver(UserSkillFormSchema),
    defaultValues: {
      userId: "",
      skills:
        (initialSkills?.length ?? 0) > 0
          ? initialSkills
          : [{ skillId: "", proficiencyLevel: "BEGINNER" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const { data: skillData } = api.skills.list.useQuery();
  useEffect(() => {
    if (skillData) {
      setPredefinedSkills(
        skillData.map((skill) => ({
          ...skill,
          createdAt: skill.createdAt.toISOString(),
          updatedAt: skill.updatedAt.toISOString(),
        })),
      );
    }
  }, [skillData]);
  const { mutateAsync: addSkill, isPending } = api.userSkills.add.useMutation({
    onSuccess: () => {
      trpcUtils.userSkills.invalidate();
      toast({
        title: "Success",
        description: "Skills added successfully!",
      });
      reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { mutateAsync: updateSkill, isPending: isUpdating } =
    api.userSkills.edit.useMutation({
      onSuccess: () => {
        trpcUtils.userSkills.invalidate();
        toast({
          title: "Success",
          description: "Skills updated successfully!",
        });
        reset();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });

  const onSubmit = async (values: z.infer<typeof UserSkillFormSchema>) => {
    if (initialSkills) {
      if (initialSkills.length > 0) {
        await updateSkill({
          userId: values.userId,
          skillId: values.skills[0]?.skillId,
          id: initialSkills[0]?.id,
          proficiencyLevel: values?.skills[0]?.proficiencyLevel,
        } as unknown as z.infer<typeof UpdateUserSkillSchema>);
      }
    } else {
      await addSkill(values);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {initialSkills ? "Update Skill" : "Add Skill(s) To My Skills"}
          </SheetTitle>
          <SheetDescription>
            {!initialSkills && "Add one or more skills to your current skills."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-4">
          <div>
            <Input
              placeholder="User ID"
              {...register("userId")}
              className="w-full"
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.userId.message}
              </p>
            )}
          </div>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="flex items-center space-x-4">
                <Select
                  onValueChange={(value) =>
                    setValue(`skills.${index}.skillId`, value, {
                      shouldValidate: true,
                    })
                  }
                  defaultValue={field.skillId || ""}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      `skills.${index}.proficiencyLevel`,
                      value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
                      { shouldValidate: true },
                    )
                  }
                  defaultValue={field.proficiencyLevel}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Proficiency Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {!initialSkills && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.skills?.[index]?.skillId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.skills[index]?.skillId?.message}
                </p>
              )}
            </div>
          ))}

          {!initialSkills && (
            <Button
              type="button"
              onClick={() =>
                append({ skillId: "", proficiencyLevel: "BEGINNER" })
              }
              className="w-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          )}
          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {initialSkills
              ? isUpdating
                ? "Updating..."
                : "Update Skill"
              : isPending
                ? "Submitting..."
                : "Submit Skill(s)"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
