import { getDoctorById } from "@/utils/services/doctor";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getDoctorById(id);

  if (!result.data) {
    return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, ...result });
}
