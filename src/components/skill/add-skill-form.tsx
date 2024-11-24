"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddSkillSchema } from "@/utils/validators/skill";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

enum Category {
  SOFTSKILLS = "SOFTSKILLS",
  TECHNICAL = "TECHNICAL",
  LEADERSHIP = "LEADERSHIP",
  COMMUNICATION = "COMMUNICATION",
}

export const AddSkillForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof AddSkillSchema>>({
    resolver: zodResolver(AddSkillSchema),
    defaultValues: {
      name: "",
      category: "SOFTSKILLS",
    },
  });

  const { mutateAsync: addSkill, isPending } = api.skills.add.useMutation();

  const onSubmit = async (values: z.infer<typeof AddSkillSchema>) => {
    try {
      await addSkill(values);
      router.push("/dashboard/skills");
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Skill Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      className="select-class"
                    >
                      {Object.values(Category).map((category) => (
                        <option key={category} value={category}>
                          {category.toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
