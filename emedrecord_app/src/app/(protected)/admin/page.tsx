
import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness, BriefcaseMedical, Link, User, Users } from "lucide-react";
import React from "react";

 const { userId } = await auth();
   const role = await getRole();

const AdminDashboard = () => {
    return (<div className="flex gap-4">
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
);};

  
export default AdminDashboard;
