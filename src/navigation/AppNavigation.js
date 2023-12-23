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
import LocationScreen from '../screens/feature/LocationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatScreen from '../screens/feature/ChatScreen';


const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'black',
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#ffffff', // Colore di sfondo della barra di navigazione
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'th' : 'th';
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
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profilo" component={ProfileScreen} />
  </Tab.Navigator>
);

export default HomeTabs;