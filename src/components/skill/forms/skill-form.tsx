"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddSkillSchema } from "@/utils/validators/skill";
import SkillBadge from "../skillbadge";

interface SkillsSheetProps {
  button: React.ReactNode;
  initialSkills?: {
    id: string;
    name: string;
    category: "SOFTSKILLS" | "TECHNICAL" | "LEADERSHIP" | "COMMUNICATION";
  };
}

const skillCategories = [
  { value: "SOFTSKILLS", label: "Softskills" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "LEADERSHIP", label: "Leadership" },
  { value: "COMMUNICATION", label: "Communication" },
];

export function SkillForm({ button, initialSkills }: SkillsSheetProps) {
  const trpcUtils = api.useUtils();
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof AddSkillSchema>>({
    resolver: zodResolver(AddSkillSchema),
    defaultValues: {
      name: initialSkills?.name ?? "",
      category: initialSkills?.category ?? "SOFTSKILLS",
    },
  });

  const { mutateAsync: addSkill, isPending } = api.skills.add.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trpcUtils.skills.invalidate();
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
    api.skills.edit.useMutation({
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        trpcUtils.skills.invalidate();
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

  const onSubmit = async (values: z.infer<typeof AddSkillSchema>) => {
    if (initialSkills) {
      await updateSkill({
        id: initialSkills.id ?? "",
        name: values.name,
        category: values.category,
      });
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
            {initialSkills ? " Update Skill" : "Add Skill"}
          </SheetTitle>
          <SheetDescription>
            {!initialSkills && "Add skill to the current predefined skills."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-4">
          <div>
            <Input
              placeholder="Name..."
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Select
              onValueChange={(value) =>
                setValue(
                  "category",
                  value as
                    | "SOFTSKILLS"
                    | "TECHNICAL"
                    | "LEADERSHIP"
                    | "COMMUNICATION",
                  { shouldValidate: true },
                )
              }
              value={initialSkills?.category ?? getValues("category")}
            >
              <SelectTrigger className="w-full overflow-hidden text-ellipsis">
                <SelectValue placeholder="Proficiency Level">
                  <SkillBadge category={getValues("category")} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <SkillBadge category={category.label} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {initialSkills
              ? isUpdating
                ? "Updating..."
                : "Update Skill"
              : isPending
                ? "Submitting..."
                : "Submit Skill"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
