const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

defaultConfig.resolver.unstable_enablePackageExports = false;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

const wrappedConfig = wrapWithReanimatedMetroConfig(config);
// const mergedConfig = mergeConfig(getDefaultConfig(__dirname), wrappedConfig);
const mergedConfig = mergeConfig(defaultConfig, wrappedConfig);

module.exports = withNativeWind(mergedConfig, { input: "./global.css" });
