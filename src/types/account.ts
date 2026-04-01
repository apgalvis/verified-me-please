export type VerificationStatus = 'verified' | 'pending' | 'not_verified';

export type ContactFieldType = 'email' | 'phone' | 'whatsapp';

export interface ContactField {
  id: string;
  label: string;
  value: string;
  type: ContactFieldType;
  status: VerificationStatus;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  memberSince: string;
}
