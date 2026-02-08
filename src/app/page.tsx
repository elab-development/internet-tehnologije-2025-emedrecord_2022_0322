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
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Welcome to <br />
            <span className="text-blue-700 text-5xl md:text-6xl">
              eMedRecord App
            </span>
          </h1>
        </div>

        <div className="text-center max-w-xl flex flex-col items-center justify-center">
          <p className="mb-8">
           "Your complete solution for managing medical records, appointments, and patient care. 
            Secure, efficient, and designed for healthcare professionals and patients alike."
          </p>

          <div className="flex gap-4">
            {userId ? (
              <>
                <UserButton/>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="md:text-base font-light">
                    New Patient
                  </Button>
                </Link>

                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="md:text-base underline hover:text-blue-600"
                  >
                    Login to account
                  </Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
      <footer className="mt-8">
        <p className="text-center text-sm">
          &copy; 2026 eMedRecord App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
