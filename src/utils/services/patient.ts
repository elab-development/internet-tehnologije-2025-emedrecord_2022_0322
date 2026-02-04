import { db } from "@/lib/prisma";

export async function getPatientDashboardStatistics(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "No data found",
        data: null,
      };
    }

    const data = await db.patient.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        gender: true,
        img: true,
        colorCode: true,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Patient data not found",
        status: 200,
        data: null,
      };
    }

    const appointments = await db.appointment.findMany({
      where: { patient_id: data?.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            img: true,
            specialization: true,
            colorCode: true,
          },
        },
        patient: {
          select: {
            first_name: true,
            last_name: true,
            gender: true,
            date_of_birth: true,
            img: true,
            colorCode: true,
          },
        },
      },

      orderBy: { appointment_date: "desc" },
    });

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );
    const last5Records = appointments.slice(0, 5);

    const today = daysOfWeek[new Date().getDay()];

    const availableDoctor = await db.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        img: true,
        working_days: true,
        colorCode: true,
      },
      where: {
        working_days: {
          some: {
            day: {
              equals: today,
              mode: "insensitive",
            },
          },
        },
      },
      take: 4,
    });

    return {
      success: true,
      data,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments.length,
      availableDoctor,
      monthlyData,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await db.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 200,
        data: null,
      };
    }

    return { success: true, data: patient, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
