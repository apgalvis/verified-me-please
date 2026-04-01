import { useState } from "react";
import { ContactField } from "@/types/account";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

interface ContactFieldCardProps {
  field: ContactField;
  onConfirm: (field: ContactField) => void;
  onSave: (field: ContactField, newValue: string, valueChanged: boolean) => void;
  showConfirm?: boolean;
  isEditing: boolean;
  onStartEdit: (fieldId: string) => void;
  onCancelEdit: () => void;
}

const statusMicrocopy: Record<string, { message: string; cta: string }> = {
  verified: {
    message: "Este dato está validado y activo para recibir contactos.",
    cta: "Modificar",
  },
  pending: {
    message: "Confirma este dato para asegurar la recepción de tus leads.",
    cta: "Confirmar",
  },
  not_verified: {
    message: "Verifica este dato para no perder oportunidades de contacto.",
    cta: "Verificar ahora",
  },
};

const ContactFieldCard = ({
  field,
  onConfirm,
  onSave,
  showConfirm = false,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: ContactFieldCardProps) => {
  const [editValue, setEditValue] = useState(field.value);
  const copy = statusMicrocopy[field.status] || statusMicrocopy.not_verified;

  const handleStartEdit = () => {
    setEditValue(field.value);
    onStartEdit(field.id);
  };

  const handleSave = () => {
    const valueChanged = editValue.trim() !== field.value;
    onSave(field, editValue.trim(), valueChanged);
  };

  const handleCancel = () => {
    setEditValue(field.value);
    onCancelEdit();
  };

  if (isEditing) {
    return (
      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-card px-1 text-xs text-muted-foreground">
                {field.label}
              </label>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="mt-0"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="mt-2 text-sm font-medium text-primary hover:underline shrink-0"
          >
            Cancelar
          </button>
        </div>
        <Button
          size="sm"
          className="mt-3 rounded-full px-5 text-xs"
          onClick={handleSave}
          disabled={!editValue.trim()}
        >
          Guardar
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
          <p className="text-sm text-foreground mt-0.5 truncate">{field.value}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
          <StatusBadge status={field.status} />
          {showConfirm && (
            <button
              onClick={() => onConfirm(field)}
              className="text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              {copy.cta}
            </button>
          )}
          <button
            onClick={handleStartEdit}
            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            Modificar
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{copy.message}</p>
    </div>
  );
};

export default ContactFieldCard;
