'use client';

import { useEffect } from 'react';

// Registers the PWA service worker (the shell Web Push needs in Phase 2B).
export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* non-fatal */
      });
    }
  }, []);
  return null;
}
