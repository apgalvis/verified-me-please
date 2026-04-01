import { ContactField } from "@/types/account";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Mail, Phone, MessageCircle } from "lucide-react";

interface VerificationProgressProps {
  fields: ContactField[];
}

const fieldIcons: Record<string, React.ReactNode> = {
  "email-contacto": <Mail className="h-4 w-4" />,
  "phone-personal": <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
};

const fieldLabels: Record<string, string> = {
  "email-contacto": "Email",
  "phone-personal": "Teléfono",
  whatsapp: "WhatsApp",
};

const VerificationProgress = ({ fields }: VerificationProgressProps) => {
  const verified = fields.filter((f) => f.status === "verified").length;
  const total = fields.length;
  const pct = Math.round((verified / total) * 100);
  const allVerified = verified === total;

  const nudgeMessage =
    verified === 0
      ? "Verifica tus datos para recibir más leads y generar mayor confianza."
      : verified === total - 1
        ? "¡Te falta solo uno! Completa tu verificación para obtener el badge."
        : "Sigue verificando tus datos para mejorar tu rendimiento.";

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">
            {allVerified
              ? "¡Perfil completamente verificado!"
              : "Completa tu verificación y aumenta tu rendimiento"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allVerified
              ? "Tienes mayor visibilidad y confianza dentro de la plataforma."
              : "Los usuarios con datos verificados reciben más contactos y generan mayor confianza."}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {verified} de {total} datos verificados
          </span>
          <span className="text-xs font-bold text-primary">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Checklist */}
      <div className="flex flex-wrap gap-3">
        {fields.map((f) => {
          const isVerified = f.status === "verified";
          return (
            <div
              key={f.id}
              className={`flex items-center gap-1.5 text-xs font-medium ${
                isVerified ? "text-[hsl(var(--verified))]" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  isVerified
                    ? "bg-[hsl(var(--verified))]/10 text-[hsl(var(--verified))]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {fieldIcons[f.id] || <Mail className="h-3 w-3" />}
              </span>
              {fieldLabels[f.id] || f.label}
              {isVerified && <span>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Nudge */}
      {!allVerified && (
        <p className="mt-3 text-xs text-primary font-medium">{nudgeMessage}</p>
      )}
    </div>
  );
};

export default VerificationProgress;
