// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import useAuthentication from '../utils/UseAuthentication';
import LoadingScreen from '../utils/LoadingScreen';

export default function HomeScreen({ navigation }) {
  const { handleLogout, isLoading, user } = useAuthentication();
  const userName = user ? user.displayName : 'Guest'; // Assicurati che il tuo oggetto user contenga il nome dell'utente

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutPress = async () => {
    setLoggingOut(true);
    await handleLogout();
    setLoggingOut(false);
    navigation.navigate('Login');
  };

  useEffect(() => {
    console.log("Definire l'user in HomeScreen, dichiarandolo all'interno di UseAuthenticated per poi passarlo ad HomeScreen per utilizzare il nome dell'utente loggato");
  }, [user]);
  

  if (isLoading || loggingOut) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>Welcome, {userName}!</Text>
      <Button
        title="Logout"
        onPress={handleLogoutPress}
      />
      {/* Altre componenti dell'app */}
    </View>
  );
}
