import ROUTES from "@/app/constants/route";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

interface Props {
  id: string;
  name: string;
  image?: string;
  className?: string;
}

const UserAvatar = ({ id, name, image, className = "h-9 w-9" }: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avata  r className={className}>
        {image ? (
          <Image
            src={image}
            alt={name || "User"}
            className="object-cover"
            width={36}
            height={36}
          />
        ) : (
          <AvatarFallback className="primary-vairant font-space-grotesk font-bold tracking-wider text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
