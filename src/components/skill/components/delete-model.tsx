import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DrawerClose } from "@/components/ui/drawer";

interface DeleteProps {
  button: React.ReactNode;
  onDelete: () => void;
  isPending?: boolean;
}

export default function DeleteModel({
  button,
  onDelete,
  isPending,
}: DeleteProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Delete Skill</DialogTitle>
          <DialogDescription className="pt-5 text-center">
            Are you sure you want to delete this skill?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-3">
          <Button
            variant="destructive"
            type="submit"
            className="w-full"
            onClick={() => onDelete()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
