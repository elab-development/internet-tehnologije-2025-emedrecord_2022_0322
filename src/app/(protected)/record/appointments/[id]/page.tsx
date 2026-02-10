import AppointmentQuickLinks from "@/components/appointment/appointment-quick-links";
import { PatientDetailsCard } from "@/components/appointment/patient-details-card";
import { getAppointmentWithMedicalRecordsById } from "@/utils/services/appointment";

const AppointmentDetailsPage = async({
    params,searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { id } = await params;
    const search = await searchParams;
    const cat = search?.cat as string || "charts";

    const {data} = await  getAppointmentWithMedicalRecordsById(Number(id));
    console.log(data);


    return <div className="flex p-6 flex-col lg:flex-row min-h-screen gap-10">
        {/*left side*/}
    <div className="w-full lg:w-[65%] flex flex-col gap-6">
        {/* {cat ==="charts" && <ChartCointainer/>} */}
        {/* {cat ==="appointments" &&
        
        <AppointmentContainer}/>
        </>} */}
        {/* {cat ==="billing" && <BillingContainer/>} */}
        {/* {cat==="diagnosis" && <DiagnosisContainer/>} */}
        {/* {cat ==="medical-history" && <MedicalHistoryContainer/>} */}
        {/* {cat==="payments" && <PaymentsContainer/>} */}
    </div>
        {/*right side*/}
        <div className="flex-1 space-y-6">
            <AppointmentQuickLinks staffId={data?.doctor_id as string}/>
            {data?.patient && <PatientDetailsCard data={data.patient}/>}
        </div>
    </div>;
};

export default AppointmentDetailsPage;