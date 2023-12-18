/*  
    AppNavigation: 
        Questa navigazione viene solitamente utilizzata per le schermate dell'app principale, accessibili solo agli utenti autenticati.
        Può includere schermate come la home, il profilo dell'utente, le impostazioni, ecc. Quando un utente è autenticato,
        l'app dovrebbe inizializzare con AppNavigation.
*/

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Importa la HomeScreen
import ProfileScreen from '../screens/feature/ProfileScreen';
import HeartScreen from '../screens/feature/ChatScreen';
import LocationScreen from '../screens/feature/LocationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';


const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'Profilo') {
          iconName = focused ? 'user' : 'user';
        } else if (route.name === 'Chat') {
          iconName = focused ? 'comment' : 'comment-o';
        } else if (route.name === 'Posizione') {
          iconName = focused ? 'map-marker' : 'map-marker';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Posizione" component={LocationScreen} />
    <Tab.Screen name="Chat" component={HeartScreen} />
    <Tab.Screen name="Profilo" component={ProfileScreen} />
  </Tab.Navigator>
);

export default HomeTabs;