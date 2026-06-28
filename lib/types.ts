// Hand-written DB row types mirroring supabase/migrations/0001_init.sql.
// (Match the schema — do not redefine tables.)

export type CareGroup =
  | 'bulbous_no_soak'
  | 'soft_rosette_soak_safe'
  | 'xeric_grey'
  | 'wispy';

export type ReviewStatus = 'sorted' | 'needs_review' | 'unsorted';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  units: 'cm' | 'in';
  push_opt_in: boolean;
  created_at: string;
}

export interface Household {
  id: string;
  name: string;
  quiet_hours_start: number;
  quiet_hours_end: number;
  created_at: string;
}

export interface HouseholdMember {
  household_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}

export interface HouseholdInvite {
  id: string;
  household_id: string;
  code: string;
  email: string | null;
  expires_at: string;
  accepted_by: string | null;
  created_at: string;
}

export interface Species {
  id: string;
  slug: string;
  binomial: string;
  authority: string | null;
  common_names: string[];
  care_group: CareGroup;
  native_range: string | null;
  max_size_cm: number | null;
  mesic_xeric: string | null;
  trichome_notes: string | null;
  watering: string | null;
  light: string | null;
  fertilizer: string | null;
  air: string | null;
  bloom: string | null;
  pups: string | null;
  display: string | null;
  calgary_notes: string | null;
  sources: string[];
  // richer care-sheet fields (migration 0004)
  humidity: string | null;
  temp_range: string | null;
  bloom_season: string | null;
  dry_time: string | null;
  difficulty: string | null;
  propagation: string | null;
  troubleshooting: string | null;
  common_mistakes: string | null;
  hero_image_url: string | null;
  created_at: string;
}

export interface Specimen {
  id: string;
  household_id: string;
  name: string;
  species_id: string | null;
  code: string | null;
  acquired: string | null;
  notes: string | null;
  confident: boolean;
  cover_photo_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  household_id: string;
  specimen_id: string | null;
  observation_id: string | null;
  storage_path: string;
  width: number | null;
  height: number | null;
  taken_on: string | null;
  is_bloom: boolean;
  caption: string | null;
  suggested_specimen_id: string | null;
  match_confidence: number | null;
  review_status: ReviewStatus;
  uploaded_by: string | null;
  created_at: string;
}

export const CARE_GROUP_META: Record<
  CareGroup,
  { label: string; color: string; emoji: string }
> = {
  bulbous_no_soak: { label: 'Bulbous · no soak', color: '#caa45a', emoji: '🧅' },
  soft_rosette_soak_safe: { label: 'Soft rosette · soak-safe', color: '#5aa9c9', emoji: '🌹' },
  xeric_grey: { label: 'Xeric grey', color: '#b08bbf', emoji: '🏜️' },
  wispy: { label: 'Wispy', color: '#d4a98f', emoji: '🌾' },
};

export const PHOTO_BUCKET = 'photos';
