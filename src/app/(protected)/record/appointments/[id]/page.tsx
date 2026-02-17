import { AppointmentContainer } from "@/components/appointment-container";
import { AppointmentDetails } from "@/components/appointment/appointment-details";
import AppointmentQuickLinks from "@/components/appointment/appointment-quick-links";
import ChartContainer from "@/components/appointment/chart-container";
import { PatientDetailsCard } from "@/components/appointment/patient-details-card";
import { VitalSigns } from "@/components/appointment/vital-signs";
import { MedicalHistory } from "@/components/medical-history";
import { getAppointmentWithMedicalRecordsById } from "@/utils/services/appointment";

const AppointmentPage = async({
     params,
     searchParams,
    }: { 
        params: Promise<{ id: string }> 
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }) => {
  const { id } = await params;
  const search = await searchParams;
  const cat = (search?.cat as string) || "charts";
  const {data} = await getAppointmentWithMedicalRecordsById(Number(id));
  console.log("Appointment data:", data);
  return (
    <div className="flex p-6 flex-col-reverse lg:flex-row w-full min-h-screen gap-10">
        {/* Left side */}
        <div className="w-full lg:w-[65%] flex-1 flex-col gap-6">
            {cat ==="charts" && <ChartContainer id={data?.patient_id!}/>}
            {cat === "appointments" && 
            
            <>
            <AppointmentDetails 
            id={data?.id!}
            patient_id={data?.patient_id!}
            appointment_date={data?.appointment_date!}
            time={data?.time!}
            notes={data?.note!}
             />
             <VitalSigns id={id} patientId={data?.patient_id!} doctorId={data?.doctor_id!}/>
            </>
            }
            {/* {cat === "diagnosis" && <DiagnosisContainer/>} */}
            {/* {cat === "biling" && <BillsContainer/>} */}
            {/* {cat === "medical-history" && <MedicalHistoryContainer/>} */}
            {/* {cat == "payments" && <PaymentContainer/>} */}
        </div>
        {/* Right side */}
        <div className="w-full lg:w-[35%] flex-1 space-y-10">
            {<AppointmentQuickLinks staffId={data?.doctor_id as string}/>}
            {<PatientDetailsCard data={data?.patient!}/>}
        </div>
    </div>
  );
}
export default AppointmentPage;