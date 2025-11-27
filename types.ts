export interface CatProfile {
  name: string;
  breed: string;
  color: string;
  lastSeenAddress: string;
  lastSeenDate: string;
  ownerName: string;
  phone: string;
  description: string;
  photoDataUrl: string | null;
  features: string[]; // e.g., "White paws", "No collar"
}

export enum AppStep {
  LANDING = 0,
  DETAILS = 1,
  PHOTO = 2,
  PREVIEW = 3,
}

export interface AIGenerationState {
  isLoading: boolean;
  error: string | null;
}