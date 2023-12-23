import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../../../config/firebase'; // Assicurati di utilizzare il percorso corretto
import { useNavigation } from '@react-navigation/native';
import UseAuthentication from '../../utils/UseAuthentication';


export default function ConfigureProfileScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigation = useNavigation();
  const { configureProfile } = UseAuthentication();


  const handleProfileConfiguration = async () => {
    try {
      
      // Controllo se il nome e cognome contengono caratteri speciali o numeri
      const nameSurnameRegex = /^[a-zA-Z\s]*$/;
      if (!name.trim() || !nameSurnameRegex.test(name)) {
        Alert.alert('Errore', 'Il campo Nome e Cognome non può essere vuoto e non può contenere caratteri speciali o numeri.');
        return;
      }

      if(!surname.trim() || !nameSurnameRegex.test(surname)){
        Alert.alert('Errore', 'Il campo Nome e Cognome non possono essere vuoti e non possono contenere caratteri speciali o numeri.');
        return;
      }

         // Controllo se il numero di telefono è valido (puoi personalizzare la tua validazione in base alle tue esigenze)
      const phoneRegex = /^[0-9]*$/;
      if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber)) {
        Alert.alert('Errore', 'Inserisci un Numero di Telefono valido.');
        return;
      }


      await configureProfile(name, surname, phoneNumber);

     

      // Dopo aver completato la configurazione del profilo, invoco lo stack di navigazione della HomeTab
      //navigation.navigate('HomeTabs');
      navigation.navigate('AppNavigation');

     
      //setAuthenticationStatus(true);


    } catch (error) {
      console.error('Errore durante la configurazione del profilo:', error.message);
      // Gestisci gli errori di configurazione del profilo
      Alert.alert('Errore', 'Si è verificato un errore durante la configurazione del profilo.');
      
      //setAuthenticationStatus(false);
    }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configura il tuo Profilo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Cognome"
        onChangeText={(text) => setSurname(text)}
        value={surname}
      />
      <TextInput
        style={styles.input}
        placeholder="Numero di telefono (non verrà visualizzato)"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleProfileConfiguration}>
        <Text style={styles.buttonText}>Avanti</Text>
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
    fontSize: 24,
    marginBottom: 20,
 },
 input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
 },
 button: {
    width: '80%',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    //marginTop: 20,
 },
 buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
 },
});