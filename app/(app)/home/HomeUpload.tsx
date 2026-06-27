'use client';

import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';

export default function HomeUpload({
  householdId,
  userId,
}: {
  householdId: string;
  userId: string;
}) {
  const router = useRouter();
  return (
    <PhotoUploader
      householdId={householdId}
      userId={userId}
      label="Add a photo"
      onUploaded={() => router.refresh()}
    />
  );
}
