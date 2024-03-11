import Geolocation from '@react-native-community/geolocation';
import {useUser} from '../context/UserContext';
import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {chatSocket} from '../socket/socketConfig';
import {useAuth} from '../context/AuthContext';

interface LocationData {
  isLocationPermission: boolean;
  errorMsg: string | null;
  isLoading: boolean;
}

export default function useLocation(): LocationData {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {authData} = useAuth();
  const {username} = authData;
  const {
    myLocation,
    addMyLocation,
    isLocationPermission,
    setLocationPermission,
  } = useUser();

  const checkLocationPermission = async () => {
    console.log('checking...');
    const alreadyHavePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (alreadyHavePermission) {
      setLocationPermission(true);
      return true;
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          return true;
        } else {
          setErrorMsg('Location permission denied');
          return false;
        }
      } catch (error) {
        setErrorMsg('Error in getting location permission');
        console.log('Error', error);
        setLocationPermission(false);
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
          (data: { coords: { latitude: any; longitude: any; } }) => {
            addMyLocation({
              ...myLocation,
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
            });
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
    isLocationPermission,
    errorMsg,
    isLoading,
  };
}
