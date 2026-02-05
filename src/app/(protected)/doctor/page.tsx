import { checkRole, getRole } from '@/utils/roles';
import { redirect } from 'next/navigation';
import React from 'react';  

const DoctorDashboard= async () => {
    const isDoctor = await checkRole('DOCTOR');
    const role = await getRole();

    if(!isDoctor){
      redirect(`/${role}`);
    }
    return  <div>Doctor Page</div>;
  }

export default DoctorDashboard;