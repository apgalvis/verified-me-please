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
  {
    id: "nombre",
    label: "Nombre completo",
    value: "Aldo mod Nolla",
    type: "email",
    status: "verified",
  },
  {
    id: "email-personal",
    label: "Email personal",
    value: "aldo.nolla@propiedades.com",
    type: "email",
    status: "verified",
  },
  {
    id: "password",
    label: "Contraseña",
    value: "************",
    type: "email",
    status: "verified",
  },
];

const initialContactFields: ContactField[] = [
  {
    id: "email-contacto",
    label: "Email de contacto",
    value: "danielnn83@yahoo.com.mx",
    type: "email",
    status: "verified",
  },
  {
    id: "phone-personal",
    label: "Número personal",
    value: "5579898039",
    type: "phone",
    status: "verified",
  },
  {
    id: "whatsapp",
    label: "Número de WhatsApp",
    value: "5579898039",
    type: "whatsapp",
    status: "not_verified",
  },
];

const MiCuenta = () => {
  const [contactFields, setContactFields] = useState<ContactField[]>(initialContactFields);
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
    setContactFields((prev) =>
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

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column — Avatar */}
          <div className="shrink-0">
            <UserAvatar profile={initialProfile} />
          </div>

          {/* Right column — Info sections */}
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
                  onConfirm={openOtp}
                  onModify={() => {}}
                  showConfirm={false}
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
                  onConfirm={openOtp}
                  onModify={openOtp}
                  showConfirm={field.status === "not_verified"}
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
          destination={otpModal.field.value}
          onClose={closeOtp}
          onVerified={handleVerified}
        />
      )}
    </div>
  );
};

export default MiCuenta;
