export interface ColorEntity {
  id: number;
  slug: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  meaning?: string;
  relic?: string;
  poem?: string;
  poet?: string;
  dynasty?: string;
  solar_term?: string;
  location?: string;
  story?: string;
}

export interface RawColorEntity {
  id: number;
  name: string;
  hex: string;
  rgb: [number, number, number];
  meaning?: string;
  relic?: string;
  poem?: string;
  poet?: string;
  dynasty?: string;
  solar_term?: string;
  location?: string;
  story?: string;
}
