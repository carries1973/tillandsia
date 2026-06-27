import Link from 'next/link';
import type { ReactNode } from 'react';

// Small shared UI primitives — soft rounded cards, ≥44px targets, focus rings.

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card bg-card shadow-soft ${className}`}>{children}</div>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-green text-white hover:bg-green-deep'
      : 'bg-green-tint text-green-deep hover:bg-[#d8e8d6]';
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
}) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition';
  const styles =
    variant === 'primary'
      ? 'bg-green text-white hover:bg-green-deep'
      : 'bg-green-tint text-green-deep hover:bg-[#d8e8d6]';
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function PageTitle({
  children,
  sub,
}: {
  children: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <header className="mb-5">
      <h1 className="font-display text-[28px] font-bold leading-tight text-ink">
        {children}
      </h1>
      {sub ? <p className="mt-1 text-[15px] text-ink-soft">{sub}</p> : null}
    </header>
  );
}

export function EmptyState({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="px-6 py-10 text-center">
      <div className="text-4xl" aria-hidden="true">
        {emoji}
      </div>
      <h2 className="mt-3 font-display text-xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-xs text-[15px] text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </Card>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton aspect-square rounded-card" />
      ))}
    </div>
  );
}

export function Badge({
  children,
  color = '#5d6b60',
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color, background: `${color}1a` }}
    >
      {children}
    </span>
  );
}
