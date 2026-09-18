export const printFormats = {
  A4: [210, 297],
  A5: [148, 210],
  A6: [105, 148],
  EURO: [105, 210],
  CARD: [90, 50],
  PYRAMID: [297, 210],
} as const;

export type PrintFormat = keyof typeof printFormats;
export type MaterialOptions = {
  locale?: 'ru' | 'en';
  format: PrintFormat;
  name: string;
  prompt: string;
  brand: string;
  caption: string;
  url: string;
};

// Four-module quiet zone is part of the exported vector, not CSS padding.
export function qrVector(modules: { size: number; get: (row: number, col: number) => number }) {
  const paths: string[] = [];
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) paths.push(`M${col + 4},${row + 4}h1v1h-1z`);
    }
  }
  return { size: modules.size + 8, path: paths.join('') };
}
