import { useState } from "react";
import { ContactField } from "@/types/account";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactFieldCardProps {
  field: ContactField;
  onConfirm: (field: ContactField) => void;
  onSave: (field: ContactField, newValue: string, valueChanged: boolean) => void;
  showConfirm?: boolean;
  isEditing: boolean;
  onStartEdit: (fieldId: string) => void;
  onCancelEdit: () => void;
}

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
      <div className="px-5 py-4">
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
            className="mt-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline shrink-0"
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
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
        <p className="text-sm text-foreground mt-0.5">{field.value}</p>
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
          onClick={handleStartEdit}
          className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Modificar
        </button>
      </div>
    </div>
  );
};

export default ContactFieldCard;
