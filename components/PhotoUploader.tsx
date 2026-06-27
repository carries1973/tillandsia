'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { processImage } from '@/lib/image';
import { PHOTO_BUCKET } from '@/lib/types';

type ItemStatus = 'queued' | 'processing' | 'uploading' | 'done' | 'error';

interface QueueItem {
  key: string;
  file: File;
  preview: string;
  status: ItemStatus;
  error?: string;
}

let counter = 0;
const nextKey = () => `q${Date.now()}_${counter++}`;

export default function PhotoUploader({
  householdId,
  userId,
  specimenId,
  onUploaded,
  label = 'Add photos',
}: {
  householdId: string;
  userId: string;
  specimenId?: string;
  onUploaded?: () => void;
  label?: string;
}) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, patch: Partial<QueueItem>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  // Upload one item end-to-end. Never throws — failures stay in the queue for retry.
  const uploadItem = useCallback(
    async (item: QueueItem) => {
      const supabase = createClient();
      try {
        update(item.key, { status: 'processing', error: undefined });
        const { blob, width, height } = await processImage(item.file);

        update(item.key, { status: 'uploading' });
        const path = `${householdId}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, blob, { contentType: 'image/jpeg', upsert: false });
        if (upErr) throw upErr;

        const { error: rowErr } = await supabase.from('photos').insert({
          household_id: householdId,
          specimen_id: specimenId ?? null,
          storage_path: path,
          width,
          height,
          uploaded_by: userId,
          taken_on: new Date().toISOString().slice(0, 10),
        });
        if (rowErr) throw rowErr;

        update(item.key, { status: 'done' });
        onUploaded?.();
        // Clear finished items after a beat so the tray doesn't pile up.
        setTimeout(() => setItems((prev) => prev.filter((it) => it.key !== item.key)), 1500);
      } catch (e) {
        update(item.key, {
          status: 'error',
          error: e instanceof Error ? e.message : 'Upload failed',
        });
      }
    },
    [householdId, specimenId, userId, onUploaded]
  );

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const queued: QueueItem[] = files.map((file) => ({
      key: nextKey(),
      file,
      preview: URL.createObjectURL(file),
      status: 'queued',
    }));
    setItems((prev) => [...queued, ...prev]);
    queued.forEach(uploadItem);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-green px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-green-deep"
      >
        <span aria-hidden="true">📷</span> {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={onPick}
        className="sr-only"
        aria-label="Choose photos to upload"
      />

      {items.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3" aria-label="Upload queue">
          {items.map((it) => (
            <li key={it.key} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.preview}
                alt=""
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/35 text-center text-xs font-semibold text-white">
                {it.status === 'done' ? (
                  <span aria-label="Uploaded">✓</span>
                ) : it.status === 'error' ? (
                  <button
                    onClick={() => uploadItem(it)}
                    className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-[#a23b3b]"
                  >
                    Retry ↻
                  </button>
                ) : (
                  <span aria-live="polite">
                    {it.status === 'processing' ? 'Preparing…' : 'Uploading…'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
