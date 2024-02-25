import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Linking } from 'react-native';
import { Card, Image } from 'react-native-elements';
import UseAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../components/LoadingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';


import InstagramIcon from '../assets/socialIcon/www.instagram.com.png';
import TwitterIcon from '../assets/socialIcon/twitter.com.png';
import TikTokIcon from '../assets/socialIcon/www.tiktok.com.png';
import OnlyfnasIcon from '../assets/socialIcon/onlyfans.com.png';
import LinkedinIcon from '../assets/socialIcon/linkedin.png';


const socialIcons = [
  { name: 'Facebook', link: 'https://www.facebook.com/', icon: 'facebook-square', image: null },
  { name: 'Instagram', link: 'https://www.instagram.com/', icon: InstagramIcon, image: null },
  { name: 'Twitter', link: 'https://twitter.com/', icon: TwitterIcon, image: null },
  { name: 'TikTok', link: 'https://www.tiktok.com/@', icon: TikTokIcon, image: null },
  { name: 'OnlyFans', link: 'https://www.onlyfans.com/', icon: OnlyfnasIcon, image: null },
  { name: 'Linkedin', link: 'https://www.linkedin.com/', icon: LinkedinIcon, image: null },
  // Aggiungi altre icone social se necessario
];

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
      const newFlippedCards = isFlipped
        ? prevFlippedCards.filter((id) => id !== cardId)
        : [...prevFlippedCards, cardId];

      Animated.timing(flipAnimations[cardId], {
        toValue: newFlippedCards.includes(cardId) ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return newFlippedCards;
    });
  };

  const openSocialProfile = (profileLink) => {
    Linking.openURL(profileLink);
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
                    //styles.cardsContair,
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
                      <View style={styles.userInfoContainer}>
                        <Text style={styles.userInfoText}>Nome: {user.name} {user.surname}</Text>
                        {user.socialLinks && (
                          <View style={styles.iconContainer}>
                            {Object.keys(user.socialLinks).map((social, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => openSocialProfile(`https://www.${social}.com/${user.socialLinks[social]}`)}
                              >
                                <View style={styles.iconWithTextContainer}>
                                  {socialIcons.map((icon) =>
                                    icon.name.toLowerCase() === social.toLowerCase() ? (
                                      <React.Fragment key={social}>
                                        {typeof icon.icon === 'string' ? (
                                          <Icon name={icon.icon} size={34} color="#3b5998" style={styles.icon} />
                                        ) : (
                                          <Image source={icon.icon} style={styles.icon} />
                                        )}
                                        <Text style={styles.iconText}>{icon.name}</Text>
                                      </React.Fragment>
                                    ) : null
                                  )}
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ) : (
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
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
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  userNameContainer: {
    padding: 10,
    width: '100%',
    height: 80,
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
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconWithTextContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30, 
    width: '60%', 
  },
  iconText: {
    marginLeft: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
});
 