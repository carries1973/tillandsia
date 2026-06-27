'use client';

import { useEffect, useState } from 'react';

// Gentle, skippable iOS "Add to Home Screen" tip (spec §5). Never gates the app.
export default function InstallTip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('tillandsia.installTip') === 'dismissed';
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS-only
      window.navigator.standalone === true;
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setShow(isIOS && !standalone && !dismissed);
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-card bg-green-tint px-4 py-3 text-sm text-green-deep">
      <span aria-hidden="true" className="text-lg">📲</span>
      <p className="flex-1">
        Tip: tap <strong>Share → Add to Home Screen</strong> to open your garden like an app
        (needed for watering reminders later).
      </p>
      <button
        onClick={() => {
          localStorage.setItem('tillandsia.installTip', 'dismissed');
          setShow(false);
        }}
        aria-label="Dismiss tip"
        className="min-h-[44px] px-1 font-bold text-green-deep"
      >
        ✕
      </button>
    </div>
  );
}
