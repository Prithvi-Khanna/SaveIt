const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    unstable_enablePackageExports: true,
    unstable_disableLegacyExports: true,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  transformer: {
    unstable_allowRequireContext: true,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
});
