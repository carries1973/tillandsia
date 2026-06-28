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
  takenOn: string;
  isBloom: boolean;
  error?: string;
}

let counter = 0;
const nextKey = () => `q${Date.now()}_${counter++}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function PhotoUploader({
  householdId,
  userId,
  specimenId,
  onUploaded,
  label = 'Add photos',
  showDetails = false,
}: {
  householdId: string;
  userId: string;
  specimenId?: string;
  onUploaded?: () => void;
  label?: string;
  // When true, surface a "taken on" date + "Bloom photo" toggle so older
  // shots (e.g. last year's bloom) can be backdated and flagged.
  showDetails?: boolean;
}) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [takenOn, setTakenOn] = useState(todayISO());
  const [isBloom, setIsBloom] = useState(false);
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
          taken_on: item.takenOn,
          is_bloom: item.isBloom,
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
    // Snapshot the chosen date/flag now so they stick to this batch even if
    // the controls change before the uploads finish.
    const batchTakenOn = showDetails ? takenOn || todayISO() : todayISO();
    const batchIsBloom = showDetails ? isBloom : false;
    const queued: QueueItem[] = files.map((file) => ({
      key: nextKey(),
      file,
      preview: URL.createObjectURL(file),
      status: 'queued',
      takenOn: batchTakenOn,
      isBloom: batchIsBloom,
    }));
    setItems((prev) => [...queued, ...prev]);
    queued.forEach(uploadItem);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {showDetails && (
        <div className="mb-3 flex flex-wrap items-end gap-3 rounded-card bg-green-tint px-4 py-3">
          <div>
            <label htmlFor="photo-taken-on" className="block text-xs font-semibold text-green-deep">
              Taken on
            </label>
            <input
              id="photo-taken-on"
              type="date"
              value={takenOn}
              max={todayISO()}
              onChange={(e) => setTakenOn(e.target.value)}
              className="mt-1 min-h-[44px] rounded-xl border border-[#dfe3da] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
            />
          </div>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-green-deep">
            <input
              type="checkbox"
              checked={isBloom}
              onChange={(e) => setIsBloom(e.target.checked)}
              className="h-5 w-5 accent-green"
            />
            <span>🌸 Bloom photo</span>
          </label>
          <p className="w-full text-xs text-ink-soft">
            Set the date these were taken — backdate older shots like last year&apos;s bloom.
            Applies to the next photos you add.
          </p>
        </div>
      )}
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
