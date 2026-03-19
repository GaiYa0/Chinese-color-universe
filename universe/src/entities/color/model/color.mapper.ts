import type { ColorEntity, RawColorEntity } from "@/entities/color/model/color.types";

export function createColorSlug(name: string, id: number) {
  return `${encodeURIComponent(name)}-${id}`;
}

export function normalizeColor(raw: RawColorEntity): ColorEntity {
  return {
    ...raw,
    slug: createColorSlug(raw.name, raw.id),
  };
}

export function normalizeColors(rawColors: RawColorEntity[]): ColorEntity[] {
  return rawColors.map(normalizeColor);
}
