"use client";

import { assignExistingNurseToDoctor } from "@/app/actions/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomInput } from "../custom-input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";

const AssignNurseSchema = z.object({
  nurse_id: z.string().min(1, "Select nurse"),
});

type AssignNurseData = z.infer<typeof AssignNurseSchema>;

interface AssignExistingNurseDialogProps {
  nurses: {
    id: string;
    name: string;
    email: string;
  }[];
}

export const AssignExistingNurseDialog = ({
  nurses,
}: AssignExistingNurseDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AssignNurseData>({
    resolver: zodResolver(AssignNurseSchema),
    defaultValues: {
      nurse_id: "",
    },
  });

  const selectList = nurses.map((nurse) => ({
    label: `${nurse.name} (${nurse.email})`,
    value: nurse.id,
  }));

  const handleSubmit = async (values: AssignNurseData) => {
    try {
      setIsLoading(true);
      const response = await assignExistingNurseToDoctor(values.nurse_id);

      if (response.success) {
        toast.success(response.msg);
        form.reset();
        router.refresh();
      } else {
        toast.error(response.msg || "Failed to assign nurse");
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
        <Button variant="outline" disabled={nurses.length === 0}>
          <LinkIcon size={16} />
          Assign Existing Nurse
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Existing Nurse</DialogTitle>
          <DialogDescription>
            Select an active unassigned nurse from database and attach her to your account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <CustomInput
              type="select"
              control={form.control}
              name="nurse_id"
              label="Available Nurses"
              placeholder="Select nurse"
              selectList={selectList}
            />

            <Button type="submit" className="w-full" disabled={isLoading || nurses.length === 0}>
              {isLoading ? "Assigning..." : "Assign Nurse"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
