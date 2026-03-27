import { DropdownMenuLink } from '@/app/rwd-demo/components/dropdown-menu-link';
import { NavbarLink } from '@/app/rwd-demo/components/navbar-link';
import { RWD_DEMO_ROUTES } from '@/app/rwd-demo/routes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="font-bold">Logo</h1>
          {/* Navbar */}
          <nav className="hidden md:flex items-center justify-center gap-4">
            {RWD_DEMO_ROUTES.map((route) => {
              return (
                <NavbarLink key={route.href} route={route} />
              );
            })}
          </nav>
          {/* Mobile Button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {RWD_DEMO_ROUTES.map((route) => {
                  return <DropdownMenuLink key={route.href} route={route} />;
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
