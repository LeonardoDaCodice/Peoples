import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import LoadingScreen from '../../utils/LoadingScreen';
import UseAuthentication from '../../utils/UseAuthentication';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distanza, setDistanza] = useState(1);
  const [peopleVisualizzati, setPeopleVisualizzati] = useState([]);
  const mapRef = useRef(null);

  const { uploadUserLocation, getUsersData } = UseAuthentication();

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            'Attenzione',
            'Per utilizzare questa funzionalità, devi accettare i permessi di geolocalizzazione.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
          );
          return;
        }
      }

      try {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);

        const usersData = await getUsersData();
        setPeopleVisualizzati(usersData);
        
        uploadUserLocation(userLocation.coords.latitude, userLocation.coords.longitude);

        mapRef.current.animateToRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    };

    const fetchData = async () => {
      try {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);

        const usersData = await getUsersData();

        const peopleFiltrati = usersData.filter((person) => {
          const distanzaTraPersonEPosizione = calcolaDistanzaTraCoordinate(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            person.latitude,
            person.longitude
          );

          return distanzaTraPersonEPosizione <= distanza;
        });

        setPeopleVisualizzati(peopleFiltrati);

        const newMapSize = calculateMapSize(userLocation.coords.latitude, userLocation.coords.longitude, distanza);

        mapRef.current.animateToRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          ...newMapSize,
        });
      } catch (error) {
        console.error('Error getting location or user data:', error);
        setErrorMsg('Error getting location or user data');
      }
    };

    getLocation();
    fetchData();
  }, []);

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return <LoadingScreen />;
  }

  const filtraPeople = async () => {
    try {
      const usersData = await getUsersData();
      const peopleFiltrati = usersData.filter((person) => {
        const distanzaTraPersonEPosizione = calcolaDistanzaTraCoordinate(
          location.coords.latitude,
          location.coords.longitude,
          person.latitude,
          person.longitude
        );
  
        return distanzaTraPersonEPosizione <= distanza;
      });
  
      setPeopleVisualizzati(peopleFiltrati);
  
      const newMapSize = calculateMapSize(location.coords.latitude, location.coords.longitude, distanza);
  
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...newMapSize,
      });
    } catch (error) {
      console.error('Error getting user data:', error);
      setErrorMsg('Error getting user data');
    }
  };
  

  const calculateMapSize = (latitude, longitude, distanza) => {
    const aspectRatio = 1;
    const radiusInDegrees = distanza / 111.32;
    const latitudeDelta = radiusInDegrees * aspectRatio;
    const longitudeDelta = radiusInDegrees;

    return {
      latitudeDelta,
      longitudeDelta,
    };
  };

  const calcolaDistanzaTraCoordinate = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location ? location.coords.latitude : 37.78825,
          longitude: location ? location.coords.longitude : -122.4324,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="La tua posizione"
            description="Posizione corrente"
          />
        )}

        {peopleVisualizzati.map((person) => (
          <Marker
            key={person.id}
            coordinate={{
              latitude: person.latitude,
              longitude: person.longitude,
            }}
            title={person.name}
            description={`Posizione di ${person.name}`}
          >
            <Image
              source={person.imageUrl}
              style={{
                width: 35,
                height: 35,
                borderRadius: 20,
                borderColor: 'red',
                borderWidth: 2,
              }}
            />
          </Marker>
        ))}

        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={distanza * 1000}
            strokeColor="green"
            fillColor="rgba(0, 128, 0, 0.3)"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'green',
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => {
          if (location) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            });
          }
        }}
      >
        <Text style={{ color: 'white' }}>Vai alla tua posizione</Text>
      </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
          <View style={{ marginTop: 10, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>Distanza selezionata: </Text>
            <Text style={{ color: 'green', fontWeight: 'bold' }}>{distanza.toFixed(2)} km</Text>
          </View>

          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={0.05}
            maximumValue={0.25}
            step={0.05}
            value={distanza}
            minimumTrackTintColor="green"
            thumbTintColor="green"
            onValueChange={(value) => setDistanza(value)}
            onSlidingComplete={filtraPeople}
          />
        </View>
      </View>
    </View>
  );
}
