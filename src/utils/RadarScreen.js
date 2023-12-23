import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Importa LottieView dalla libreria

const RadarScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation-Radar.json')}
        autoPlay
        loop
        style={[styles.animation]}
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
  animation: {
    width: 85,
    height: 85,
    borderRadius: 47.5,
    overflow: 'hidden', // Assicurati di utilizzare l'overflow: 'hidden' per nascondere le parti al di fuori del bordo circolare
  },

});


export default RadarScreen;
