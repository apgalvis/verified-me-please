import { ContactField } from "@/types/account";

interface ContactFieldCardProps {
  field: ContactField;
  onConfirm: (field: ContactField) => void;
  onModify: (field: ContactField) => void;
  showConfirm?: boolean;
}

const ContactFieldCard = ({ field, onConfirm, onModify, showConfirm = false }: ContactFieldCardProps) => {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">{field.label}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{field.value}</p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {showConfirm && (
          <button
            onClick={() => onConfirm(field)}
            className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
          >
            Confirmar
          </button>
        )}
        <button
          onClick={() => onModify(field)}
          className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Modificar
        </button>
      </div>
    </div>
  );
};

export default ContactFieldCard;
