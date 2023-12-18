import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import LoadingScreen from '../../utils/LoadingScreen';


const monumenti = [
  { id: 1, nome: 'Monumento 1', latitude: 41.111, longitude: 16.8554000, imageUrl: require('./monumento1.png') },
  { id: 2, nome: 'Monumento 2', latitude: 37.789, longitude: -122.431 },
  // Aggiungi altri monumenti secondo necessità
];

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distanza, setDistanza] = useState(1); // Valore di default per la distanza
  const [monumentiVisualizzati, setMonumentiVisualizzati] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        // I permessi non sono stati concessi
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
        setMonumentiVisualizzati(monumenti);

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

  const filtraMonumenti = () => {
    const monumentiFiltrati = monumenti.filter((monumento) => {
      const distanzaTraMonumentoEPosizione = calcolaDistanzaTraCoordinate(
        location.coords.latitude,
        location.coords.longitude,
        monumento.latitude,
        monumento.longitude
      );

      return distanzaTraMonumentoEPosizione <= distanza;
    });

    setMonumentiVisualizzati(monumentiFiltrati);


    // Calcola la nuova dimensione della mappa in base al raggio del cerchio
    const newMapSize = calculateMapSize(location.coords.latitude, location.coords.longitude, distanza);
    


    // Anima la mappa alla nuova regione
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...newMapSize,
    });
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

        {monumentiVisualizzati.map((monumento) => (
          <Marker
            key={monumento.id}
            coordinate={{
              latitude: monumento.latitude,
              longitude: monumento.longitude,
            }}
            title={monumento.nome}
            description={`Posizione del ${monumento.nome}`}
          >
            <Image
              source={monumento.imageUrl}
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
            radius={distanza * 1000} // Converti la distanza da km a metri
            strokeColor="green"
            fillColor="rgba(0, 128, 0, 0.3)" // Colore del riempimento del cerchio con opacità
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
          // Azione da eseguire quando l'utente preme il pulsante
          if (location) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001,//0.001 equivale a 10 metri
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
            thumbTintColor="green"  // Impostare il colore del pallino
            onValueChange={(value) => setDistanza(value)}
            onSlidingComplete={filtraMonumenti}
          />
        </View>
      </View>
    </View>
  );
}
