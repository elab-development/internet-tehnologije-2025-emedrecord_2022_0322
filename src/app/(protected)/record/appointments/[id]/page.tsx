import { AppointmentDetails } from "@/components/appointment/appointment-details";
import AppointmentQuickLinks from "@/components/appointment/appointment-quick-links";
import { BillsContainer } from "@/components/appointment/bills-container";
import ChartContainer from "@/components/appointment/chart-container";
import { DiagnosisContainer } from "@/components/appointment/diagnosis-container";
import { PatientDetailsCard } from "@/components/appointment/patient-details-card";
import { PaymentsContainer } from "@/components/appointment/payment-container";
import { VitalSigns } from "@/components/appointment/vital-signs";
import { MedicalHistoryContainer } from "@/components/medical-history-container";
import { nurseCanAccessAppointment } from "@/lib/permissions";
import { getAppointmentWithMedicalRecordsById } from "@/utils/services/appointment";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AppointmentDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { id } = await params;
  const search = await searchParams;
  const cat = (search?.cat as string) || "charts";
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data } = await getAppointmentWithMedicalRecordsById(Number(id));

  if (!data) {
    redirect("/record/appointments");
  }

  const isAdmin = await checkRole("ADMIN");
  const isDoctor = await checkRole("DOCTOR");
  const isNurse = await checkRole("NURSE");
  const isPatient = await checkRole("PATIENT");

  if (
    !isAdmin &&
    !(isDoctor && data?.doctor_id === userId) &&
    !(isPatient && data?.patient_id === userId) &&
    !(isNurse && (await nurseCanAccessAppointment(userId, Number(id))))
  ) {
    redirect("/record/appointments");
  }

  return (
    <div className="flex p-6 flex-col-reverse lg:flex-row w-full min-h-screen gap-10">
      {/* LEFT */}
      <div className="w-full lg:w-[65%] flex flex-col gap-6">
        {cat === "charts" && <ChartContainer id={data?.patient_id!} />}
        {cat === "appointments" && (
          <>
            <AppointmentDetails
              id={data?.id!}
              patient_id={data?.patient_id!}
              appointment_date={data?.appointment_date!}
              time={data?.time!}
              notes={data?.note!}
            />

            <VitalSigns
              id={id}
              patientId={data?.patient_id!}
              doctorId={data?.doctor_id!}
            />
          </>
        )}
        {cat === "diagnosis" && (
          <DiagnosisContainer
            id={id}
            patientId={data?.patient_id!}
            doctorId={data?.doctor_id!}
          />
        )}
        {cat === "medical-history" && (
          <MedicalHistoryContainer id={id!} patientId={data?.patient_id!} />
        )}
        {cat === "bills" && <BillsContainer id={id} />}
        {cat === "payments" && (
          <PaymentsContainer patientId={data?.patient_id!} />
        )}
      </div>
      {/* RIGHT */}
      <div className="flex-1 space-y-6">
        <AppointmentQuickLinks staffId={data?.doctor_id as string} />
        <PatientDetailsCard data={data?.patient!} />
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
