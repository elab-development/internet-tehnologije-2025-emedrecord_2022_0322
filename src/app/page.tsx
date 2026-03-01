import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
   const { userId } = await auth();
   const role = await getRole();

  if (userId && role) {
    redirect(`/${role}`);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-secondary/30" />
      <div className="w-full max-w-5xl rounded-3xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium tracking-wide">
            DIGITAL HEALTH PLATFORM
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Next-level
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              eMedRecord
            </span>
          </h1>

          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Secure medical records, smoother scheduling, and clearer workflows for doctors, nurses, admins and patients in one modern workspace.
          </p>

          <div className="flex gap-4 pt-2">
            {userId ? (
              <>
                <UserButton/>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="md:text-base font-medium px-6">
                    New Patient
                  </Button>
                </Link>

                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="md:text-base font-medium px-6"
                  >
                    Login to account
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3 pt-4">
            <div className="rounded-2xl bg-secondary/70 border border-border/60 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Records</p>
              <p className="text-lg font-semibold">Fast patient overview</p>
            </div>
            <div className="rounded-2xl bg-secondary/70 border border-border/60 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Scheduling</p>
              <p className="text-lg font-semibold">Smart appointment flow</p>
            </div>
            <div className="rounded-2xl bg-secondary/70 border border-border/60 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Collaboration</p>
              <p className="text-lg font-semibold">Role-based workspace</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="absolute bottom-5 left-0 right-0">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          &copy; 2026 eMedRecord App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

