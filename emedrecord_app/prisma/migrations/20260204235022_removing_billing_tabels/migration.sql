/*
  Warnings:

  - You are about to drop the `PatientBills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientBills" DROP CONSTRAINT "PatientBills_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientBills" DROP CONSTRAINT "PatientBills_service_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_patient_id_fkey";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "doctor_id" TEXT;

-- DropTable
DROP TABLE "PatientBills";

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
