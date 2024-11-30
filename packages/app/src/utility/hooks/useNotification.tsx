import { useState, useEffect, useCallback } from 'react';
import notifee, {
  AndroidImportance, 
  AuthorizationStatus, 
  AndroidStyle,
  AndroidCategory,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface NotificationData {
  screen: 'Guftgu' | 'Mehfil' | 'None';
  type: any;
  message: string;
  fromUsername: string;
  toUsername: string;
  isGroupMessage?: string;
  [key: string]: string | undefined;  // Add index signature
}

// Standalone notification function
export const sendLocalNotification = async (notification: any) => {
  try {
    const channelId = notification.notification.android.channelId === 'chat' ? 'chat' : 'default';
    const isGroup = notification.data.isGroupMessage === 'true';
    
    let title: string;
    if(isGroup) title = 'Group Message';
    else if(notification.data.screen === 'Guftgu'){
      if(notification.data.type === 'chat') title = `Message from ${notification.data.fromUsername} 👀`;
      else title = 'New Guftgu Message';
    }
    else if(notification.data.screen === 'Mehfil'){
      if(notification.data.type === 'chat') title = `Someone messaged in Mehfil 🤗`;
      else title = 'New Mehfil Message';
    } else {
      if(notification.data.type === 'misc') title = 'Hey there 👋';
      else title = 'New Notification';
    }

    await notifee.displayNotification({
      title,
      body: notification.data.message,
      data: notification.data as { [key: string]: string },  // Type assertion here
      android: {
        channelId,
        smallIcon: 'ic_stat_name',
        category: notification.data.type === 'chat' ? AndroidCategory.MESSAGE : AndroidCategory.SOCIAL,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        style: { type: AndroidStyle.BIGTEXT, text: "notif.data.message" },
      },
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

// Notification channels setup
const setupNotificationChannels = async () => {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    await notifee.createChannel({
      id: 'chat',
      name: 'Chat Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (error) {
    console.error('Error creating notification channels:', error);
  }
};

// Notification initialization function
export const initializeNotifications = async () => {
  try {
    // Request permissions first
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('User notification permissions rejected');
      return false;
    }

    // Register for background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
      if (!remoteMessage.data) return;
      sendLocalNotification(remoteMessage);
    });

    await setupNotificationChannels();
    return true;
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
    return false;
  }
};

export const useNotifications = () => {
  const [permission, setPermission] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        const permissionStatus = await notifee.requestPermission();
        const isGranted = permissionStatus.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
        setPermission(isGranted);
        return isGranted;
      }
      
      if (Platform.OS === 'android') {
        const permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        const isGranted = permissionStatus === PermissionsAndroid.RESULTS.GRANTED;
        setPermission(isGranted);
        return isGranted;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const handleForegroundEvent = useCallback((event: any) => {
    console.log('Foreground notifee event:', event);
    if (!event.notification) return;
    
  }, []);

  useEffect(() => {
    let unsubscribeForeground: () => void;
    let unsubscribeMessage: () => void;

    const setup = async () => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          console.log('No notification permission');
          return;
        }

        // Token refresh handler
        messaging().onTokenRefresh(async (token) => {
          console.log('New FCM token:', token);
          await AsyncStorage.setItem('fcmToken', token);
          // Send new token to your backend here
        });

        // Foreground message handler with improved logging
        unsubscribeMessage = messaging().onMessage(async remoteMessage => {
          console.log('Received foreground message:', JSON.stringify(remoteMessage));
          if (!remoteMessage.data) return;
          sendLocalNotification(remoteMessage);
        });
        
        // Foreground notification handler
        // unsubscribeForeground = notifee.onForegroundEvent(handleForegroundEvent);
        
      } catch (error) {
        console.error('Error in notification setup:', error);
      }
    };

    setup();

    return () => {
      unsubscribeForeground?.();
      unsubscribeMessage?.();
    };
  }, [requestPermission, handleForegroundEvent]);

  return {
    hasPermission: permission,
    requestPermission,
  };
};
