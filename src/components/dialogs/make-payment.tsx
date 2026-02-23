"use client";

import { makePayment } from "@/app/actions/medical";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const PaymentFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(["CASH", "CARD"]),
});

type PaymentFormData = z.infer<typeof PaymentFormSchema>;

interface MakePaymentProps {
  paymentId: number;
  totalPayable: number;
  amountPaid: number;
}

export const MakePaymentDialog = ({
  paymentId,
  totalPayable,
  amountPaid,
}: MakePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const remainingAmount = totalPayable - amountPaid;

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      amount: remainingAmount,
      paymentMethod: "CASH",
    },
  } as any) as ReturnType<typeof useForm<PaymentFormData>>;

  const handleOnSubmit = async (values: PaymentFormData) => {
    try {
      setIsLoading(true);

      const resp = await makePayment({
        paymentId,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });

      if (resp.success) {
        toast.success(resp.msg);
        setOpen(false);
        router.refresh();
        form.reset();
      } else {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (remainingAmount <= 0) {
    return (
      <span className="text-sm text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded">
        Fully Paid
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm font-normal">
          <CreditCard size={18} className="text-gray-500 mr-1" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for this bill. Remaining: ${remainingAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Payable</span>
                <p className="text-lg font-semibold">${totalPayable.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Already Paid</span>
                <p className="text-lg font-semibold text-emerald-600">
                  ${amountPaid.toFixed(2)}
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      max={remainingAmount}
                      placeholder={`Max: ${remainingAmount.toFixed(2)}`}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600">
              {isLoading ? "Processing..." : "Confirm Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
