"use client"
import { api } from "@/trpc/react";
import React from "react";

export default function page() {
  const { data } = api.goals.list.useQuery();
  console.log(data);
  return <div>page</div>;
}
