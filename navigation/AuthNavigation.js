/*  
    AuthNavigation: 
        Questa navigazione viene utilizzata per le schermate legate all'autenticazione, come la schermata di login,
        la registrazione e altre schermate associate all'autenticazione. Quando un utente non è autenticato o è in fase di autenticazione,
        l'app dovrebbe inizializzare con AuthNavigation. Una volta che l'utente si autentica con successo, potresti passare a AppNavigation.
*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/login/LoginScreen';
import EmailLoginScreen from '../screens/login/EmailLoginScreen';
import ConfigureProfileScreen from '../screens/feature/ConfigureProfileScreen';

const Stack = createStackNavigator();

const AuthNavigation = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
    <Stack.Screen name="ConfigureProfile" component={ConfigureProfileScreen} />
    {/* Aggiungi altre schermate qui */}
  </Stack.Navigator>
);

export default AuthNavigation;
