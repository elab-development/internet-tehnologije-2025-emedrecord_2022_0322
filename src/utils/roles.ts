import { Roles } from "@/types/globals";
import { db } from "@/lib/prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

const syncClerkRole = async (userId: string, role: string) => {
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });
  } catch (error) {
    console.log("Failed to sync clerk role metadata", error);
  }
};

const resolveAndSyncNurseRole = async (userId: string) => {
  const staffById = await db.staff.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (staffById?.role === "NURSE" && staffById.status === "ACTIVE") {
    await syncClerkRole(userId, "nurse");
    return "nurse";
  }

  const user = await currentUser();
  const email =
    user?.emailAddresses.find(
      (mail) => mail.id === user.primaryEmailAddressId
    )?.emailAddress || user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return "patient";
  }

  const staffByEmail = await db.staff.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
      role: "NURSE",
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!staffByEmail) {
    return "patient";
  }

  if (staffByEmail.id !== userId) {
    const currentUserStaff = await db.staff.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!currentUserStaff) {
      await db.staff.update({
        where: { id: staffByEmail.id },
        data: { id: userId },
      });
    }
  }

  await syncClerkRole(userId, "nurse");
  return "nurse";
};

export const checkRole = async (role: Roles) => {
  const currentRole = await getRole();
  return currentRole === role.toLowerCase();
};

export const getRole = async () => {
  const { sessionClaims, userId } = await auth();

  if (!userId) {
    return "patient";
  }

  const roleFromClaims =
    typeof sessionClaims?.metadata?.role === "string"
      ? sessionClaims.metadata.role.toLowerCase()
      : "";

  if (roleFromClaims) {
    return roleFromClaims;
  }

  return resolveAndSyncNurseRole(userId);
};

export const getNurseDoctorId = async (userId?: string) => {
  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const authData = await auth();
    resolvedUserId = authData.userId || undefined;
  }

  if (!resolvedUserId) {
    return null;
  }

  const staff = await db.staff.findFirst({
    where: {
      id: resolvedUserId,
      role: "NURSE",
      status: "ACTIVE",
    },
    select: {
      doctor_id: true,
    },
  });

  return staff?.doctor_id || null;
};
