import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigation from './navigation/AppNavigation';
import AuthNavigation from './navigation/AuthNavigation';
import UseAuthentication from './utils/UseAuthentication';
import LoadingScreen from './utils/LoadingScreen';

const Stack = createStackNavigator();

export default function App() {
  const { isAuthenticated, isLoading } = UseAuthentication();

  if (isLoading) {
    // Puoi personalizzare una schermata di caricamento qui
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="AppNav" component={AppNavigation} />
        ) : (
          <Stack.Screen name="AuthNav" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}