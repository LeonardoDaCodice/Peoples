// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import useAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../utils/LoadingScreen';

export default function HomeScreen({ navigation }) {
  const { isLoading, user, getUserData } = useAuthentication();
  const [loggingOut, setLoggingOut] = useState(false);
  const [userNickname, setUserNickname] = useState(null);

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

  if (isLoading || loggingOut) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>Welcome, {userNickname || 'Guest'}!</Text>
      {/* Altre componenti dell'app */}
    </View>
  );
}
