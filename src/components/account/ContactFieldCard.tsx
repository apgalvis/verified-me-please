import { Mail, Phone, MessageCircle } from "lucide-react";
import { ContactField } from "@/types/account";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

interface ContactFieldCardProps {
  field: ContactField;
  onConfirm: (field: ContactField) => void;
  onModify: (field: ContactField) => void;
}

const iconMap = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
};

const ContactFieldCard = ({ field, onConfirm, onModify }: ContactFieldCardProps) => {
  const Icon = iconMap[field.type];
  const isVerified = field.status === "verified";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
          <p className="truncate text-sm font-medium text-foreground">{field.value}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={field.status} />
        {isVerified ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onModify(field)}
          >
            Modificar
          </Button>
        ) : (
          <Button
            size="sm"
            className="text-xs"
            onClick={() => onConfirm(field)}
          >
            Confirmar
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContactFieldCard;
