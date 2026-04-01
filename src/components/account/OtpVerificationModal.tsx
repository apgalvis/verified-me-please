import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ShieldCheck, Mail, Phone, MessageCircle } from "lucide-react";
import { ContactFieldType } from "@/types/account";
import OtpCountdown from "./OtpCountdown";

export interface OtpSession {
  fieldId: string;
  sentAt: number;
  countdownRemaining: number;
}

interface OtpVerificationModalProps {
  open: boolean;
  type: ContactFieldType;
  destination: string;
  onClose: () => void;
  onVerified: () => void;
  /** Existing session for this field, if any */
  session?: OtpSession | null;
  /** Called to persist session changes */
  onSessionUpdate?: (session: OtpSession | null) => void;
  fieldId: string;
}

const channelLabel: Record<ContactFieldType, string> = {
  email: "correo electrónico",
  phone: "SMS",
  whatsapp: "WhatsApp",
};

const channelIcon: Record<ContactFieldType, React.ReactNode> = {
  email: <Mail className="h-6 w-6" />,
  phone: <Phone className="h-6 w-6" />,
  whatsapp: <MessageCircle className="h-6 w-6" />,
};

const channelMarketingDesc: Record<ContactFieldType, string> = {
  email:
    "Te enviamos un código para confirmar tu correo y asegurar la recepción de notificaciones importantes.",
  phone:
    "Confirma tu número para recibir contactos de clientes sin interrupciones.",
  whatsapp:
    "Verifica tu WhatsApp y responde leads de forma más rápida y directa.",
};

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const COUNTDOWN_SECONDS = 60;
const MOCK_VALID_CODE = "123456";

type ModalState = "input" | "loading" | "success" | "error" | "expired";

const OtpVerificationModal = ({
  open,
  type,
  destination,
  onClose,
  onVerified,
  session,
  onSessionUpdate,
  fieldId,
}: OtpVerificationModalProps) => {
  const [code, setCode] = useState("");
  const [state, setState] = useState<ModalState>("input");
  const [errorMessage, setErrorMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [shaking, setShaking] = useState(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Determine if there's a valid existing session
  const hasActiveSession =
    session &&
    session.fieldId === fieldId &&
    Date.now() - session.sentAt < OTP_EXPIRY_MS;

  const resumeCountdown = hasActiveSession
    ? Math.max(0, session!.countdownRemaining)
    : undefined;

  const isResuming = hasActiveSession && (resumeCountdown ?? 0) > 0;

  const resetState = useCallback(() => {
    setCode("");
    setState("input");
    setErrorMessage("");
    setAttempts(0);
    setShaking(false);
  }, []);

  const handleClose = useCallback(() => {
    // Don't clear session on close — persist it
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) return;

    setState("loading");
    await new Promise((r) => setTimeout(r, 1500));

    if (code === MOCK_VALID_CODE) {
      setState("success");
      // Clear session on success
      onSessionUpdate?.(null);
      setTimeout(() => {
        onVerified();
        handleClose();
      }, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setState("expired");
        setErrorMessage("Demasiados intentos. Solicita un nuevo código.");
        onSessionUpdate?.(null);
      } else {
        setState("error");
        setErrorMessage("Código incorrecto. Inténtalo de nuevo.");
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setCode("");
      }
    }
  }, [code, attempts, onVerified, handleClose, onSessionUpdate]);

  const handleResend = useCallback(() => {
    setCode("");
    setState("input");
    setErrorMessage("");
    setAttempts(0);
    // Create new session
    onSessionUpdate?.({
      fieldId,
      sentAt: Date.now(),
      countdownRemaining: COUNTDOWN_SECONDS,
    });
  }, [fieldId, onSessionUpdate]);

  const handleCountdownTick = useCallback(
    (remaining: number) => {
      onSessionUpdate?.({
        fieldId,
        sentAt: sessionRef.current?.sentAt ?? Date.now(),
        countdownRemaining: remaining,
      });
    },
    [fieldId, onSessionUpdate]
  );

  // On first open without active session, create one
  const hasInitialized = useRef(false);
  if (open && !hasActiveSession && !hasInitialized.current) {
    hasInitialized.current = true;
    onSessionUpdate?.({
      fieldId,
      sentAt: Date.now(),
      countdownRemaining: COUNTDOWN_SECONDS,
    });
  }
  if (!open) {
    hasInitialized.current = false;
  }

  const maskedDestination =
    type === "email"
      ? destination.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      : destination.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[hsl(var(--header-gradient-from))] to-[hsl(var(--header-gradient-to))] px-6 py-5 text-white">
          <button
            onClick={handleClose}
            className="mb-3 flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Regresar
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              {channelIcon[type]}
            </div>
            <div>
              <DialogHeader className="p-0 space-y-0.5 text-left">
                <DialogTitle className="text-lg font-bold text-white">
                  Verifica tu información
                </DialogTitle>
                <DialogDescription className="text-xs text-white/70">
                  {channelMarketingDesc[type]}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-6 px-6 py-8">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--verified))]/10">
                <ShieldCheck className="h-8 w-8 text-[hsl(var(--verified))]" />
              </div>
              <p className="text-base font-semibold text-foreground">
                ¡Listo! Tu dato fue verificado correctamente.
              </p>
              <p className="text-sm text-muted-foreground">
                Tu información ha sido confirmada
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Enviamos un código de 6 dígitos a{" "}
                  <span className="font-medium text-foreground">
                    {maskedDestination}
                  </span>
                </p>
                {isResuming && (
                  <p className="text-xs text-primary font-medium mt-2">
                    Ya enviamos un código. Puedes usar el mismo o solicitar uno
                    nuevo cuando finalice el tiempo.
                  </p>
                )}
              </div>

              <div className={shaking ? "animate-shake" : ""}>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    if (state === "error") {
                      setState("input");
                      setErrorMessage("");
                    }
                  }}
                  disabled={state === "loading" || state === "expired"}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errorMessage && (
                <p className="text-sm font-medium text-[hsl(var(--not-verified))]">
                  {errorMessage}
                </p>
              )}

              <Button
                className="w-full"
                disabled={code.length !== 6 || state === "loading" || state === "expired"}
                onClick={handleVerify}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar código"
                )}
              </Button>

              <OtpCountdown
                resumeSeconds={resumeCountdown}
                onResend={handleResend}
                onTick={handleCountdownTick}
              />

              <p className="text-center text-xs text-muted-foreground">
                Esto ayuda a mejorar la seguridad de tu cuenta
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
