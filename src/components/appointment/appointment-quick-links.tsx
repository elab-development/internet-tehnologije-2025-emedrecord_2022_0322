import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { checkRole } from "@/utils/roles";
import { ReviewForm } from "../dialogs/review-form";

const AppointmentQuickLinks = async ({ staffId }: { staffId: string }) => {
  const isPatient = await checkRole("PATIENT");
  const quickLinks = [
    { href: "?cat=charts", label: "Charts" },
    { href: "?cat=appointments", label: "Appointments" },
    { href: "?cat=diagnosis", label: "Diagnosis" },
    { href: "?cat=bills", label: "Bills" },
    { href: "?cat=medical-history", label: "Medical History" },
    { href: "?cat=payments", label: "Payments" },
    { href: "?cat=lab-test", label: "Lab Test" },
    { href: "?cat=appointments#vital-signs", label: "Vital Signs" },
  ];

  return (
    <Card className="w-full rounded-xl bg-card shadow-none">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="quick-link-chip">
            {link.label}
          </Link>
        ))}

        {!isPatient && <ReviewForm staffId={staffId} />}
      </CardContent>
    </Card>
  );
};

export default AppointmentQuickLinks;

