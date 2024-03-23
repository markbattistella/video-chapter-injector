const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, 'data/icons/app-icon'),
    name: 'Video Chapter Injector',
    author: 'Mark Battistella',
    executableName: 'VideoChapterInjector',
    overwrite: true,
    appBundleId: 'com.markbattistella.video-chapter-injector',
    appCategoryType: 'public.app-category.utilities',
    win32metadata: {
      CompanyName: 'Mark Battistella',
      FileDescription: 'Inject chapters into your MP4 or MOV video files',
      OriginalFilename: 'VideoChapterInjector.exe',
      ProductName: 'Video Chapter Injector'
    },

  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'video_chapter_injector',
        authors: 'Mark Battistella',
        exe: 'VideoChapterInjector.exe',
        iconUrl: path.resolve(__dirname, 'data/icons/app-icon.ico'),
        setupIcon: path.resolve(__dirname, 'data/icons/app-icon.ico'),
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {}
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        icon: path.resolve(__dirname, 'data/icons/app-icon.png')
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: {
        icon: path.resolve(__dirname, 'data/icons/app-icon.png')
      }
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
