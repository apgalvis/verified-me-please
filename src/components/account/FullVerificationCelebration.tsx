import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, PartyPopper } from "lucide-react";

interface FullVerificationCelebrationProps {
  open: boolean;
  onClose: () => void;
}

const FullVerificationCelebration = ({
  open,
  onClose,
}: FullVerificationCelebrationProps) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="sm:max-w-md text-center">
      <DialogHeader className="items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--verified))]/10 mx-auto mb-2">
          <PartyPopper className="h-10 w-10 text-[hsl(var(--verified))]" />
        </div>
        <DialogTitle className="text-xl">¡Perfil verificado! 🎉</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mt-2">
          Ahora tienes mayor visibilidad y confianza dentro de la plataforma.
          Tus datos están completamente validados.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--verified))]/10 px-4 py-2 mx-auto w-fit mt-2">
        <ShieldCheck className="h-5 w-5 text-[hsl(var(--verified))]" />
        <span className="text-sm font-bold text-[hsl(var(--verified))]">
          Usuario verificado
        </span>
      </div>

      <Button className="mt-4 w-full" onClick={onClose}>
        Seguir gestionando mis propiedades
      </Button>
    </DialogContent>
  </Dialog>
);

export default FullVerificationCelebration;
