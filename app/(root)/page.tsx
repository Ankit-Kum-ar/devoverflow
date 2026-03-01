import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "../constants/route";

async function Home() {
  const session = await auth();
  console.log("Session in Home page:", session);
  return (
    <div className="h1-bold">
      Hello World !!
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
}

export default Home;
