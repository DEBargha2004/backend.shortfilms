export const ROLES = {
  ADMIN: 'admin',
  CREATOR: 'creator',
  MODERATOR: 'moderator',
} as const;

export type TRole = (typeof ROLES)[keyof typeof ROLES];
export const ROLE_VALUES = Object.values(ROLES);

export const appPageIds = [
  'home',
  'content',
  'genres',
  'techniques',
  'shorts',
  'subscriptions',
  'explore',
  'library',
  'create',
] as const;

export type TAppPageId = (typeof appPageIds)[number];

export const PERMISSIONS = {
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',

  USER_ASSIGN_ROLE: 'user.assign.role',
  USER_OTHER_DELETE: 'user.other.delete',
  USER_OTHER_UPDATE: 'user.other.update',

  POST_CREATE: 'post.create',
  POST_READ: 'post.read',
  POST_UPDATE: 'post.update',
  POST_DELETE: 'post.delete',
  POST_VERIFY: 'post.verify',

  GENRE_CREATE: 'genre.create',
  GENRE_READ: 'genre.read',
  GENRE_UPDATE: 'genre.update',
  GENRE_DELETE: 'genre.delete',

  TECHNIQUE_CREATE: 'technique.create',
  TECHNIQUE_READ: 'technique.read',
  TECHNIQUE_UPDATE: 'technique.update',
  TECHNIQUE_DELETE: 'technique.delete',

  PLAYLIST_CREATE: 'playlist.create',
  PLAYLIST_READ: 'playlist.read',
  PLAYLIST_UPDATE: 'playlist.update',
  PLAYLIST_DELETE: 'playlist.delete',
} as const;

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const PERMISSION_VALUES = Object.values(PERMISSIONS);

export const ROLE_PERMISSION_LIST: {
  role: TRole;
  permissions: TPermission[];
}[] = [
  {
    role: ROLES.ADMIN,
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,

      PERMISSIONS.USER_ASSIGN_ROLE,
      PERMISSIONS.USER_OTHER_DELETE,
      PERMISSIONS.USER_OTHER_UPDATE,

      PERMISSIONS.POST_CREATE,
      PERMISSIONS.POST_DELETE,
      PERMISSIONS.POST_READ,
      PERMISSIONS.POST_UPDATE,
      PERMISSIONS.POST_VERIFY,

      PERMISSIONS.GENRE_CREATE,
      PERMISSIONS.GENRE_READ,
      PERMISSIONS.GENRE_UPDATE,
      PERMISSIONS.GENRE_DELETE,

      PERMISSIONS.TECHNIQUE_CREATE,
      PERMISSIONS.TECHNIQUE_READ,
      PERMISSIONS.TECHNIQUE_UPDATE,
      PERMISSIONS.TECHNIQUE_DELETE,

      PERMISSIONS.PLAYLIST_CREATE,
      PERMISSIONS.PLAYLIST_READ,
      PERMISSIONS.PLAYLIST_UPDATE,
      PERMISSIONS.PLAYLIST_DELETE,
    ],
  },
  {
    role: ROLES.CREATOR,
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,

      PERMISSIONS.PLAYLIST_CREATE,
      PERMISSIONS.PLAYLIST_READ,
      PERMISSIONS.PLAYLIST_UPDATE,
      PERMISSIONS.PLAYLIST_DELETE,
    ],
  },
  {
    role: ROLES.MODERATOR,
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,

      PERMISSIONS.PLAYLIST_CREATE,
      PERMISSIONS.PLAYLIST_READ,
      PERMISSIONS.PLAYLIST_UPDATE,
      PERMISSIONS.PLAYLIST_DELETE,
    ],
  },
];

export const roleAppPagePermission = [
  {
    role: ROLES.ADMIN,
    pageIds: [
      'home',
      'content',
      'genres',
      'techniques',
      'shorts',
      'subscriptions',
    ],
  },
  {
    role: ROLES.CREATOR,
    pageIds: ['home', 'content', 'shorts', 'subscriptions'],
  },
  {
    role: ROLES.MODERATOR,
    pageIds: [
      'home',
      'content',
      'genres',
      'techniques',
      'shorts',
      'subscriptions',
    ],
  },
] as const satisfies {
  role: TRole;
  pageIds: TAppPageId[];
}[];
