import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getManifest } from '../src/manifest/manifest.template';

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as {
  version: string;
};
const version = packageJson.version;
const manifest = getManifest(version);
const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

writeFileSync(
  join(distDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('dist/manifest.json generated successfully.');
