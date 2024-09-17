import server from '../axiosConfig';
// import {useAppSetState} from '../redux/useAppState';
// import {setAuthName, setAuthToken, setAuthUsername} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import useUserStore from '../store/userStore';

export interface Message {
  senderUsername: string;
  receiverUsername: string;
  message: string;
}

export interface bottomModalCollection {
  menuModalRef: React.RefObject<BottomSheetModal>;
  addFriendModalRef: React.RefObject<BottomSheetModal>;
  searchModalRef: React.RefObject<BottomSheetModal>;
}

const UNIT_KM_LAT = 0.009009009;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CURR_VIEW_DISTANCE = 1;
export const LATITUDE_DELTA = UNIT_KM_LAT * CURR_VIEW_DISTANCE;
export const LONGITUDE_DELTA = (WIDTH / HEIGHT) * LATITUDE_DELTA;

export interface Location { // This is the interface for the location object   
    latitude: number;
    longitude: number;
}
  
export interface MyLocation extends Location {  // This is the interface for the location object with delta
    latitudeDelta: number;
    longitudeDelta: number;
  }

export interface LocationMarker {   // This is the interface for the location marker object
    latlng: Location;
    title: string; // IMP: Will be used to store usernames for respected markers
    description: string | null;
}

export interface LocationPayload {
  fromUsername: string;
  location: Location;
}

export function useAuthFunctions() {
  // const setState = useAppSetState();
  const setAuthToken = useUserStore(state => state.setAuthToken)
  const setName = useUserStore(state => state.setName)
  const setUsername = useUserStore(state => state.setUsername)
  const login = async (username: string, password: string) => { // This function is used to login the user
    try {
      const response = await server.post('/auth/login', {
        username: username,
        passwd: password,
      });
      if (response.status === 200) {
        console.log(response.data)
        // setState(setAuthToken(response.data.authToken));
        // setState(setAuthUsername(username));
        // setState(setAuthName(response.data.name))
        // setAuthData({authToken: response.data.authToken, username: username});
        setAuthToken(response.data.authToken)
        setName(response.data.name)
        setUsername(username)
        AsyncStorage.setItem('authToken', response.data.authToken);
        AsyncStorage.setItem('name', response.data.name);
        AsyncStorage.setItem('username', username);
        return null;
      } else {
        return 'Incorrect Credentials !!';
      }
    } catch (error) {
      console.log(error);
      return 'Problem while logging in !!';
    }
  };
  
  const register = async (username: string, password: string, name: string) => { // This function is used to register the user
    try {
      const response = await server.post('/auth/register', {
        username: username,
        passwd: password,
        name: name,
      });
      if (response.status === 201) {
        return null;
      }
    } catch (error) {
      console.log(error);
      return 'Problem while SignUp !!';
    }
  };
  return {login, register};
}

export const lightTheme = {
  dark: false,
  colors: {
    primary: '#D6D6D6',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#565656',
    notification: '#E92754',
  }
}

export const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]
