"use server";

import { DiagnosisFormData } from "@/components/dialogs/add-diagnosis";
import { nurseCanAccessAppointment, nurseCanAccessPayment } from "@/lib/permissions";
import { db } from "@/lib/prisma";
import { enforceCsrfProtection, sanitizePayload } from "@/lib/security";

import {
  DiagnosisSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

export const addDiagnosis = async (
  data: DiagnosisFormData,
  appointmentId: string
) => {
  try {
    await enforceCsrfProtection();

    const { userId } = await auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");

    if (!isAdmin && !isDoctor) {
      return {
        error: "You are not authorized to add diagnosis",
      };
    }

    const validatedData = sanitizePayload(DiagnosisSchema.parse(data));

    if (isDoctor && validatedData.doctor_id !== userId) {
      return {
        error: "Unauthorized",
      };
    }

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          doctor_id: validatedData.doctor_id,
          appointment_id: Number(appointmentId),
        },
      });
    }

    const med_id = validatedData.medical_id || medicalRecord?.id;
    await db.diagnosis.create({
      data: {
        ...validatedData,
        medical_id: Number(med_id),
      },
    });

    return {
      success: true,
      message: "Diagnosis added successfully",
      status: 201,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to add diagnosis",
    };
  }
};

export async function addNewBill(data: any) {
  try {
    await enforceCsrfProtection();

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isNurse = await checkRole("NURSE");
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        msg: "Unauthorized",
      };
    }

    if (!isAdmin && !isDoctor && !isNurse) {
      return {
        success: false,
        msg: "You are not authorized to add a bill",
      };
    }

    if (isNurse) {
      const hasAccess = await nurseCanAccessAppointment(
        userId,
        Number(data?.appointment_id)
      );

      if (!hasAccess) {
        return {
          success: false,
          msg: "You are not authorized to add a bill for this appointment",
        };
      }
    }

    const isValidData = PatientBillSchema.safeParse(data);

    if (!isValidData.success) {
      return {
        success: false,
        msg: "Invalid data provided",
      };
    }

    const validatedData = sanitizePayload(isValidData.data);
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: {
              appointment_id: Number(data?.appointment_id),
            },
          },
        },
      });

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: Number(data?.appointment_id),
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = {
        id: data?.bill_id,
      };
    }

    await db.patientBills.create({
      data: {
        bill_id: Number(bill_info?.id),
        service_id: Number(validatedData?.service_id),
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    await enforceCsrfProtection();

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isNurse = await checkRole("NURSE");
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: true,
        msg: "Unauthorized",
      };
    }

    if (!isAdmin && !isDoctor && !isNurse) {
      return {
        success: false,
        error: true,
        msg: "You are not authorized to generate bills",
      };
    }

    const isValidData = PaymentSchema.safeParse(data);

    if (!isValidData.success) {
      return {
        success: false,
        error: true,
        msg: "Invalid data provided",
      };
    }

    const validatedData = sanitizePayload(isValidData.data);

    if (!validatedData.id) {
      return {
        success: false,
        error: true,
        msg: "No bill record found. Please add services first.",
      };
    }

    const payment = await db.payment.findUnique({
      where: { id: Number(validatedData.id) },
      include: { bills: true },
    });

    if (!payment) {
      return {
        success: false,
        error: true,
        msg: "Payment record not found",
      };
    }

    if (isNurse) {
      const hasAccess = await nurseCanAccessPayment(userId, payment.id);

      if (!hasAccess) {
        return {
          success: false,
          error: true,
          msg: "You are not authorized to generate this bill",
        };
      }
    }

    if (!payment.bills.length) {
      return {
        success: false,
        error: true,
        msg: "No services added for this appointment",
      };
    }

    const totalAmount = payment.bills.reduce(
      (sum, bill) => sum + bill.total_cost,
      0
    );

    const discountPercent = Number(validatedData.discount) || 0;
    const discountAmount = (discountPercent / 100) * totalAmount;
    const totalPayable = totalAmount - discountAmount;
    const adjustedAmountPaid = Math.min(payment.amount_paid, totalPayable);
    const status =
      adjustedAmountPaid >= totalPayable
        ? "PAID"
        : adjustedAmountPaid > 0
        ? "PART"
        : "UNPAID";

    const res = await db.payment.update({
      data: {
        bill_date: validatedData.bill_date,
        discount: discountAmount,
        total_amount: totalAmount,
        amount_paid: adjustedAmountPaid,
        status,
      },
      where: { id: Number(validatedData.id) },
    });

    await db.appointment.update({
      data: {
        status: "COMPLETED",
      },
      where: { id: res.appointment_id },
    });
    return {
      success: true,
      error: false,
      msg: `Bill generated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function makePayment(data: {
  paymentId: number;
  amount: number;
  paymentMethod?: "CASH" | "CARD";
}) {
  try {
    await enforceCsrfProtection();

    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    const isPatient = await checkRole("PATIENT");
    const isNurse = await checkRole("NURSE");

    if (!isAdmin && !isDoctor && !isPatient && !isNurse) {
      return {
        success: false,
        msg: "You are not authorized to record payments",
      };
    }

    const payment = await db.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      return {
        success: false,
        msg: "Payment record not found",
      };
    }

    if (isPatient && payment.patient_id !== userId) {
      return {
        success: false,
        msg: "Unauthorized",
      };
    }

    if (isNurse) {
      const hasAccess = await nurseCanAccessPayment(userId, payment.id);

      if (!hasAccess) {
        return {
          success: false,
          msg: "Unauthorized",
        };
      }
    }

    if (data.amount <= 0) {
      return {
        success: false,
        msg: "Payment amount must be greater than 0",
      };
    }

    const totalPayable = payment.total_amount - payment.discount;
    const newAmountPaid = payment.amount_paid + data.amount;

    if (newAmountPaid > totalPayable) {
      return {
        success: false,
        msg: `Payment exceeds the payable amount. Maximum: ${(totalPayable - payment.amount_paid).toFixed(2)}`,
      };
    }

    const newStatus = newAmountPaid >= totalPayable 
      ? "PAID" 
      : newAmountPaid > 0 
        ? "PART" 
        : "UNPAID";

    await db.payment.update({
      where: { id: data.paymentId },
      data: {
        amount_paid: newAmountPaid,
        payment_date: new Date(),
        payment_method: data.paymentMethod || "CASH",
        status: newStatus,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Payment of ${data.amount.toFixed(2)} recorded successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
