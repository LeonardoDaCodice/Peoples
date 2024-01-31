import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card, Image } from 'react-native-elements';
import UseAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../components/LoadingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function HomeScreen({ navigation }) {
  const { isLoading, user, getUserData, getUsersData, getFriendsData } = UseAuthentication();
  const [userNickname, setUserNickname] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const flipAnimations = useRef({}).current;


  
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data...');
      try {
        const userData = await getUserData();
        if (userData) {
          const friendsData = await getFriendsData();
          setUsersData(friendsData);
        } else {
          console.error('Dati utente non trovati.');
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      }
    };
  
    fetchUserData();
  }, []); // Usa un array di dipendenze vuoto per evitare il re-rendering continuo
  

  

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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.welcomeText}>Welcome, {userNickname || 'Guest'}!</Text>
        <View style={styles.cardsContainer}>
          {usersData.map((user, index) => {
            const cardId = user.uid || index;

            if (!flipAnimations[cardId]) {
              flipAnimations[cardId] = new Animated.Value(0);
            }

            return (
              <TouchableOpacity key={cardId} onPress={() => handleCardPress(cardId)}>
              <Animated.View
                style={[
                  styles.cardsContainer, // Applicare gli stili del contenitore della carta
                  flippedCards.includes(cardId) && { zIndex: 1 },
                  {
                    transform: [
                      {
                        rotateY: flipAnimations[cardId].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Card containerStyle={[styles.card, { height: 280 }]}>
  {flippedCards.includes(cardId) ? (
    // Contenuto visualizzato quando la carta è girata
    <View style={styles.userInfoContainer}>
      <Text style={styles.userInfoText}>Nome: {user.name}</Text>
      <Text style={styles.userInfoText}>Cognome: {user.surname}</Text>
      {/* Aggiungi altre informazioni desiderate */}
      {user.socialLinks && user.socialLinks.facebook && (
      <TouchableOpacity onPress={() => openSocialProfile(user.socialLinks.facebookProfile)}>
        <Icon name="facebook-square" size={30} color="#3b5998" />
      </TouchableOpacity>
    )}
    {user.socialLinks && user.socialLinks.instagram && (
      <TouchableOpacity onPress={() => openSocialProfile(user.socialLinks.instagramProfile)}>
        <Icon name="instagram" size={30} color="#833ab4" />
      </TouchableOpacity>
    )}
    {user.socialLinks && user.socialLinks.twitter && (
      <TouchableOpacity onPress={() => openSocialProfile(user.socialLinks.twitterProfile)}>
        <Icon name="twitter" size={30} color="#1da1f2" />
      </TouchableOpacity> 
    )}
    {user.socialLinks && user.socialLinks.tiktok && ( 
      <TouchableOpacity onPress={() => openSocialProfile(user.socialLinks.tiktokProfile)}>
        <Icon name="" size={30} color="#69c9d0" />
      </TouchableOpacity>
    )}
    {user.socialLinks && user.socialLinks.onlyfans && (
      <TouchableOpacity onPress={() => openSocialProfile(user.socialLinks.onlyfansProfile)}>
        <Icon name="heart" size={30} color="#ff3f3f" />
      </TouchableOpacity>
    )} 
    {/* Aggiungi altre icone social per gli altri profili, se necessario */}
  </View>
  ) : (
    // Contenuto visualizzato quando la carta non è girata
    <>
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
    </>
  )}
</Card>

              </Animated.View>
            </TouchableOpacity>

            );
          })}
        </View>
        {/* Altre componenti dell'app */}
      </ScrollView>
    </View>
  );
}

// Rimani con gli stili e il resto del codice invariato


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
    borderRadius: 16,
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: 200, // Imposta un'altezza fissa per l'immagine del profilo
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  userNameContainer: {
    padding: 10,
    width: '100%',
    height: 80, // Imposta un'altezza fissa per il contenitore del nome dell'utente
  },
  userInfoContainer: {
    padding: 10,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
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
