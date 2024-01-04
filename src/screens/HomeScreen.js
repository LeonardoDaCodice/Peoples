import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Alert, Linking } from 'react-native';
import { Card, Image } from 'react-native-elements';
import UseAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../components/RadarScreen';
import DistanceSelector from '../components/DistanceSelector';
import { LocationUtils } from '../utils/LocationUtils';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const { isLoading, user, getUserData, getUsersData } = UseAuthentication();
  const [userNickname, setUserNickname] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const flipAnimations = useRef({}).current;
  const [distanza, setDistanza] = useState(0.25);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserNickname(userData.nickname);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      }
    };

    fetchUserData();
  }, [getUserData]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Attenzione',
            'Per utilizzare questa funzionalità, devi accettare i permessi di geolocalizzazione.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
              {
                text: 'Apri impostazioni',
                onPress: () => {
                  // Apre le impostazioni dell'applicazione per consentire all'utente di abilitare i permessi
                  Linking.openSettings();
                },
              },
            ]
          );
          return;
        }

        setHasLocationPermission(true);

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);

        // Resto del tuo codice per animare la mappa
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const allUsersData = await getUsersData();
        const filteredUsers = LocationUtils.filterPeopleByDistance(allUsersData, userLocation, distanza);
        setUsersData(filteredUsers);
      } catch (error) {
        console.error('Errore durante il recupero dei dati utenti:', error);
      }
    };

    fetchUsersData();
  }, [userLocation, distanza]);

  const handleCardPress = (cardId) => {
    setFlippedCards((prevFlippedCards) => {
      const isFlipped = prevFlippedCards.includes(cardId);

      // Inverti il valore di flip
      const newFlippedCards = isFlipped
        ? prevFlippedCards.filter((id) => id !== cardId)
        : [...prevFlippedCards, cardId];

      // Avvia l'animazione di flip
      Animated.timing(flipAnimations[cardId], {
        toValue: newFlippedCards.includes(cardId) ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return newFlippedCards;
    });
  };

  const resetFlip = () => {
    setFlippedCards([]);

    Object.keys(flipAnimations).forEach((cardId) => {
      Animated.timing(flipAnimations[cardId], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleDistanceChange = (value) => {
    setDistanza(value);
    // Add logic for distance-based filtering here
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasLocationPermission) {
    // Mostra un messaggio diverso o un componente per richiedere il permesso
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={styles.permissionDeniedText}>
          Per utilizzare questa funzionalità, devi concedere i permessi di geolocalizzazione.
        </Text>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <Text style={styles.openSettingsText}>Apri impostazioni</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.welcomeText}>Welcome, {userNickname || 'Guest'}!</Text>
        <View style={styles.cardsContainer}>
          {usersData.map((user, index) => {
            const cardId = user.uid || index; // Utilizza user.uid se disponibile, altrimenti usa l'indice

            if (!flipAnimations[cardId]) {
              flipAnimations[cardId] = new Animated.Value(0);
            }

            return (
              <TouchableOpacity key={cardId} onPress={() => handleCardPress(cardId)}>
                <Animated.View
                  style={[
                    flippedCards.includes(cardId) && { zIndex: 1 },
                    {
                      transform: [
                        {
                          rotateY: flipAnimations[cardId].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Card containerStyle={styles.card}>
                    {user.profileImage ? (
                      <Image source={{ uri: user.profileImage }} style={styles.userImage} />
                    ) : (
                      <Image
                        source={require('../assets/default-profile-image.png')}
                        style={styles.userImage}
                      />
                    )}
                    <View style={styles.userNameContainer}>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
                        {user.nickname}
                      </Text>
                    </View>
                  </Card>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Altre componenti dell'app */}
      </ScrollView>
      <DistanceSelector distanza={distanza} setDistanza={handleDistanceChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100, // Adjust as needed based on the DistanceSelector height
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  userNameContainer: {
    padding: 10,
    width: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionDeniedText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  openSettingsText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
