import { getServices } from "@/utils/services/admin";
import { db } from "@/lib/prisma";
import { ServicesSchema } from "@/lib/schema";
import { sanitizePayload } from "@/lib/security";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getRole } from "@/utils/roles";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await getServices();

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const role = await getRole();

  if (role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = ServicesSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = sanitizePayload(validated.data);

    const service = await db.services.create({
      data: { ...data, price: Number(data.price) },
    });

    return NextResponse.json(
      { success: true, message: "Service created successfully", data: service },
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
