import { useState, useCallback } from "react";
import { toast } from "sonner";
import AccountHeader from "@/components/account/AccountHeader";
import UserAvatar from "@/components/account/UserAvatar";
import ContactFieldCard from "@/components/account/ContactFieldCard";
import OtpVerificationModal from "@/components/account/OtpVerificationModal";
import { ContactField, UserProfile } from "@/types/account";
import { User, Phone } from "lucide-react";

const initialProfile: UserProfile = {
  firstName: "Carlos",
  lastName: "Mendoza",
  memberSince: "Enero 2024",
};

const initialFields: ContactField[] = [
  {
    id: "email-personal",
    label: "Email personal",
    value: "carlos.mendoza@gmail.com",
    type: "email",
    status: "verified",
  },
  {
    id: "email-contacto",
    label: "Email de contacto",
    value: "cmendoza@propiedades.com",
    type: "email",
    status: "not_verified",
  },
  {
    id: "phone-personal",
    label: "Número personal",
    value: "+52 55 1234 5678",
    type: "phone",
    status: "pending",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+52 55 8765 4321",
    type: "whatsapp",
    status: "not_verified",
  },
];

const MiCuenta = () => {
  const [fields, setFields] = useState<ContactField[]>(initialFields);
  const [otpModal, setOtpModal] = useState<{
    open: boolean;
    field: ContactField | null;
  }>({ open: false, field: null });

  const openOtp = useCallback((field: ContactField) => {
    setOtpModal({ open: true, field });
  }, []);

  const closeOtp = useCallback(() => {
    setOtpModal({ open: false, field: null });
  }, []);

  const handleVerified = useCallback(() => {
    if (!otpModal.field) return;
    setFields((prev) =>
      prev.map((f) =>
        f.id === otpModal.field!.id ? { ...f, status: "verified" as const } : f
      )
    );
    toast.success("Dato verificado correctamente", {
      description: `${otpModal.field.label} ha sido confirmado.`,
    });
  }, [otpModal.field]);

  return (
    <div className="min-h-screen bg-background">
      <AccountHeader />

      <div className="mx-auto max-w-lg px-4">
        <UserAvatar profile={initialProfile} />

        {/* User Info Section */}
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Información de usuario
            </h3>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Nombre completo</p>
              <p className="text-sm font-medium text-foreground">
                {initialProfile.firstName} {initialProfile.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-8 pb-12">
          <div className="mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Información de contacto
            </h3>
          </div>
          <div className="space-y-3">
            {fields.map((field) => (
              <ContactFieldCard
                key={field.id}
                field={field}
                onConfirm={openOtp}
                onModify={openOtp}
              />
            ))}
          </div>
        </div>
      </div>

      {otpModal.field && (
        <OtpVerificationModal
          open={otpModal.open}
          type={otpModal.field.type}
          destination={otpModal.field.value}
          onClose={closeOtp}
          onVerified={handleVerified}
        />
      )}
    </div>
  );
};

export default MiCuenta;
