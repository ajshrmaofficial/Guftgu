import React from 'react';
import {Dimensions, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import {useUser} from '../utility/context/UserContext';
import useLocation from '../utility/hooks/useLocation';
import {TouchableOpacity} from 'react-native';
import { mapStyle } from '../utility/definitionStore';
import { useAppGetState, useAppSetState } from '../utility/redux/useAppState';
import { setLocationPermission } from '../utility/redux/userSlice';

function Map(): React.JSX.Element {

  const height = Dimensions.get('window').height;

  // const {
  //   friendLocations,
  //   myLocation,
  //   isLocationPermission,
  //   setLocationPermission,
  // } = useUser();
  const friendLocations = useAppGetState(state => state.user.friendLocations);
  const myLocation = useAppGetState(state => state.user.myLocation);
  const isLocationPermission = useAppGetState(state => state.user.locationPermission);
  const setState = useAppSetState()
  const {errorMsg, isLoading} = useLocation();

  const grantLocationPermission = async () => {
    if(Platform.OS === 'android') {
      try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setState(setLocationPermission(true));
      } else {
        return;
      }
    } catch (error) {
      console.log('Error', error);
      setState(setLocationPermission(false));
    }} 
    else {
      setState(setLocationPermission(true));
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : !isLocationPermission ? (
        <>
          <Text>Locatin Permisssion not granted !!</Text>
          <TouchableOpacity onPress={grantLocationPermission}>
            <Text>Grant Location Permission</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <MapView
            style={styles.map}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={myLocation}
            region={myLocation}
            followsUserLocation={true}
            showsMyLocationButton={false}>
            {friendLocations.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
              />
            ))}
          </MapView>
        </>
      )}
      {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  // TODO: temporary stylesheet, replace with tailwindcss
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  errorMsg: {
    position: 'absolute',
    top: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});
