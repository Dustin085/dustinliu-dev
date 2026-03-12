import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Layout() {
  return (
    <header className="bg-gray-800 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="font-bold">Logo</h1>
        {/* Navbar */}
        <nav className="hidden md:flex items-center justify-center gap-4">
          <Link href={'./'}>Home</Link>
          <Link href={'./'}>About</Link>
          <Link href={'./'}>Contact</Link>
        </nav>
        {/* Mobile Button */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">☰</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={'./'}>Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={'./'}>About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={'./'}>Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
