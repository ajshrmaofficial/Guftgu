module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['nativewind/babel', ["@babel/plugin-proposal-decorators", { "legacy": true }], 'react-native-reanimated/plugin'],
};
