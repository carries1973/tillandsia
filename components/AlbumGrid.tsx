'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PHOTO_BUCKET, type Photo } from '@/lib/types';
import { SkeletonGrid, EmptyState } from '@/components/ui';

export interface Member {
  id: string;
  name: string;
}

type Filter = 'all' | 'me' | 'blooms' | string; // string = a member id

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export default function AlbumGrid({
  householdId,
  currentUserId,
  members,
}: {
  householdId: string;
  currentUserId: string;
  members: Member[];
}) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [announce, setAnnounce] = useState('');
  const supabaseRef = useRef(createClient());

  const nameFor = useCallback(
    (id: string | null) => {
      if (!id) return 'Someone';
      if (id === currentUserId) return 'You';
      return members.find((m) => m.id === id)?.name ?? 'Someone';
    },
    [currentUserId, members]
  );

  const signUrls = useCallback(async (rows: Photo[]) => {
    const supabase = supabaseRef.current;
    const missing = rows.map((r) => r.storage_path);
    if (!missing.length) return;
    const { data } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(missing, 60 * 60);
    if (!data) return;
    setUrls((prev) => {
      const next = { ...prev };
      data.forEach((d) => {
        if (d.signedUrl && d.path) next[d.path] = d.signedUrl;
      });
      return next;
    });
  }, []);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = supabaseRef.current;
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      const rows = (data as Photo[]) ?? [];
      setPhotos(rows);
      void signUrls(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [householdId, signUrls]);

  // Realtime: new photos animate in + polite announce (spec §7)
  useEffect(() => {
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`photos:${householdId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photos', filter: `household_id=eq.${householdId}` },
        (payload) => {
          const row = payload.new as Photo;
          setPhotos((prev) => {
            if (!prev) return [row];
            if (prev.some((p) => p.id === row.id)) return prev;
            return [row, ...prev];
          });
          void signUrls([row]);
          if (row.uploaded_by && row.uploaded_by !== currentUserId) {
            setAnnounce(`${nameFor(row.uploaded_by)} added a photo`);
          }
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [householdId, currentUserId, nameFor, signUrls]);

  if (photos === null) return <SkeletonGrid count={6} />;

  const filtered = photos.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'blooms') return p.is_bloom;
    if (filter === 'me') return p.uploaded_by === currentUserId;
    return p.uploaded_by === filter; // a specific member
  });

  const others = members.filter((m) => m.id !== currentUserId);

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'me', label: '🙋 Me' },
    ...others.map((m) => ({ key: m.id, label: m.name })),
    { key: 'blooms', label: '🌸 Blooms' },
  ];

  return (
    <div>
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter photos">
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={String(c.key)}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(c.key)}
              className={`min-h-[36px] rounded-full px-3.5 text-sm font-semibold transition ${
                active ? 'bg-green text-white' : 'bg-green-tint text-green-deep'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🌱"
          title="No photos yet"
          body="Add your first photo and it’ll show up here for both of you."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <figure className="overflow-hidden rounded-card bg-card shadow-soft">
                <div className="aspect-square bg-[#ece9e1]">
                  {urls[p.storage_path] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urls[p.storage_path]}
                      alt={p.caption ?? `Plant photo added by ${nameFor(p.uploaded_by)}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="skeleton h-full w-full" aria-hidden="true" />
                  )}
                </div>
                <figcaption className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-ink-soft">
                  <span aria-hidden="true">{p.uploaded_by === currentUserId ? '🙋' : '👤'}</span>
                  <span className="truncate">{nameFor(p.uploaded_by)}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={p.created_at}>{relativeTime(p.created_at)}</time>
                  {p.is_bloom ? <span className="ml-auto" aria-label="Bloom">🌸</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
