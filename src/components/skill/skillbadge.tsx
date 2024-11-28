import React from "react";
import { cn } from "@/lib/utils"; 

interface SkillBadgeProps {
  category: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ category }) => {
  const categoryColors: Record<string, string> = {
    SOFTSKILLS: "bg-green-100 text-green-800",
    TECHNICAL: "bg-blue-100 text-blue-800",
    LEADERSHIP: "bg-yellow-100 text-yellow-800",
    COMMUNICATION: "bg-pink-100 text-pink-800",
  };

  const colorClass = categoryColors[category.toUpperCase()] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={cn(
        "px-2 py-1 text-sm font-medium rounded-xl capitalize",
        colorClass
      )}
    >
      {category.toLowerCase()}
    </span>
  );
};

export default SkillBadge;
