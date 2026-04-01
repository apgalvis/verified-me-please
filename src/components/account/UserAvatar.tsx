import { Camera } from "lucide-react";
import { UserProfile } from "@/types/account";

interface UserAvatarProps {
  profile: UserProfile;
}

const UserAvatar = ({ profile }: UserAvatarProps) => {
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
    </div>
  );
};

export default UserAvatar;
