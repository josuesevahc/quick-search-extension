import { APP_META } from '../config/app';

export const getManifest = (version: string) => ({
  manifest_version: 3,
  name: APP_META.productName,
  short_name: APP_META.shortName,
  version: version,
  description: APP_META.description,
  permissions: ['storage'],
  host_permissions: [],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png'
    }
  },
  options_page: 'src/options/options.html',
  background: {
    service_worker: 'background.js',
    type: 'module'
  },
  icons: {
    '16': 'icons/icon-16.png',
    '32': 'icons/icon-32.png',
    '48': 'icons/icon-48.png',
    '128': 'icons/icon-128.png'
  }
});
