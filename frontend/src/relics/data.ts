export type RelicKey =
  | 'genesis' | 'aeternum' | 'constellation' | 'eclipse' | 'painita'
  | 'apex' | 'aureon' | 'obsidian' | 'alfalium' | 'omeguium';

export interface RelicMeta {
  key: RelicKey;
  name: string;
  maxSupply: number;
}

export const RELICS: RelicMeta[] = [
  { key: 'genesis',       name: 'Genesis',       maxSupply: 1 },
  { key: 'aeternum',      name: 'Aeternum',      maxSupply: 10 },
  { key: 'constellation', name: 'Constellation', maxSupply: 100 },
  { key: 'eclipse',       name: 'Eclipse',       maxSupply: 500 },
  { key: 'painita',       name: 'Painita',       maxSupply: 2500 },
  { key: 'apex',          name: 'Apex',          maxSupply: 10000 },
  { key: 'aureon',        name: 'Aureon',        maxSupply: 25000 },
  { key: 'obsidian',      name: 'Obsidian',      maxSupply: 75000 },
  { key: 'alfalium',      name: 'Alfalium',      maxSupply: 250000 },
  { key: 'omeguium',      name: 'Omeguium',      maxSupply: 1000000 },
];

export const RELIC_ORDER: Record<string, number> = RELICS.reduce(
  (acc, r, i) => ({ ...acc, [r.key]: i }),
  {} as Record<string, number>
);
