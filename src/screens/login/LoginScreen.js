import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


export default function LoginScreen() {
  const navigation = useNavigation();

  /*useEffect(() => {
    const checkAuthentication = async () => {
      // Controlla se c'è un ID utente memorizzato localmente
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        // L'utente è già autenticato, naviga direttamente alla Home
        navigation.navigate('Home');
      }
    };

    checkAuthentication();
  }, []);*/

  const handleTermsPress = () => {
    console.log('Termini sono stati premuti!');
    navigation.navigate('TermsScreen');
  };

  const handleGoogleLogin = () => {
    console.log('Accedi con Google');
    navigation.navigate('MainScreen');
  };

  const handleEmailLogin = () => {
    console.log('Accedi con email');
    navigation.navigate('EmailLogin');
  };

  const handlePhoneLogin = () => {
    console.log('Accedi con il numero di telefono');
    navigation.navigate('MainScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peoples</Text>
      <Text style={styles.text}>Accedi con le seguenti opzioni:</Text>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity  onPress={handleGoogleLogin}>
          <LinearGradient
            colors={['#009900', '#004d00']}
            style={[styles.button, { backgroundColor: 'green' }]}
          >
            <Text style={styles.buttonText}>Accedi con Google</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity  onPress={handleEmailLogin}>
          <LinearGradient
            colors={['#0000ff', '#000080']}
            style={[styles.button, { backgroundColor: 'blue' }]}
          >
            <Text style={styles.buttonText}>Accedi con l'email</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePhoneLogin}>
          <LinearGradient
            colors={['#808080', '#555555']}
            style={[styles.button, { backgroundColor: 'grey' }]}
          >
            <Text style={styles.buttonText}>Accedi con il numero di telefono</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleTermsPress}>
        <Text style={styles.footerText}>
          Selezionando Accedi, accetti i nostri{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Termini</Text>.
          Per avere maggiori informazioni su come elaboriamo i tuoi dati,
          puoi consultare l'informativa sulla Privacy e sui Cookie.
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '80%',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginEnd: 30,
  },
  footerLogo: {
    width: 120,
    height: 20,
  },
});
