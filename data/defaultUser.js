export function computeInitials(firstName, lastName) {
  const a = firstName?.trim()?.[0] ?? ''
  const b = lastName?.trim()?.[0] ?? ''
  return (a + b).toUpperCase()
}

export const DEFAULT_SETTINGS = {
  notifOrders: true,
  notifPromotions: false,
  notifNewsletter: false,
  notifArtisans: true,
  profilePublic: true,
  showEmail: false,
  currency: 'MAD',
  address: { street: '', city: '', postal: '', country: 'Maroc' },
}

export const DEFAULT_CLIENT = {
  id: 'demo-client',
  role: 'client',
  firstName: 'Amina',
  lastName: 'Benali',
  email: 'amina.benali@gmail.com',
  phone: '+212 6 12 34 56 78',
  avatarUrl: null,
  bannerUrl: null,
  memberSince: '2024',
  cooperativeName: null,
  region: null,
  specialty: null,
  specialtyLabel: null,
  description: null,
  settings: { ...DEFAULT_SETTINGS },
}

export const DEFAULT_VENDOR = {
  id: 'demo-vendor',
  role: 'vendor',
  firstName: 'Fatima',
  lastName: 'Ouazzani',
  email: 'fatima.ouazzani@coop.ma',
  phone: '+212 5 24 88 22 10',
  avatarUrl: null,
  bannerUrl: null,
  memberSince: '2022',
  cooperativeName: 'Coopérative Ouazzani',
  region: 'Marrakech',
  specialty: 'Cosmétiques',
  specialtyLabel: 'Savons & Soins',
  description: 'Artisane spécialisée dans la fabrication de savons beldi et produits de soin naturels issus de l\'agriculture biologique marocaine.',
  settings: { ...DEFAULT_SETTINGS },
}
