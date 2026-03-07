import { db } from "@/lib/prisma";

export async function getAllStaff({
  page,
  limit,
  search,
  doctorId,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
  doctorId?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        },
        ...(doctorId
          ? [
              {
                role: "NURSE" as const,
                doctor_id: doctorId,
              },
            ]
          : []),
      ],
    };

    const [staff, totalRecords] = await Promise.all([
      db.staff.findMany({
        where,

        skip: SKIP,
        take: LIMIT,
      }),
      db.staff.count({ where }),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      success: true,
      data: staff,
      totalRecords,
      totalPages,
      currentPage: PAGE_NUMBER,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getUnassignedNurses() {
  try {
    const nurses = await db.staff.findMany({
      where: {
        role: "NURSE",
        status: "ACTIVE",
        doctor_id: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: nurses,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
      message: "Internal Server Error",
    };
  }
}
