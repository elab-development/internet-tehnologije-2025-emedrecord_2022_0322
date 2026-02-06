"use client";
import { AppointmentSchema } from '@/lib/schema';
import { generateTimes } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctor, Patient } from '@prisma/client'
import { UserPen } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Sheet, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

export const BookAppointment = ({
  data,
  doctors,
}: {
  data: Patient;
  doctors: Doctor[];
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [physicians, setPhysicians] = useState<Doctor[] | undefined>(doctors);

  const appointmentTimes = generateTimes(8, 17, 30);

  const form = useForm<z.infer<typeof AppointmentSchema>>({
  resolver: zodResolver(AppointmentSchema),
  defaultValues: {
    doctor_id: "",
    appointment_date: "",
    time: "",
    type: "",
    note: "",
  },
});

const onSubmit = () => {};

return (
  <Sheet>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 justify-start text-sm font-light bg-blue-600 text-white"
      >
        <UserPen size={16} /> Book Appointment
      </Button>
    </SheetTrigger>
  </Sheet>
);
};