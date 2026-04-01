import { Camera, ShieldCheck } from "lucide-react";
import { UserProfile } from "@/types/account";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserAvatarProps {
  profile: UserProfile;
  allVerified?: boolean;
}

const UserAvatar = ({ profile, allVerified = false }: UserAvatarProps) => {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="-mt-14 flex flex-col items-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
          {initials}
        </div>
        <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-md border border-border hover:bg-accent transition-colors">
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-foreground">
        {profile.firstName} {profile.lastName}
      </h2>
      <p className="text-xs text-muted-foreground">
        Miembro desde {profile.memberSince}
      </p>

      {allVerified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[hsl(var(--verified))]/10 px-3 py-1 cursor-default">
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--verified))]" />
                <span className="text-xs font-bold text-[hsl(var(--verified))]">
                  Usuario verificado
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[220px] text-center">
              <p className="text-xs">
                Tu perfil está completamente verificado. Esto aumenta la
                confianza y mejora tu desempeño en la plataforma.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default UserAvatar;
