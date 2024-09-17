import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import useLocation from '../utility/hooks/useLocation';
import {TouchableOpacity} from 'react-native';
import { mapStyle } from '../utility/definitionStore';
import useMiscStore from '../utility/store/miscStore';
import useUserStore from '../utility/store/userStore';
import useAppStore from '../utility/store/appStore';

// TODO: have to fix some things here, like grant location permission button function, etc...

function Map(): React.JSX.Element {
  // const height = Dimensions.get('window').height;
  const friendLocations = useMiscStore(state => state.friendsLocations);
  const myLocation = useUserStore(state => state.myLocation);
  const isLocationPermission = useAppStore(state => state.locationPermission);
  const {errorMsg, isLoading} = useLocation();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : !isLocationPermission ? (
        <>
          <Text>Locatin Permisssion not granted !!</Text>
          <TouchableOpacity onPress={()=>{}}> 
            <Text>Grant Location Permission</Text>
          </TouchableOpacity>
        </>
      ) : ( myLocation &&
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
