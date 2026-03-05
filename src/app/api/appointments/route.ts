import { getPatientAppointments } from "@/utils/services/appointment";
import { db } from "@/lib/prisma";
import { AppointmentSchema } from "@/lib/schema";
import { sanitizePayload } from "@/lib/security";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;

  const result = await getPatientAppointments({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
    search: searchParams.get("search") || "",
    id: searchParams.get("patient_id") || searchParams.get("doctor_id") || undefined,
  });

  return NextResponse.json(result, { status: result.status || 200 });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = AppointmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = sanitizePayload(validated.data);

    const appointment = await db.appointment.create({
      data: {
        patient_id: body.patient_id,
        doctor_id: data.doctor_id,
        time: data.time,
        type: data.type,
        appointment_date: new Date(data.appointment_date),
        note: data.note,
      },
    });

    return NextResponse.json(
      { success: true, message: "Appointment created successfully", data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
