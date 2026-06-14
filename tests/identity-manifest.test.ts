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
      description: 'Quickly switch search providers from a compact popup.',
    });
    expect(packageJson.description).toBe(APP_META.description);
  });

  it('keeps the generated manifest localized and minimally permissioned', () => {
    const manifest = getManifest(packageJson.version);

    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe('__MSG_appName__');
    expect(manifest.short_name).toBe('__MSG_appShortName__');
    expect(manifest.description).toBe('__MSG_appDescription__');
    expect(manifest.default_locale).toBe('en');
    expect(manifest.permissions).toEqual(['storage']);
    expect(manifest.host_permissions).toEqual([]);
    expect(manifest.action.default_popup).toBe('popup.html');
    expect(manifest.options_page).toBe('options.html');
  });
});
