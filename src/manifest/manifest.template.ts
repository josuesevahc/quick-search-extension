export const getManifest = (version: string) => ({
  manifest_version: 3,
  name: '__MSG_appName__',
  short_name: '__MSG_appShortName__',
  version: version,
  description: '__MSG_appDescription__',
  default_locale: 'en',
  permissions: ['storage'],
  host_permissions: [],
  action: {
    default_popup: 'popup.html',
    default_icon: {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png'
    }
  },
  options_page: 'options.html',
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
