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
import { AddUserSkillSchema } from "@/utils/validators/skill";

export function AddUserSkill() {
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
  } = useForm<z.infer<typeof AddUserSkillSchema>>({
    resolver: zodResolver(AddUserSkillSchema),
    defaultValues: {
      userId: "",
      skills: [
        {
          skillId: "",
          proficiencyLevel: "BEGINNER",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const { data: skillData } = api.skills.list.useQuery();
  useEffect(() => {
    if (skillData) {
      setPredefinedSkills(skillData);
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

  const onSubmit = async (values: z.infer<typeof AddUserSkillSchema>) => {
    addSkill(values);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus /> Add Skill(s) To My Skills
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Skill(s) To My Skills</SheetTitle>
          <SheetDescription>
            Add one or more skills to your current skills. Click submit when
            you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-12">
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
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {errors.skills?.[index]?.skillId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.skills[index]?.skillId?.message}
                </p>
              )}
            </div>
          ))}

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
          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Skill(s)"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
