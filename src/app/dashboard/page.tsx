import { RecentlyAddedSkills } from "@/components/visualization/recentlyAddedSkills";
import { Chart } from "@/components/visualization/chart";
import GoalsStatics from "@/components/visualization/goalsStatics";
import { Separator } from "@/components/ui/separator";

export default async function Dashboard() {
  return (
    <div className="m-5">
      <div className="mb-6 flex gap-6">
        <Chart />
        <RecentlyAddedSkills />
      </div>
      <Separator />
      <h1 className="mt-6 font-[550] text-[20px]">Goals Overview</h1>
      <div className="mt-6">
        <GoalsStatics />
      </div>
    </div>
  );
}
