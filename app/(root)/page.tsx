import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "../constants/route";

async function Home() {
  const session = await auth();
  console.log("Session in Home page:", session);
  return (
    <div className="h1-bold">
      Hello World !!
    </div>
  );
}

export default Home;
