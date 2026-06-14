import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const SIZES = [16, 32, 48, 128];
const ICON_DIR = join(process.cwd(), 'public', 'icons');
const SVG_PATH = join(ICON_DIR, 'icon.svg');

if (!existsSync(ICON_DIR)) {
  mkdirSync(ICON_DIR, { recursive: true });
}

console.log('Generating icons from SVG...');

await Promise.all(
  SIZES.map(async size => {
    const outputPath = join(ICON_DIR, `icon-${size}.png`);
    await sharp(SVG_PATH).resize(size, size).png().toFile(outputPath);
    console.log(`- Generated icon-${size}.png`);
  })
);

console.log('Icon generation completed.');
