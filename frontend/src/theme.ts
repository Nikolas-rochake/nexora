// NEXORA — Luxury Design System
// Inspired by Apple, Rolex, Hermès, Aston Martin, contemporary art museums

export const COLORS = {
  // Surfaces
  bg: '#090909',            // matte black
  bgElevated: '#101010',    // one step up (frosted layer)
  bgSecondary: '#141414',   // card interior
  bgTertiary: '#1C1C1C',    // subtle inset
  bgOverlay: 'rgba(9,9,9,0.7)',

  // Ink
  ice: '#F2ECD9',           // ice white / warm cream (never pure white)
  iceDim: '#DED6BF',
  text: '#F2ECD9',
  textDim: '#B8B0A0',
  textMuted: '#6E6759',
  textFaint: '#3A362E',

  // Metals
  gold: '#C9A961',          // matte brushed gold
  goldLight: '#E8D5A5',     // highlight
  goldDeep: '#8A7038',      // shadow
  goldFaint: 'rgba(201,169,97,0.14)',
  goldHairline: 'rgba(201,169,97,0.35)',

  // Graphite
  graphite: '#2B2B2B',
  graphiteDark: '#1A1A1A',
  graphiteLine: '#242424',

  // Borders / rules
  hairline: 'rgba(242,236,217,0.08)',
  hairlineStrong: 'rgba(242,236,217,0.18)',
  goldRule: 'rgba(201,169,97,0.55)',
};

// 8-pt rhythm — used generously for museum-like whitespace
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  gallery: 64,   // reserved for major sections
};

export const RADII = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  pill: 999,
};

export const FONTS = {
  display: 'serif' as const,
  body: 'System' as const,
};

// Typography scale — restrained
export const TYPE = {
  eyebrow: { fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' as const, fontWeight: '500' as const },
  eyebrowMd: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '500' as const },
  bodySm: { fontSize: 12, letterSpacing: 0.4, fontWeight: '400' as const },
  body: { fontSize: 14, letterSpacing: 0.2, fontWeight: '400' as const, lineHeight: 22 },
  serif: { fontFamily: 'serif' as const, fontWeight: '400' as const },
};
