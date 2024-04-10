import Geolocation from '@react-native-community/geolocation';
import {useUser} from '../context/UserContext';
import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {chatSocket} from '../socket/socketConfig';
import {useAuth} from '../context/AuthContext';
import { useAppGetState, useAppSetState } from '../redux/useAppState';
import { addMyLocation, setLocationPermission } from '../redux/userSlice';

interface LocationData {
  isLocationPermission: boolean;
  errorMsg: string | null;
  isLoading: boolean;
}

export default function useLocation(): LocationData {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // const {
  //   myLocation,
  //   addMyLocation,
  //   isLocationPermission,
  //   setLocationPermission,
  // } = useUser();
  const myLocation = useAppGetState(state => state.user.myLocation)
  const locationPermission = useAppGetState(state => state.user.locationPermission)
  const setState = useAppSetState();

  const checkLocationPermission = async () => {
    console.log('checking...');
    let alreadyHavePermission;
    if (Platform.OS === 'android') {
      alreadyHavePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    if (Platform.OS === 'ios') {
      alreadyHavePermission = true;
    }
    if (alreadyHavePermission) {
      setState(setLocationPermission(true));
      return true;
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setState(setLocationPermission(true));
          return true;
        } else {
          setErrorMsg('Location permission denied');
          return false;
        }
      } catch (error) {
        setErrorMsg('Error in getting location permission');
        console.log('Error', error);
        setState(setLocationPermission(false));
        return false;
      }
    }
  };

  useEffect(() => {
    checkLocationPermission()
      .then(locationPermission => {
        if (!locationPermission) {
          return;
        }
        Geolocation.getCurrentPosition(
          (data: {coords: {latitude: any; longitude: any}}) => {
            setState(addMyLocation(
              {
                ...myLocation,
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
              }
            ))
            chatSocket.emit('location', {
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
            });
            setIsLoading(false);
          },
          (error: any) => {
            setErrorMsg('Error in getting current location');
            console.log(error);
          },
          {enableHighAccuracy: true, maximumAge: 1000},
        );
      })
      .catch(error => {
        setErrorMsg('Error in getting location permission');
        console.log(error);
      });
    setIsLoading(false);
  }, []);

  return {
    isLocationPermission: locationPermission,
    errorMsg,
    isLoading,
  };
}
