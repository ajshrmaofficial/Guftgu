import { useState, useEffect, useCallback } from 'react';
import notifee, { EventType, AndroidImportance, AuthorizationStatus, AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: any;
}

export const useNotifications = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [initialNotification, setInitialNotification] = useState<Notification | null>(null);
  const [permission, setPermission] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      setPermission(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED);
      return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    } else if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        setPermission(result === PermissionsAndroid.RESULTS.GRANTED);
        return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }, []);

  const createDefaultChannel = useCallback(async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }, []);

  const setupNotifications = useCallback(async () => {
    await createDefaultChannel();

    // Set up foreground handler
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DELIVERED:
          setNotification({
            id: detail.notification?.id || '',
            title: detail.notification?.title || '',
            body: detail.notification?.body || '',
            data: detail.notification?.data,
          });
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          // Handle notification press here
          break;
      }
    });
  }, [createDefaultChannel]);

  const checkInitialNotification = useCallback(async () => {
    // Check if app was opened by a notification
    const initialNotif = await notifee.getInitialNotification();
    if (initialNotif && initialNotif.notification.id) {
      setInitialNotification({
        id: initialNotif.notification.id,
        title: initialNotif.notification.title || '',
        body: initialNotif.notification.body || '',
        data: initialNotif.notification.data,
      });
    }
  }, []);

  useEffect(() => {
    const setup = async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await checkInitialNotification();
        const unsubscribeForeground = await setupNotifications();

        // Firebase message handling for when the app is in the foreground
        const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
          await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
            android: {
              channelId: 'default',
              smallIcon: 'guftgu',
            },
          });
        });

        return () => {
          unsubscribeForeground();
          unsubscribeMessage();
        };
      }
    };

    setup();
  }, [requestPermission, setupNotifications, checkInitialNotification]);

  const sendLocalNotification = useCallback(async (notif: Omit<Notification, 'id'>) => {
    if (permission) {
      try {
        await notifee.displayNotification({
            title: notif.title,
            body: notif.body,
            data: notif.data,
            android: {
              channelId: 'default',
              smallIcon: 'ic-stat-name', // used for app icon that will be shown in notification
                                        // another thing is largeIcon which is for showing secondary things like user profile picture in a chat scenario inside the notification
              pressAction: {
                id: 'default',
              },
              style: { type: AndroidStyle.BIGTEXT, text: notif.body },
            },
          });
      } catch (error) {
        console.error('Error sending local notification:', error);
      }
    } else {
      console.log('Notification permission not granted');
    }
  }, [permission]);

  return {
    notification,
    initialNotification,
    sendLocalNotification,
    hasPermission: permission,
    requestPermission,
  };
};
