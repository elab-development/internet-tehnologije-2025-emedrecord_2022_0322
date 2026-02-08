"use server";

import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";


export async function deleteDataById(
  id: string,

  deleteType: "doctor" | "staff" | "patient"
) {
  try {
    switch (deleteType) {
      case "doctor":
        await db.doctor.delete({ where: { id: id } });
        break;
      case "staff":
        await db.staff.delete({ where: { id: id } });
        break;
      case "patient":
        await db.patient.delete({ where: { id: id } });
        break;
    }

    if (
      deleteType === "staff" ||
      deleteType === "patient" ||
      deleteType === "doctor"
    ) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(id);
      } catch (clerkError) {
        console.log("Clerk user deletion failed:", clerkError);
        return {
          success: true,
          message: "Record deleted successfully",
          status: 200,
        };
      }
    }

    return {
      success: true,
      message: "Data deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}


