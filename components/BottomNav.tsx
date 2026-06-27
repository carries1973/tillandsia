'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/home', label: 'Home', emoji: '🏡' },
  { href: '/plants', label: 'Plants', emoji: '🪴' },
  { href: '/album', label: 'Album', emoji: '🖼️' },
  { href: '/species', label: 'Care', emoji: '📖' },
  { href: '/settings', label: 'Settings', emoji: '⚙️' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-[#e8e6dd] bg-card/95 backdrop-blur"
    >
      <ul className="flex">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold ${
                  active ? 'text-green' : 'text-ink-soft'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {it.emoji}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
