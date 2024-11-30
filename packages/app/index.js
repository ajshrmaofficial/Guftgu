/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeNotifications } from './src/utility/hooks/useNotification';
// import messaging from '@react-native-firebase/messaging';

initializeNotifications();

AppRegistry.registerComponent(appName, () => App);
