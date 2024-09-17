import Geolocation from '@react-native-community/geolocation';
import {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {chatSocket} from '../socket/socketConfig';
import useUserStore from '../store/userStore';
import useAppStore from '../store/appStore';
import { LATITUDE_DELTA, Location, LONGITUDE_DELTA } from '../definitionStore';

// interface LocationData {
//   isLocationPermission: boolean;
//   errorMsg: string | null;
//   isLoading: boolean;
// }

// TODO: majority has been refactored, some things have to be taken into consideration e.g error state and loading state...

export default function useLocation(){
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const locationPermission = useAppStore(state => state.locationPermission);
  const setMyLocation = useUserStore(state => state.setMyLocation);
  const setLocationPermission = useAppStore(state => state.setLocationPermission);

  const checkLocationPermission = useCallback(async () => {
    if(locationPermission) return true;

    let granted: boolean = false;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if(!granted) {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        granted = result === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'ios') {
      granted = true;
    }

    setLocationPermission(granted);
    return granted;
  }, [locationPermission, setLocationPermission]);

    const getCurrentPosition = useCallback(() => {
      return new Promise<Location>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: any) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          (error: any) => reject(error),
          {enableHighAccuracy: true, maximumAge: 1000, timeout: 15000}
        );
      });
    }, []);

  useEffect(() => {
    let isMounted: boolean = true;
    const abortController = new AbortController();

    const fetchLocation = async () => {
      try {
        const hasPermission = await checkLocationPermission();
        if(!hasPermission) {
          throw new Error('Location permission not granted');
        }

        const location = await getCurrentPosition();
        if(isMounted) {
          setMyLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          });
          chatSocket.emit('location', location);
          setIsLoading(false);
        }
      } catch (error) {
        if(isMounted){
          setErrorMsg(error instanceof Error ? error.message : 'An unknown error occured');
          setIsLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [checkLocationPermission, getCurrentPosition, setMyLocation]);
}
