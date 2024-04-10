module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['module:react-native-dotenv', 'nativewind/babel', ["@babel/plugin-proposal-decorators", { "legacy": true }], 'react-native-reanimated/plugin'],
};
