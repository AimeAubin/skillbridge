"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";

export const Social = () => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button size="lg" className="w-full" variant="outline">
        <FaGoogle className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline">
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
