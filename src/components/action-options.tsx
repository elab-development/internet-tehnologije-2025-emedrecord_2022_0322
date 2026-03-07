import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

export const ActionOptions = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center rounded-full p-1"
        >
          <EllipsisVertical size={16} className="text-sm text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <span className="text-xs text-gray-400 mb-4 uppercase">
          Perform Action
        </span>
        {children}
      </PopoverContent>
    </Popover>
  );
};

const className =
  "action-pill disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-muted disabled:text-muted-foreground";

export const ViewAction = ({
  href,
  disabled = false,
}: {
  href: string;
  disabled?: boolean;
}) => {
  return (
    <Link href={href}>
      <button type="button" disabled={disabled} className={className}>
        View
      </button>
    </Link>
  );
};

export const ViewActionButton = () => {
  return (
    <button type="button" className={className}>
      View
    </button>
  );
};
