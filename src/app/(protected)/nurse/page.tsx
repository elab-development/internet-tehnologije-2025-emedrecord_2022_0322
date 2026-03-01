import { redirect } from "next/navigation";

const NurseHomePage = async () => {
  redirect("/record/appointments");
};

export default NurseHomePage;
