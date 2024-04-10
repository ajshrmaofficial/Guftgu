import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LATITUDE_DELTA, LocationMarker, LocationPayload, LONGITUDE_DELTA, MyLocation} from '../definitionStore';

interface UserState {
  locationPermission: boolean;
  friendLocations: LocationMarker[];
  myLocation: MyLocation;
  darkMode: boolean;
}

const initialState: UserState = {
  darkMode: false,
  locationPermission: false,
  friendLocations: [],
  myLocation: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermission = action.payload;
    },
    setFriendLocations: (state, action: PayloadAction<LocationPayload>) => {
      const {fromUsername, location} = action.payload;
      const existingIndex = state.friendLocations.findIndex(
        item => item.title === fromUsername,
      );

      if (existingIndex !== -1) {
        state.friendLocations[existingIndex].latlng = location;
      } else {
        state.friendLocations.push({
          latlng: location,
          title: fromUsername,
          description: null,
        });
      }
    },
    addMyLocation: (state, action: PayloadAction<MyLocation>) => {
      state.myLocation = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  setLocationPermission,
  setFriendLocations,
  addMyLocation,
  setDarkMode,
} = userSlice.actions;
export default userSlice.reducer;
