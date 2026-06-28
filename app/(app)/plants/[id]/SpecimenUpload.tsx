'use client';

import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';

export default function SpecimenUpload({
  householdId,
  userId,
  specimenId,
}: {
  householdId: string;
  userId: string;
  specimenId: string;
}) {
  const router = useRouter();
  return (
    <PhotoUploader
      householdId={householdId}
      userId={userId}
      specimenId={specimenId}
      showDetails
      onUploaded={() => router.refresh()}
    />
  );
}
