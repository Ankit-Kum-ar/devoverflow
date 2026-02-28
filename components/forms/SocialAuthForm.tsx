import Image from "next/image";
import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const buttonClasses =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-lg px-4 py-3.5";
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClasses}>
        <Image
          src="/icons/github.svg"
          width={20}
          height={20}
          alt="GitHub icon"
          className="mr-2.5 invert-colors object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>
      <Button className={buttonClasses}>
        <Image
          src="/icons/google.svg"
          width={20}
          height={20}
          alt="Google icon"
          className="mr-2.5 invert-colors object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
