import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/route";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
  id: string;
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  image,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={cn("relative", className)}>
        {image ? (
          <Image
            src={image}
            alt={name || "User"}
            className="object-cover"
            fill
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-vairant font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
