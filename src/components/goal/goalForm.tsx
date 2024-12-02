"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
import { GoalFormSchema, UpdateGoalSchema } from "@/utils/validators/goal";
import { Textarea } from "@/components/ui/textarea";
import SkillBadge from "../skill/skillbadge";

interface AddGoalSheetProps {
  button: React.ReactNode;
  initialSkills?: {
    id: string;
    skillId: string;
    notes: string;
    desiredProficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  };
}

export function GoalForm({ button, initialSkills }: AddGoalSheetProps) {
  const trpcUtils = api.useUtils();
  const { toast } = useToast();
  const [predefinedSkills, setPredefinedSkills] = useState<Skill[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof GoalFormSchema>>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      skillId: "",
      notes: "",
      desiredProficiency: "BEGINNER",
    },
  });

  useEffect(() => {
    if (initialSkills) {
      reset({
        skillId: initialSkills.skillId,
        notes: initialSkills.notes,
        desiredProficiency: initialSkills.desiredProficiency,
      });
    }
  }, [initialSkills, reset]);

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

  const { mutateAsync: addGoal, isPending } = api.goals.add.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trpcUtils.goals.invalidate();
      toast({
        title: "Success",
        description: "Goal added successfully!",
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

  const { mutateAsync: updateGoal, isPending: isUpdating } =
    api.goals.edit.useMutation({
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        trpcUtils.goals.invalidate();
        toast({
          title: "Success",
          description: "Goal updated successfully!",
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

  const onSubmit = async (values: z.infer<typeof GoalFormSchema>) => {
    if (initialSkills) {
      await updateGoal({
        skillId: values?.skillId,
        id: initialSkills?.id,
        notes: values?.notes,
        desiredProficiency: values?.desiredProficiency,
      } as unknown as z.infer<typeof UpdateGoalSchema>);
    } else {
      await addGoal(values);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{initialSkills ? "Update Goal" : "Add Goal"}</SheetTitle>
          <SheetDescription>{!initialSkills && "Add Goal."}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-4">
          <div className="flex items-center space-x-4">
            <Select
              onValueChange={(value) =>
                setValue(`skillId`, value, {
                  shouldValidate: true,
                })
              }
              defaultValue={initialSkills?.skillId ?? ""}
            >
              <SelectTrigger className="w-[200px] overflow-hidden text-ellipsis">
                <SelectValue placeholder="Select Skill" />
              </SelectTrigger>
              <SelectContent>
                {predefinedSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    <div className="flex">
                      <span> {skill.name}</span>
                      <span className="ml-1">
                        <SkillBadge category={skill.category} />
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setValue(
                  `desiredProficiency`,
                  value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
                  { shouldValidate: true },
                )
              }
              defaultValue={initialSkills?.desiredProficiency ?? "BEGINNER"}
            >
              <SelectTrigger className="w-[180px] overflow-hidden text-ellipsis">
                <SelectValue placeholder="Proficiency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors?.skillId && (
            <p className="mt-1 text-sm text-red-500">
              {errors?.skillId?.message}
            </p>
          )}
          <div>
            <Textarea
              placeholder="Add notes..."
              {...register("notes")}
              className="w-full"
            />
          </div>
          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {initialSkills
              ? isUpdating
                ? "Updating..."
                : "Update Goal"
              : isPending
                ? "Submitting..."
                : "Submit Goal"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
