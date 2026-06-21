import ROUTES from "@/app/constants/route";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({ id, name, image, className = "h-9 w-9", fallbackClassName }: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {image ? (
          <Image
            src={image}
            alt={name || "User"}
            className="object-cover"
            width={36}
            height={36}
          />
        ) : (
          <AvatarFallback className={cn("primary-vairant font-space-grotesk font-bold tracking-wider text-white", fallbackClassName)}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
