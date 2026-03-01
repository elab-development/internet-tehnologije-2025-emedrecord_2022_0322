type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": ["admin"],
  "/patient(.*)": ["patient", "admin", "doctor", "nurse"],
  "/doctor(.*)": ["doctor"],
  "/nurse(.*)": ["nurse"],
  "/staff(.*)": ["nurse"],
  "/record/users": ["admin"],
  "/record/doctors": ["admin"],
  "/record/doctors(.*)": ["admin", "doctor"],
  "/record/staffs": ["admin", "doctor"],
  "/record/patients": ["admin", "doctor", "nurse"],
  "/record/patients(.*)": ["admin", "doctor", "nurse"],
  "/record/appointments(.*)": ["admin", "doctor", "nurse", "patient"],
  "/record/medical-records(.*)": ["admin", "doctor", "nurse"],
  "/record/billing(.*)": ["admin", "doctor", "nurse"],
  "/patient/registrations": ["patient"],
};
