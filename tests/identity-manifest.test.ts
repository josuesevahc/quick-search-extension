import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { APP_META } from '../src/config/app';
import { getManifest } from '../src/manifest/manifest.template';

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as {
  description: string;
  version: string;
};

describe('Quick Search identity', () => {
  it('uses Quick Search as the public product identity', () => {
    expect(APP_META).toEqual({
      productName: 'Quick Search',
      shortName: 'Quick Search',
      description: 'Alternância rápida entre buscadores.',
    });
    expect(packageJson.description).toBe(APP_META.description);
  });

  it('keeps the generated manifest consistent with APP_META', () => {
    const manifest = getManifest(packageJson.version);

    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe(APP_META.productName);
    expect(manifest.short_name).toBe(APP_META.shortName);
    expect(manifest.description).toBe(APP_META.description);
    expect(manifest.permissions).toEqual(['storage']);
    expect(manifest.host_permissions).toEqual([]);
  });
});
