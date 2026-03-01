import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface DataProps {
    id: string | number;
    patientId: string;
    medicalId?: string;
    doctor_id: string | number;
    label: React.ReactNode;
}
export const MedicalHistoryDialog = async ({
    id,
    patientId,
    doctor_id,
    label,
}: DataProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center rounded-full bg-primary/10 hover:underline text-primary px-1.5 py-1 text-xs md:text-sm"
                >
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] max-w-[425px] md:max-w-2xl 2xl:max-w-4xl p-8 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Medical History</DialogTitle>
                    <DialogDescription>
                        Review diagnosis and related medical details.
                    </DialogDescription>
                </DialogHeader>
                {/* <DiagnosisContainer
          id={id}
          patientId={patientId!}
          doctor_id={doctor_id!}
        /> */}

                <p>Diagnosis container form</p>
            </DialogContent>
        </Dialog>
    );
};

