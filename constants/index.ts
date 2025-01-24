export const navItems = [
  {
    name: 'Dashboard',
    icon: '/jsm-assets/icons/dashboard.svg',
    url: '/',
  },
  {
    name: 'Documents',
    icon: '/jsm-assets/icons/documents.svg',
    url: '/documents',
  },
  {
    name: 'Images',
    icon: '/jsm-assets/icons/images.svg',
    url: '/images',
  },
  {
    name: 'Media',
    icon: '/jsm-assets/icons/video.svg',
    url: '/media',
  },
  {
    name: 'Others',
    icon: '/jsm-assets/icons/others.svg',
    url: '/others',
  },
];

export const avatarPlaceholderUrl = 'https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png';

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: '/jsm-assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: 'Details',
    icon: '/jsm-assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Share',
    icon: '/jsm-assets/icons/share.svg',
    value: 'share',
  },
  {
    label: 'Download',
    icon: '/jsm-assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/jsm-assets/icons/delete.svg',
    value: 'delete',
  },
];

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB