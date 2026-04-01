import { VerificationStatus } from "@/types/account";
import { Check, Clock, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: VerificationStatus;
}

const config: Record<VerificationStatus, { label: string; dotClass: string; textClass: string; icon: React.ReactNode }> = {
  verified: {
    label: "Verificado",
    dotClass: "bg-[hsl(var(--verified))]",
    textClass: "text-[hsl(var(--verified))]",
    icon: <Check className="h-3 w-3" />,
  },
  pending: {
    label: "Pendiente",
    dotClass: "bg-[hsl(var(--pending))]",
    textClass: "text-[hsl(var(--pending))]",
    icon: <Clock className="h-3 w-3" />,
  },
  not_verified: {
    label: "No verificado",
    dotClass: "bg-[hsl(var(--not-verified))]",
    textClass: "text-[hsl(var(--not-verified))]",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, dotClass, textClass, icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${textClass} bg-[hsl(var(--muted))]`}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${dotClass} text-white`}>
        {icon}
      </span>
      {label}
    </span>
  );
};

export default StatusBadge;
