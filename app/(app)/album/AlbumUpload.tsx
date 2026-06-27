'use client';

import PhotoUploader from '@/components/PhotoUploader';

export default function AlbumUpload({
  householdId,
  userId,
}: {
  householdId: string;
  userId: string;
}) {
  // The album subscribes to realtime, so new photos appear on their own.
  return <PhotoUploader householdId={householdId} userId={userId} label="Add photos" />;
}
