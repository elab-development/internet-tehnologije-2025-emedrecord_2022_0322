import { AppointmentContainer } from "@/components/appointment-container";
import AppointmentQuickLinks from "@/components/appointment/appointment-quick-links";
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
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
            {/* {cat ==="charts" && <ChartContainer/>} */}
            {/* {cat === "appointments" && 
            
            <>
            <AppointmentContainer/>
            </>
            } */}
            {/* {cat === "diagnosis" && <DiagnosisContainer/>} */}
            {/* {cat === "biling" && <BillsContainer/>} */}
            {/* {cat === "medical-history" && <MedicalHistoryContainer/>} */}
            {/* {cat == "payments" && <PaymentContainer/>} */}
        </div>
        {/* Right side */}
        <div className="w-full lg:w-[35%] flex-1 space-y-6">
            {<AppointmentQuickLinks staffId={data?.doctor_id as string}/>}
            {/* {<PatientDetailsCard data={data?.patient}/>} */}
        </div>
    </div>
  );
}
export default AppointmentPage;