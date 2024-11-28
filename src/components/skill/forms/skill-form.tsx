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

export function SkillForm({ button, initialSkills }: SkillsSheetProps) {
  const trpcUtils = api.useUtils();
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof AddSkillSchema>>({
    resolver: zodResolver(AddSkillSchema),
    defaultValues: {
      name: "",
      category: "SOFTSKILLS",
    },
  });

  useEffect(() => {
    if (initialSkills) {
      reset({
        name: initialSkills.name,
        category: initialSkills.category,
      });
    }
  }, [initialSkills, reset]);

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
              defaultValue={initialSkills?.category ?? "SOFTSKILLS"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Proficiency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOFTSKILLS">
                  <SkillBadge category={"Softskills"} />
                </SelectItem>
                <SelectItem value="TECHNICAL">
                  <SkillBadge category={"Technical"} />
                </SelectItem>
                <SelectItem value="LEADERSHIP">
                  <SkillBadge category={"Leadership"} />
                </SelectItem>
                <SelectItem value="COMMUNICATION">
                  <SkillBadge category={"Communication"} />
                </SelectItem>
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
