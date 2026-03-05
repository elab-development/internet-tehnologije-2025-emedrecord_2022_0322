import { getAppointmentById } from "@/utils/services/appointment";
import { db } from "@/lib/prisma";
import { sanitizePayload } from "@/lib/security";
import { auth } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getAppointmentById(Number(id));

  return NextResponse.json(result, { status: result.status || 200 });
}

const VALID_STATUSES: AppointmentStatus[] = ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, reason } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status. Must be one of: PENDING, SCHEDULED, CANCELLED, COMPLETED" },
        { status: 400 }
      );
    }

    const appointment = await db.appointment.findUnique({
      where: { id: Number(id) },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
    }

    const updated = await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason: reason ? sanitizePayload(reason) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
