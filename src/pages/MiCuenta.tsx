import { useState, useCallback } from "react";
import { toast } from "sonner";
import AccountHeader from "@/components/account/AccountHeader";
import UserAvatar from "@/components/account/UserAvatar";
import ContactFieldCard from "@/components/account/ContactFieldCard";
import OtpVerificationModal from "@/components/account/OtpVerificationModal";
import { ContactField, UserProfile } from "@/types/account";

const initialProfile: UserProfile = {
  firstName: "Aldo mod",
  lastName: "Nolla",
  memberSince: "Enero 2024",
};

const userInfoFields: ContactField[] = [
  { id: "nombre", label: "Nombre completo", value: "Aldo mod Nolla", type: "email", status: "verified" },
  { id: "email-personal", label: "Email personal", value: "aldo.nolla@propiedades.com", type: "email", status: "verified" },
  { id: "password", label: "Contraseña", value: "************", type: "email", status: "verified" },
];

const initialContactFields: ContactField[] = [
  { id: "email-contacto", label: "Email de contacto", value: "danielnn83@yahoo.com.mx", type: "email", status: "not_verified" },
  { id: "phone-personal", label: "Número personal", value: "5579898039", type: "phone", status: "not_verified" },
  { id: "whatsapp", label: "Número de WhatsApp", value: "5579898039", type: "whatsapp", status: "not_verified" },
];

const MiCuenta = () => {
  const [contactFields, setContactFields] = useState<ContactField[]>(initialContactFields);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [otpModal, setOtpModal] = useState<{
    open: boolean;
    field: ContactField | null;
    pendingValue: string | null;
  }>({ open: false, field: null, pendingValue: null });

  const handleStartEdit = useCallback((fieldId: string) => {
    setEditingFieldId(fieldId);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingFieldId(null);
  }, []);

  // "Confirmar" — campo no verificado, sin editar, envía OTP al valor actual
  const handleConfirm = useCallback((field: ContactField) => {
    setOtpModal({ open: true, field, pendingValue: null });
  }, []);

  // "Guardar" — lógica: salta OTP solo si ya verificado Y no cambió valor
  const handleSave = useCallback((field: ContactField, newValue: string, valueChanged: boolean) => {
    const needsOtp = field.status !== "verified" || valueChanged;

    if (!needsOtp) {
      // Ya verificado y sin cambios → volver a solo lectura
      setEditingFieldId(null);
      toast.info("No se realizaron cambios");
      return;
    }

    // Abrir OTP. Si cambió el valor, guardamos el pendiente
    setOtpModal({
      open: true,
      field,
      pendingValue: valueChanged ? newValue : null,
    });
    setEditingFieldId(null);
  }, []);

  const closeOtp = useCallback(() => {
    setOtpModal({ open: false, field: null, pendingValue: null });
  }, []);

  const handleVerified = useCallback(() => {
    if (!otpModal.field) return;

    setContactFields((prev) =>
      prev.map((f) => {
        if (f.id !== otpModal.field!.id) return f;
        return {
          ...f,
          value: otpModal.pendingValue ?? f.value,
          status: "verified" as const,
        };
      })
    );

    const action = otpModal.pendingValue ? "actualizado y verificado" : "verificado";
    toast.success(`Dato ${action} correctamente`, {
      description: `${otpModal.field.label} ha sido confirmado.`,
    });
  }, [otpModal.field, otpModal.pendingValue]);

  // El destino del OTP: si hay valor pendiente (nuevo), se envía ahí; si no, al actual
  const otpDestination = otpModal.pendingValue ?? otpModal.field?.value ?? "";

  return (
    <div className="min-h-screen bg-background">
      <AccountHeader />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <UserAvatar profile={initialProfile} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Información de usuario */}
            <h3 className="text-base font-bold text-foreground mb-3">
              Información de usuario
            </h3>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {userInfoFields.map((field) => (
                <ContactFieldCard
                  key={field.id}
                  field={field}
                  onConfirm={() => {}}
                  onSave={() => {}}
                  showConfirm={false}
                  isEditing={false}
                  onStartEdit={() => {}}
                  onCancelEdit={() => {}}
                />
              ))}
            </div>

            {/* Información de contacto */}
            <h3 className="text-base font-bold text-foreground mb-3 mt-10">
              Información de contacto
            </h3>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {contactFields.map((field) => (
                <ContactFieldCard
                  key={field.id}
                  field={field}
                  onConfirm={handleConfirm}
                  onSave={handleSave}
                  showConfirm={field.status !== "verified"}
                  isEditing={editingFieldId === field.id}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {otpModal.field && (
        <OtpVerificationModal
          open={otpModal.open}
          type={otpModal.field.type}
          destination={otpDestination}
          onClose={closeOtp}
          onVerified={handleVerified}
        />
      )}
    </div>
  );
};

export default MiCuenta;
