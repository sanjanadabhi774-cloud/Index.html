export interface Ceremony {
  id: string;
  name: string;
  arabicSubtitle?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "04:00 PM"
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
  dressCode?: string;
  description: string;
  iconType: 'haldi' | 'mehendi' | 'sangeet' | 'nikah' | 'walima' | 'rukhsati' | 'custom';
}

export interface WeddingTheme {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  accentGold: string;
  accentGoldLight: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  envelopeColor: string;
  waxSealColor: string;
}

export interface WeddingData {
  groomName: string;
  groomPrefix?: string;
  groomParents: string;
  brideName: string;
  bridePrefix?: string;
  brideParents: string;
  invitationMessage: string;
  bismillahText: string;
  quranicVerse: string;
  quranicReference: string;
  mainWeddingDate: string; // YYYY-MM-DD
  mainWeddingTime: string; // e.g. "05:30 PM"
  mainCeremonyTitle: string; // e.g. "Nikah & Baraat"
  mainVenueName: string;
  mainVenueAddress: string;
  mainMapsUrl: string;
  couplePhotoUrl: string;
  photoStyle: 'arch' | 'oval' | 'circle';
  themeId: string;
  ceremonies: Ceremony[];
  rsvpPhone: string;
  rsvpContactPerson: string;
  customMusicUrl?: string;
  musicTrackTitle: string;
  isCustomMusic: boolean;
  selectedAudioPreset: string;
  hijriDate: string;
  // All customizable page text fields
  envelopeGreeting?: string;
  envelopeInstruction?: string;
  countdownHeading?: string;
  countdownSubtitle?: string;
  scratchCardHeading?: string;
  scratchCardSubtext?: string;
  scratchCoverText?: string;
  scratchCoverSubtext?: string;
  scratchRevealedBadge?: string;
  ceremoniesSectionHeading?: string;
  ceremoniesSectionSubheading?: string;
  rsvpHeading?: string;
  rsvpSubheading?: string;
  closingDuaArabic?: string;
  closingDuaTranslation?: string;
  cardTitleBadge?: string;
}

export interface GuestRSVP {
  guestName: string;
  attending: 'yes' | 'no';
  numberOfGuests: number;
  ceremoniesAttending: string[];
  blessingMessage: string;
}
