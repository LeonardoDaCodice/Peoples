import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigation from './src/navigation/AppNavigation';
import AuthNavigation from './src/navigation/AuthNavigation';
import UseAuthentication from './src/utils/UseAuthentication';
import LoadingScreen from './src/components/LoadingScreen';

const Stack = createStackNavigator();

export default function App() {
  const { userProfile, isLoading } = UseAuthentication();

  if (isLoading) {
    // Puoi personalizzare una schermata di caricamento qui
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userProfile ? (
          <Stack.Screen name="AppNav" component={AppNavigation} />
        ) : (
          <Stack.Screen name="AuthNav" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}