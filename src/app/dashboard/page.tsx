import { RecentlyAddedSkills } from "@/components/skill/recentlyAddedSkills";
import { Visualization } from "@/components/skill/visualization";

export default function Page() {
  return (
    <div className="flex  gap-3 mt-12">
      <Visualization />
      <RecentlyAddedSkills />
    </div>
  );
}
