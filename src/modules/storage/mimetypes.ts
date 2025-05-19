export const ALLOWED_MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export type AllowedMimeType = keyof typeof ALLOWED_MIME_TYPES;

export const MIMETYPE_RULES = {
  userProfile: ['image/png', 'image/jpeg', 'image/webp'],
} as const satisfies Record<string, AllowedMimeType[]>;

export type EntityType = keyof typeof MIMETYPE_RULES;
