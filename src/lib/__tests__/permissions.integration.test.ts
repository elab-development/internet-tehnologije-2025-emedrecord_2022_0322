import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/prisma";
import { nurseCanAccessAppointment, nurseCanAccessPayment } from "@/lib/permissions";

const testRunId = crypto.randomUUID();
const doctorId = `doctor-${testRunId}`;
const otherDoctorId = `doctor-other-${testRunId}`;
const nurseId = `nurse-${testRunId}`;
const patientId = `patient-${testRunId}`;

let appointmentId = 0;
let paymentId = 0;

beforeAll(() => {
  const dbUrl = process.env.DATABASE_URL;
  const testEnvFlag = process.env.TEST_ENV;

  if (!dbUrl) {
    throw new Error("DATABASE_URL is not set for tests");
  }

  if (testEnvFlag !== "true") {
    throw new Error("TEST_ENV must be set to true for database integration tests");
  }
});

beforeEach(async () => {
  await db.payment.deleteMany({ where: { patient_id: patientId } });
  await db.appointment.deleteMany({ where: { patient_id: patientId } });
  await db.staff.deleteMany({ where: { id: nurseId } });
  await db.doctor.deleteMany({ where: { id: { in: [doctorId, otherDoctorId] } } });
  await db.patient.deleteMany({ where: { id: patientId } });

  await db.doctor.create({
    data: {
      id: doctorId,
      email: `doctor.${testRunId}@example.com`,
      name: "Doctor A",
      specialization: "General",
      license_number: `LIC-${testRunId}`,
      phone: "+38160000111",
      address: "Address A",
      department: "Internal",
    },
  });

  await db.doctor.create({
    data: {
      id: otherDoctorId,
      email: `doctor.other.${testRunId}@example.com`,
      name: "Doctor B",
      specialization: "General",
      license_number: `LIC-OTHER-${testRunId}`,
      phone: "+38160000112",
      address: "Address B",
      department: "Internal",
    },
  });

  await db.staff.create({
    data: {
      id: nurseId,
      email: `nurse.${testRunId}@example.com`,
      name: "Nurse One",
      phone: "+38160000113",
      address: "Address C",
      role: "NURSE",
      status: "ACTIVE",
      doctor_id: doctorId,
    },
  });

  await db.patient.create({
    data: {
      id: patientId,
      first_name: "Test",
      last_name: "Patient",
      date_of_birth: new Date("1990-01-01"),
      gender: "MALE",
      phone: "+38160000114",
      email: `patient.${testRunId}@example.com`,
      marital_status: "single",
      address: "Address D",
      emergency_contact_name: "EC",
      emergency_contact_number: "+38160000115",
      relation: "other",
      privacy_consent: true,
      service_consent: true,
      medical_consent: true,
    },
  });

  const appointment = await db.appointment.create({
    data: {
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: new Date(),
      time: "10:00",
      type: "Checkup",
      reason: "Routine",
      status: "SCHEDULED",
    },
  });

  appointmentId = appointment.id;

  const payment = await db.payment.create({
    data: {
      patient_id: patientId,
      appointment_id: appointment.id,
      bill_date: new Date(),
      payment_date: new Date(),
      discount: 0,
      total_amount: 100,
      amount_paid: 100,
      payment_method: "CARD",
      status: "PAID",
    },
  });

  paymentId = payment.id;
});

describe("permissions integration", () => {
  it("allows nurse to access own doctor appointment", async () => {
    await expect(nurseCanAccessAppointment(nurseId, appointmentId)).resolves.toBe(true);
  });

  it("allows nurse to access own doctor payment", async () => {
    await expect(nurseCanAccessPayment(nurseId, paymentId)).resolves.toBe(true);
  });

  it("denies unknown nurse", async () => {
    await expect(nurseCanAccessAppointment("missing-nurse", appointmentId)).resolves.toBe(false);
  });
});
