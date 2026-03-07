import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  enforceCsrfProtection: vi.fn(),
  sanitizePayload: vi.fn((value: unknown) => value),
  auth: vi.fn(),
  checkRole: vi.fn(),
}));

vi.mock("@/lib/security", () => ({
  enforceCsrfProtection: mocks.enforceCsrfProtection,
  sanitizePayload: mocks.sanitizePayload,
}));

vi.mock("@/lib/prisma", () => ({
  db: {
    staff: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    doctor: {
      create: vi.fn(),
    },
    workingDays: {
      create: vi.fn(),
    },
    services: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/utils/roles", () => ({
  checkRole: mocks.checkRole,
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mocks.auth,
  clerkClient: vi.fn(),
}));

vi.mock("@/lib/schema", () => ({
  DoctorSchema: {
    safeParse: vi.fn(() => ({ success: true, data: {} })),
  },
  ServicesSchema: {
    safeParse: vi.fn(() => ({ success: true, data: {} })),
  },
  StaffSchema: {
    safeParse: vi.fn(() => ({ success: true, data: {} })),
  },
  WorkingDaysSchema: {
    safeParse: vi.fn(() => ({ success: true, data: [] })),
  },
}));

describe("admin actions authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.enforceCsrfProtection.mockResolvedValue(undefined);
  });

  it("createNewStaff returns unauthorized when user is not authenticated", async () => {
    mocks.auth.mockResolvedValue({ userId: null });

    const { createNewStaff } = await import("@/app/actions/admin");
    const result = await createNewStaff({});

    expect(mocks.enforceCsrfProtection).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: false, msg: "Unauthorized" });
  });

  it("createNewStaff returns unauthorized when role is not admin or doctor", async () => {
    mocks.auth.mockResolvedValue({ userId: "user-1" });
    mocks.checkRole.mockResolvedValue(false);

    const { createNewStaff } = await import("@/app/actions/admin");
    const result = await createNewStaff({});

    expect(mocks.enforceCsrfProtection).toHaveBeenCalledTimes(1);
    expect(mocks.checkRole).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ success: false, msg: "Unauthorized" });
  });
});
