"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/trpc/react"

const chartConfig = {
  desktop: {
    label: "Proficiency Level",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const proficiencyMapping = {
  BEGINNER: 25,
  INTERMEDIATE: 60,
  ADVANCED: 100,
};

export function Chart() {

  const { data: userSkills, isLoading, error } = api.userSkills.list.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartData =
  userSkills?.map((userSkill) => ({
    skill: userSkill.skill.name,
    proficiencyLevel: proficiencyMapping[userSkill.proficiencyLevel] ?? 0, 
    proficiencyName: userSkill.proficiencyLevel, 
  })) ?? [];

  return (
    <Card className="w-[50%] 2xl:w-[70%]">
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Skills</CardTitle>
        <CardDescription>
          Showing skills proficiency level 
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[350px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            <Radar
              dataKey="proficiencyLevel"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


