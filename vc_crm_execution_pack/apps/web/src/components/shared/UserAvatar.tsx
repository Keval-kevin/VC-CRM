import { UserRound } from "lucide-react";

import { cn } from "../../lib/utils";

export type UserAvatarProps = {
  name?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function UserAvatar({
  className,
  imageUrl,
  name,
  size = "md",
}: UserAvatarProps): JSX.Element {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-vc-navy font-bold text-white",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-10 w-10 text-sm",
        size === "lg" && "h-12 w-12 text-base",
        className,
      )}
      aria-label={name ?? "User avatar"}
      title={name}
    >
      {imageUrl !== undefined ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : initials !== undefined ? (
        initials
      ) : (
        <UserRound className="h-5 w-5" />
      )}
    </div>
  );
}

function getInitials(name: string | undefined): string | undefined {
  if (name === undefined || name.trim().length === 0) {
    return undefined;
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
