import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useUser} from '../utility/context/UserContext';
import useLocation from '../utility/hooks/useLocation';
import {TouchableOpacity} from 'react-native';

function Map(): React.JSX.Element {
  const {
    friendLocations,
    myLocation,
    isLocationPermission,
    setLocationPermission,
  } = useUser();
  const {errorMsg, isLoading} = useLocation();

  const grantLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermission(true);
      } else {
        return;
      }
    } catch (error) {
      console.log('Error', error);
      setLocationPermission(false);
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
            showsUserLocation={true}
            initialRegion={myLocation}
            region={myLocation}
            followsUserLocation={true}
            showsMyLocationButton={true}>
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
