UPDATE "Staff"
SET "role" = 'NURSE'
WHERE "role" IN ('CASHIER', 'LAB_TECHNICIAN');

ALTER TYPE "Role" RENAME TO "Role_old";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'NURSE', 'DOCTOR', 'PATIENT');

ALTER TABLE "Staff"
ALTER COLUMN "role" TYPE "Role"
USING ("role"::text::"Role");

DROP TYPE "Role_old";
