"use server";

import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import { nurseCanAccessAppointment } from "@/lib/permissions";
import {db} from "@/lib/prisma";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { getAppointmentWeatherSummary } from "@/utils/services/weather";
import { checkRole, getNurseDoctorId } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";

export async function createNewAppointment(data: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isNurse = await checkRole("NURSE");
    const isPatient = await checkRole("PATIENT");

    if (!isAdmin && !isDoctor && !isNurse && !isPatient) {
      return { success: false, msg: "Unauthorized" };
    }

    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, msg: "Invalid data" };
    }
    const validated = validatedData.data;

    if (isDoctor && validated.doctor_id !== userId) {
      return { success: false, msg: "Unauthorized" };
    }

    if (isNurse) {
      const nurseDoctorId = await getNurseDoctorId(userId);

      if (!nurseDoctorId || validated.doctor_id !== nurseDoctorId) {
        return {
          success: false,
          msg: "You are not assigned to this doctor",
        };
      }
    }

    if (isPatient && data.patient_id !== userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const appointmentDate = new Date(validated.appointment_date);

    await db.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: validated.doctor_id,
        time: validated.time,
        type: validated.type,
        appointment_date: appointmentDate,
        note: validated.note,
      },
    });

    const weatherSummary = await getAppointmentWeatherSummary(
      appointmentDate,
      validated.time
    );

    return {
      success: true,
      message: "Appointment booked successfully",
      weatherSummary,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
export async function appointmentAction(
  id: string | number,

  status: AppointmentStatus,
  reason: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isNurse = await checkRole("NURSE");
    const isPatient = await checkRole("PATIENT");

    const appointment = await db.appointment.findUnique({
      where: { id: Number(id) },
      select: {
        patient_id: true,
        doctor_id: true,
      },
    });

    if (!appointment) {
      return { success: false, msg: "Appointment not found" };
    }

    if (
      !isAdmin &&
      !(isDoctor && appointment.doctor_id === userId) &&
      !(isPatient && appointment.patient_id === userId) &&
      !(isNurse && (await nurseCanAccessAppointment(userId, Number(id))))
    ) {
      return { success: false, msg: "Unauthorized" };
    }

    await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addVitalSigns(
  data: VitalSignsFormData,
  appointmentId: string,
  doctorId: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isNurse = await checkRole("NURSE");

    if (!isAdmin && !isDoctor && !isNurse) {
      return { success: false, msg: "Unauthorized" };
    }

    if (isDoctor && doctorId !== userId) {
      return { success: false, msg: "Unauthorized" };
    }

    if (isNurse) {
      const hasAccess = await nurseCanAccessAppointment(userId, Number(appointmentId));

      if (!hasAccess) {
        return {
          success: false,
          msg: "You are not assigned to this appointment",
        };
      }
    }

    const validatedData = VitalSignsSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          appointment_id: Number(appointmentId),
          doctor_id: doctorId,
        },
      });
    }

    const med_id = validatedData.medical_id || medicalRecord?.id;

    await db.vitalSigns.create({
      data: {
        ...validatedData,
        medical_id: Number(med_id!),
      },
    });

    return {
      success: true,
      msg: "Vital signs added successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}