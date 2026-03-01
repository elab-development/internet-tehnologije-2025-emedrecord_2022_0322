"use client";

import { unassignNurseFromDoctor } from "@/app/actions/admin";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const UnassignNurseDialog = ({
  nurseId,
  nurseName,
}: {
  nurseId: string;
  nurseName: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUnassign = async () => {
    try {
      setIsLoading(true);
      const response = await unassignNurseFromDoctor(nurseId);

      if (response.success) {
        toast.success(response.msg);
        router.refresh();
      } else {
        toast.error(response.msg || "Failed to unassign nurse");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs font-light">
          Unassign
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unassign Nurse</DialogTitle>
          <DialogDescription>
            Are you sure you want to unassign {nurseName} from your team?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={handleUnassign}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive"
          >
            {isLoading ? "Unassigning..." : "Confirm Unassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
