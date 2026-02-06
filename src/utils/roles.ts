import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  return sessionClaims?.metadata?.role?.toLowerCase() === role.toLowerCase();
};

export const getRole = async () => {
  const { sessionClaims } = await auth();

  // Add temporary logging to debug
  console.log("Session Claims:", sessionClaims);
  console.log("Metadata:", sessionClaims?.metadata);

  const role = sessionClaims?.metadata?.role?.toLowerCase() || "patient";

  return role;
};
