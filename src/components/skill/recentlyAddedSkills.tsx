"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkillBadge from "./components/skillbadge";

export function RecentlyAddedSkills() {
  const { data: skills } = api?.userSkills?.list.useQuery();
  const recentSkills = skills ? skills?.slice(0, 5) : [];
  return (
      <Card className="w-[50%] 2xl:w-[30%]">
        <CardHeader>
          <CardTitle>Recently Added Skills</CardTitle>
          <CardDescription>Showing 5 recently added skills</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>proficiency Level</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSkills.map((skill, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex">
                      <span className="mr-3 h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      {skill?.skill?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {skill?.proficiencyLevel?.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <SkillBadge category={skill?.skill.category} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
