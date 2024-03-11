import React, {createContext, useContext, useState} from 'react';
import {Dimensions} from 'react-native';

const UNIT_KM_LAT = 0.009009009;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CURR_VIEW_DISTANCE = 1;
const LATITUDE_DELTA = UNIT_KM_LAT * CURR_VIEW_DISTANCE;
const LONGITUDE_DELTA = (WIDTH / HEIGHT) * LATITUDE_DELTA;
//   const BOUNDARY = 100;

interface Location {
  latitude: number;
  longitude: number;
}

export interface MyLocation extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationMarker {
  latlng: Location;
  title: string; // IMP: Will be used to store usernames for respected markers
  description: string | null;
}

interface UserData {
  isLocationPermission: boolean;
  setLocationPermission: React.Dispatch<React.SetStateAction<boolean>>;
  friendLocations: LocationMarker[];
  myLocation: MyLocation;
  setFriendLocations: React.Dispatch<React.SetStateAction<LocationMarker[]>>;
  addMyLocation: (location: MyLocation) => void;
}

const UserContext = createContext<UserData>({} as UserData);

function UserProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [myLocation, setMyLocation] = useState<MyLocation>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [friendLocations, setFriendLocations] = useState<LocationMarker[]>(
    [] as LocationMarker[],
  );
  const [isLocationPermission, setLocationPermission] =
    useState<boolean>(false);

  const addMyLocation = (location: MyLocation) => {
    setMyLocation(location);
  };

  return (
    <UserContext.Provider
      value={{
        friendLocations,
        myLocation,
        setFriendLocations,
        addMyLocation,
        isLocationPermission,
        setLocationPermission,
      }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser(): UserData {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return userContext;
}

export {UserProvider, useUser};
