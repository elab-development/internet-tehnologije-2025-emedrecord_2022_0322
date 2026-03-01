import { db } from "@/lib/prisma";
import { getNurseDoctorId } from "@/utils/roles";

export const nurseCanAccessAppointment = async (
  userId: string,
  appointmentId: number
) => {
  const nurseDoctorId = await getNurseDoctorId(userId);

  if (!nurseDoctorId) {
    return false;
  }

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { doctor_id: true },
  });

  return appointment?.doctor_id === nurseDoctorId;
};

export const nurseCanAccessPayment = async (userId: string, paymentId: number) => {
  const nurseDoctorId = await getNurseDoctorId(userId);

  if (!nurseDoctorId) {
    return false;
  }

  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    select: {
      appointment: {
        select: { doctor_id: true },
      },
    },
  });

  return payment?.appointment?.doctor_id === nurseDoctorId;
};
