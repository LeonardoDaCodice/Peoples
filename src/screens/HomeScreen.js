import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card, Image } from 'react-native-elements';
import useAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../utils/LoadingScreen';

export default function HomeScreen({ navigation }) {
  const { isLoading, user, getUserData } = useAuthentication();
  const [userNickname, setUserNickname] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const flipAnimations = useRef({}).current;

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
    const fetchUsersData = async () => {
      try {
        const exampleUsersData = [
          { id: '1', nickname: 'Salvatore Forte', profileImage: 'https://example.com/user1.jpg' },
          { id: '2', nickname: 'User2', profileImage: 'https://example.com/user2.jpg' },
          { id: '3', nickname: 'User3', profileImage: 'https://example.com/user3.jpg' },
          // Aggiungi altri utenti secondo necessità
        ];

        setUsersData(exampleUsersData);
      } catch (error) {
        console.error('Errore durante il recupero dei dati utenti:', error);
      }
    };

    fetchUsersData();
  }, []);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userNickname || 'Guest'}!</Text>
      <View style={styles.cardsContainer}>
        {usersData.map((user) => {
          if (!flipAnimations[user.id]) {
            flipAnimations[user.id] = new Animated.Value(0);
          }

          return (
            <TouchableOpacity key={user.id} onPress={() => handleCardPress(user.id)}>
              <Animated.View
                style={[
                  flippedCards.includes(user.id) && { zIndex: 1 },
                  {
                    transform: [
                      {
                        rotateY: flipAnimations[user.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Card containerStyle={styles.card}>
                  <Image source={{ uri: user.profileImage }} style={styles.userImage} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
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
});
