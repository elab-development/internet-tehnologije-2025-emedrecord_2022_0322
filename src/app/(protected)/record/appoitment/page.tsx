import { checkRole, getRole } from '@/utils/roles';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { BriefcaseBusiness } from 'lucide-react';
import SearchInput from '@/components/search-input';
import App from 'next/app';
import { ProfileImage } from '@/components/profile-image';
import { AppointmentStatusIndicator } from '@/components/appointment-status-indicator';
import { format } from 'date-fns';
import { ViewAppointment } from '@/components/view-appoitment';
import { Appointment, Doctor, Patient } from '@prisma/client';
import { AppointmentActionOptions } from '@/components/appoitment-actions';
import { DATA_LIMIT } from '@/utils/seetings';
import { Pagination } from '@/components/pagination';
import { getPatientAppointments } from '@/utils/services/appoitment';
import { Table } from '@/components/tables/table';
import { AppointmentContainer } from '@/components/appointment-container';

const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

interface DataProps extends Appointment {
  patient: Patient,
  doctor: Doctor,
}
const Appointments = async(props: {searchParams? : {[key: string]: string | undefined}}) => {
  const searchParams = await props.searchParams
  const userRole = await getRole()
  const {userId} = await auth()
  const isPatient = await checkRole("PATIENT")
  const page = (searchParams?.p || "1") as string;
  const searchQuery = searchParams?.q || "";
  const id = searchParams?.id || undefined;

  let queryId = undefined
  if(userRole === "admin" || (  userRole === "doctor" && id) || (userRole === "nurse" && id)){
    queryId = id
  }else if(userRole === "doctor"){
    queryId = userId
  }else if(userRole === "nurse"){
    queryId = undefined
  }else if(userRole === "patient"){
    queryId = userId
  }

  const { data, totalRecord, currentPage, totalPages } = await getPatientAppointments({
    page: page,
    search: searchQuery,
    id: queryId!,
  });
  if(!data) return null;
  const renderItem = (item: DataProps) => {
    const patient_name = `${item?.patient?.first_name} ${item?.patient?.last_name}`;
    return <tr
       key={item?.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={patient_name}
            bgColor={item?.patient?.colorCode!}
          />
          <div>
            <h3 className="font-semibold uppercase">{patient_name}</h3>
            <span className="text-xs md:text-sm capitalize">
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell">
          {format(item?.appointment_date, "yyyy-MM-dd")}
        </td>
        <td className="hidden md:table-cell">{item.time}</td>

        <td className="hidden  items-center py-2  md:table-cell">
          <div className="flex items-center  gap-2 md:gap-4">
            <ProfileImage
              url={item.doctor?.img!}
              name={item.doctor?.name}
              bgColor={item?.doctor?.colorCode!}
              textClassName="text-black"
            />

            <div>
              <h3 className="font-semibold uppercase">{item.doctor?.name}</h3>
              <span className="text-xs md:text-sm capitalize">
                {item.doctor?.specialization}
              </span>
            </div>
          </div>
        </td>

        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status!} />
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ViewAppointment id={item?.id.toString()} />
            <AppointmentActionOptions
              userId={userId!}
              patientId={item?.patient_id}
              doctorId={item?.doctor_id}
              status={item?.status}
              appointmentId={Number(item.id)}
            />
          </div>
        </td>
    </tr>
  }
  return (
    <div className='bg-white rounded-xl p-2 md:p-4 2xl:p-6'>
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord}</p>
          <span className="text-sm text-gray-500 xl:text-base">Total Appointments</span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput/>
           {isPatient && <AppointmentContainer id={userId!}/>}

        </div>

      </div>
      <div className='mt-6'>
          <Table
            columns={columns}
            renderRow={renderItem}
            data={data}
            />

            {data?.length > 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />  )}
      </div>
    </div>
  );
};
export default Appointments