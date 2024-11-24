"use client";
import { api } from "@/trpc/react";
export default  function SkillsList() {
  const { data, isLoading, error } = api.skills.list.useQuery();

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Skills</h2>
      <ul>
        {data?.map((skill: any) => (
          <li key={skill.id}>
            {skill.name} - {skill.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
