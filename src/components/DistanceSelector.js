import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const DistanceSelector = ({ distanza, setDistanza, filtraPeople }) => {

  return (
    <LinearGradient
      colors={['#000000','#004d00']} // Adjust these colors for your desired gradient
      style={{
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
      }}
    >
      <View>
        <View style={{ marginTop: 2, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>Distanza selezionata: </Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{distanza.toFixed(2)} km</Text>
        </View>

        <Slider
          style={{ width: 190, height: 10 }}
          minimumValue={0.05}
          maximumValue={0.25}
          step={0.05}
          value={distanza}
          minimumTrackTintColor="white"
          thumbTintColor="white"
          onValueChange={(value) => setDistanza(value)}
          onSlidingComplete={filtraPeople}
        />
      </View>
    </LinearGradient>
  );
};

export default DistanceSelector;
