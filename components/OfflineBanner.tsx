'use client';

import { useEffect, useState } from 'react';

// Honest connectivity banner (spec §7). Polite live region for screen readers.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-30 bg-[#9a5a23] px-5 py-2 text-center text-sm font-semibold text-white"
    >
      You&apos;re offline — your changes will sync when you&apos;re back.
    </div>
  );
}
