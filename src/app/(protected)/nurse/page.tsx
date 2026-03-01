import { ProfileImage } from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const NurseHomePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const nurse = await db.staff.findUnique({
    where: { id: userId },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
          department: true,
          email: true,
          phone: true,
          img: true,
          colorCode: true,
        },
      },
    },
  });

  return (
    <div className="w-full p-3 md:p-6 space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Nurse Dashboard</CardTitle>
          <CardDescription>
            Overview of your profile and assigned doctor.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <ProfileImage
              url={nurse?.img || undefined}
              name={nurse?.name || "Nurse"}
              bgColor={nurse?.colorCode || "#2563eb"}
              className="size-14 md:size-16"
              textClassName="text-xl"
            />

            <div>
              <h2 className="text-xl font-semibold uppercase">
                {nurse?.name || "Nurse profile"}
              </h2>
              <p className="text-sm text-gray-600">{nurse?.email || "No email"}</p>
              <p className="text-sm text-gray-500">Role: {nurse?.role || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nurse Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Phone:</span> {nurse?.phone || "N/A"}
                </p>
                <p>
                  <span className="text-gray-500">Department:</span> {nurse?.department || "N/A"}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span> {nurse?.status || "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned Doctor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {nurse?.doctor ? (
                  <>
                    <p>
                      <span className="text-gray-500">Name:</span> Dr. {nurse.doctor.name}
                    </p>
                    <p>
                      <span className="text-gray-500">Specialization:</span> {nurse.doctor.specialization}
                    </p>
                    <p>
                      <span className="text-gray-500">Department:</span> {nurse.doctor.department || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span> {nurse.doctor.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span> {nurse.doctor.phone}
                    </p>
                  </>
                ) : (
                  <p className="text-amber-600">
                    You are currently not assigned to a doctor. Ask admin/doctor to assign you.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href="/record/appointments">View Appointments</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/record/patients">View Patients</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/record/billing">View Billing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NurseHomePage;
