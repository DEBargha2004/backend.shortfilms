export const ALLOWED_MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
};

export type AllowedMimeType = keyof typeof ALLOWED_MIME_TYPES;

export const MIMETYPE_RULES = {
  userProfile: ['image/png', 'image/jpeg', 'image/webp'],
  post: ['image/png', 'image/jpeg', 'image/webp'],
  video: ['video/mp4'],
  thumbnail: ['image/png', 'image/jpeg', 'image/webp'],
} as const satisfies Record<string, AllowedMimeType[]>;

export type EntityType = keyof typeof MIMETYPE_RULES;
