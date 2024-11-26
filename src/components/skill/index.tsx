"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSkills } from "./user-skills";
import { PredefinedSkills } from "./predefined-skills";

export const Skills = () => {
  return (
    <Tabs defaultValue="my-skills" className="w-100%">
      <TabsList>
        <TabsTrigger value="my-skills">My Skill(s)</TabsTrigger>
        <TabsTrigger value="predefined-skills">Predefined Skills</TabsTrigger>
      </TabsList>
      <div className="m-16">
        <TabsContent value="my-skills">
          <UserSkills />
        </TabsContent>
        <TabsContent value="predefined-skills">
          <PredefinedSkills />
        </TabsContent>
      </div>
    </Tabs>
  );
};
