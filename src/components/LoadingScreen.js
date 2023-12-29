import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Importa LottieView dalla libreria

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation-Loading.json')} // Sostituisci con il percorso del tuo file di animazione JSON
        autoPlay
        loop
        style={{ width: 85, height: 85 }} // Personalizza le dimensioni dell'animazione
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
