import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import LoadingScreen from '../../components/RadarScreen';
import UseAuthentication from '../../utils/UseAuthentication';
import DistanceSelector from '../../components/DistanceSelector';
import { LinearGradient } from 'expo-linear-gradient';

const people = [
  { id: 1, name: 'Persona 1', latitude: 41.111, longitude: 16.8554000, imageUrl: require('./persona1.png') },
  { id: 2, name: 'Persona 2', latitude: 37.789, longitude: -122.431, imageUrl: require('./persona1.png') },
  // Aggiungi altre persone secondo necessità
];

const MyLocationButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 2,
    }}
  >
    <LinearGradient
      colors={['#000000', '#004d00']}
      style={{
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: 'white' }}>Vai alla tua posizione</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distanza, setDistanza] = useState(0.05);//Imposta la distanza iniziale
  const [peopleVisualizzati, setPeopleVisualizzati] = useState([]);
  const mapRef = useRef(null);

  const { uploadUserLocation, getUsersData } = UseAuthentication();

  useEffect(() => {
    (async () => {
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
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Aggiorna la posizione dell'utente nel documento dell'utente
        uploadUserLocation(location.coords.latitude, location.coords.longitude);

        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    })();
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
      const allUsersData = await getUsersData();
      const peopleFiltrati = allUsersData.filter((user) => {
        if (user.latitude && user.longitude) {
          const distanzaTraPersonEPosizione = calcolaDistanzaTraCoordinate(
            location.coords.latitude,
            location.coords.longitude,
            user.latitude,
            user.longitude
          );

          return distanzaTraPersonEPosizione <= distanza;
        }
        return false;
      });

      setPeopleVisualizzati(peopleFiltrati);

      const newMapSize = calculateMapSize(location.coords.latitude, location.coords.longitude, distanza);

      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...newMapSize,
      });
    } catch (error) {
      console.error('Errore durante il recupero dei dati utente:', error);
      // Gestisci l'errore a seconda delle tue esigenze
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

        {peopleVisualizzati.map((person) => {
          const latitude = parseFloat(person.latitude);
          const longitude = parseFloat(person.longitude);

          if (isNaN(latitude) || isNaN(longitude)) {
            return null;
          }

          return (
            <Marker
              key={person.id}
              coordinate={{
                latitude,
                longitude,
              }}
              title={person.name}
              description={`Posizione di ${person.name}`}
            >
              {person.profileImage ? (
                <Image
                  source={{ uri: person.profileImage }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 20,
                    borderColor: 'red',
                    borderWidth: 2,
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/default-profile-image.png')}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 20,
                    borderColor: 'red',
                    borderWidth: 2,
                  }}
                />
              )}
            </Marker>
          );
        })}

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

      {/* Bottone "Vai alla tua posizione" */}
      <MyLocationButton
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
      />

      {/* Componente DistanceSelector */}
      <DistanceSelector
        distanza={distanza}
        setDistanza={setDistanza}
        filtraPeople={filtraPeople}
      />
    </View>
  );
}
