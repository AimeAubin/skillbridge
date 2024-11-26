"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  INTERMEDIATE: 50,
  ADVANCED: 100,
};

export function Visualization() {

  const userId = "nahajajJsnjijhs"; 
  const { data: userSkills, isLoading, error } = api.userSkills.list.useQuery(
    { userId },
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartData = userSkills?.map((userSkill) => ({
    skill: userSkill.skill.name,
    proficiencyLevel: proficiencyMapping[userSkill.proficiencyLevel] ?? 0,
  })) ?? [];

  console.log("chart",chartData);
console.log("userSkills",userSkills);

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Dots</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
