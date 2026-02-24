import { Button } from "@/components/ui/button";
import { LINKS } from "@/lib/constants/links";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h2 className="text-6xl">Home Page</h2>
        <ul className="flex flex-col gap-4">
          <li>
            <Button>
              <Link href={ROUTES.CS_DEMO_VOLUME}>Cornerstone volume demo</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link href={ROUTES.CS_DEMO_SINGLE_STACK}>Cornerstone single stack demo</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link href={ROUTES.V_DAY_LETTER}>V day letter</Link>
            </Button>
          </li>
          <li>
            <Button>
              <a href={LINKS.NO_PRESSURE} target="_blank" rel="noopener noreferrer">No Pressure</a>
            </Button>
          </li>
          <li>
            <Button>
              <a href={LINKS.REACT_WEATHER_APP} target="_blank" rel="noopener noreferrer">React Weather App</a>
            </Button>
          </li>
          <li>
            <Button>
              <a href={LINKS.FUN_EVENT} target="_blank" rel="noopener noreferrer">FunEvent</a>
            </Button>
          </li>
          <li>
            <Button>
              <a href={LINKS.LAN_TIBETAN} target="_blank" rel="noopener noreferrer">荏芊堪卓 藏文教學網</a>
            </Button>
          </li>

        </ul>
      </main>
    </div>
  );
}
