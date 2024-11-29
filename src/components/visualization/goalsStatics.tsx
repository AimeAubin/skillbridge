"use client";
import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { api } from "@/trpc/react";
import { Goal, TargetIcon } from "lucide-react";

export default function GoalsStatics() {
  const { data: goals } = api.goals.list.useQuery();

  const { totalGoals, activeGoals, completedGoals } = useMemo(() => {
    if (!goals) return { totalGoals: 0, activeGoals: 0, completedGoals: 0 };

    const totalGoals = goals.length;
    const activeGoals = goals.filter((goal) => goal.status === "ACTIVE").length;
    const completedGoals = goals.filter(
      (goal) => goal.status === "COMPLETED",
    ).length;

    return { totalGoals, activeGoals, completedGoals };
  }, [goals]);

  return (
    <div className="flex gap-6">
      <Card className="flex w-[50%] justify-start overflow-hidden 2xl:w-[33%]">
        <div className="h-full w-3 bg-blue-500"></div>
        <CardHeader className="p-10">
          <TargetIcon className="h-20 w-20 text-blue-500" />
        </CardHeader>
        <CardContent className="ml-auto grid gap-2 p-10">
          <h1 className="text-[18px] text-gray-500">Total</h1>
          <span className="text-center text-[36px] font-bold">
            {totalGoals}
          </span>
        </CardContent>
      </Card>
      <Card className="flex w-[50%] justify-start overflow-hidden 2xl:w-[33%]">
        <div className="h-full w-3 bg-yellow-500"></div>
        <CardHeader className="p-10">
          <TargetIcon className="h-20 w-20 text-yellow-500" />
        </CardHeader>
        <CardContent className="ml-auto grid gap-2 p-10">
          <h1 className="text-[18px] text-gray-500">Active</h1>
          <span className="text-center text-[36px] font-bold">
            {activeGoals}
          </span>
        </CardContent>
      </Card>
      <Card className="flex w-[50%] justify-start overflow-hidden 2xl:w-[33%]">
        <div className="h-full w-3 bg-green-500"></div>
        <CardHeader className="p-10">
          <Goal className="h-20 w-20 text-green-500" />
        </CardHeader>
        <CardContent className="ml-auto grid gap-2 p-10">
          <h1 className="text-[18px] text-gray-500">Completed</h1>
          <span className="text-center text-[36px] font-bold">
            {completedGoals}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
