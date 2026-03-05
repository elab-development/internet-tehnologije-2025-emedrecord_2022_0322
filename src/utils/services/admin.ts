import { db } from "@/lib/prisma";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStats() {
  try {
    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [totalPatient, totalDoctors, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                last_name: true,
                first_name: true,
                img: true,
                colorCode: true,
                gender: true,
                date_of_birth: true,
              },
            },
            doctor: {
              select: {
                name: true,
                img: true,
                colorCode: true,
                specialization: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: {
            working_days: {
              some: { day: { equals: today, mode: "insensitive" } },
            },
          },
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            colorCode: true,
          },
          take: 5,
        }),
      ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments.slice(0, 5);

    return {
      success: true,
      totalPatient,
      totalDoctors,
      appointmentCounts,
      availableDoctors: doctors,
      monthlyData,
      last5Records,
      totalAppointments: appointments.length,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
      totalPatient: 0,
      totalDoctors: 0,
      appointmentCounts: {
        PENDING: 0,
        SCHEDULED: 0,
        COMPLETED: 0,
        CANCELLED: 0,
      },
      availableDoctors: [],
      monthlyData: [],
      last5Records: [],
      totalAppointments: 0,
      status: 500,
    };
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { service_name: "asc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}