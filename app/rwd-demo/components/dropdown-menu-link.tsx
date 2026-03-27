'use client';

import { BASE_ROUTE, ROUTE } from '@/app/rwd-demo/routes';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DropdownMenuLink({ route }: { route: ROUTE }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === BASE_ROUTE) {
      return pathname === BASE_ROUTE;
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <DropdownMenuItem key={route.href} asChild>
      <Link
        href={route.href}
        className={isActive(route.href) ? 'font-bold opacity-50 pointer-events-none' : ''}
        aria-current={isActive(route.href) ? 'page' : undefined}
      >
        {route.name}
      </Link>
    </DropdownMenuItem>
  );
}
