import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Image } from 'react-native-elements';
import useAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../utils/LoadingScreen';

export default function HomeScreen({ navigation }) {
  const { isLoading, user, getUserData } = useAuthentication();
  const [loggingOut, setLoggingOut] = useState(false);
  const [userNickname, setUserNickname] = useState(null);
  const [usersData, setUsersData] = useState([]);

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

  if (isLoading || loggingOut) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userNickname || 'Guest'}!</Text>
      <View style={styles.cardsContainer}>
        {usersData.map((user) => (
          <Card key={user.id} containerStyle={styles.card}>
            <Image source={{ uri: user.profileImage }} style={styles.userImage} />
            <Text style={styles.userName}>{user.nickname}</Text>
          </Card>
        ))}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '60%', // Occupa il 48% della larghezza del container
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 55,
  },
  userImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
