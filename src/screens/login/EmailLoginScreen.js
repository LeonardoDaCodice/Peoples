import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../config/firebase'; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from 'firebase/auth';

import { getFirestore, doc, getDoc, collection, addDoc, setDoc } from 'firebase/firestore';



export default function EmailLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationVisible, setRegistrationVisible] = useState(false);
  const [isRegistrationLinkVisible, setRegistrationLinkVisible] = useState(true);
  const navigation = useNavigation();

  //const { setAuthenticationStatus } = useAuthentication();



  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };






  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };





  const handleLogin = async () => {
    try {
      if (!isValidEmail(email) || !isValidPassword(password)) {
        Alert.alert('Errore', 'Email o password non validi.');
        return;
      }


      //Metodo1 controllo se email verificata.
      //Verifico se l'utente ha confermato l'email.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        Alert.alert('Errore', 'Conferma la registrazione cliccando sul link che ti abbiamo inviato tramite email.');
        return;
      }


      //Metodo2 inizializza Firestore
      const db = getFirestore();

      //Metodo3 : Questa riga crea un riferimento a un documento nel database Firestore. In particolare, il documento è situato nella collezione "users" e ha l'ID corrispondente all'UID dell'utente autenticato (userCredential.user.uid).
      const userDocRef = doc(db, 'users', userCredential.user.uid);

      //Metodo4 : Questa riga effettua una richiesta asincrona al database Firestore per ottenere uno snapshot del documento associato all'utente. getDoc() restituisce uno snapshot che rappresenta lo stato attuale del documento nel momento in cui è stata effettuata la richiesta.
      const userProfileSnapshot = await getDoc(userDocRef);

      //Metodo5 : Questa condizione verifica se il documento esiste nel database Firestore
      if (userProfileSnapshot.exists()) {

        //Metodo6 : Se il documento esiste, questa riga estrae i dati del documento utilizzando il metodo data() dello snapshot
        const userProfileData = userProfileSnapshot.data();
        console.log('Informazioni del profilo:', userProfileData);
        // Puoi fare qualcosa con le informazioni del profilo qui

        // Salva l'informazione di autenticazione nello stato locale
        //await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);


        // Utilizza navigation.replace invece di navigation.navigate
        //navigation.navigate('HomeTabs');

        //setAuthenticationStatus(true);


/************************************************/

      } else {
        console.log("L'utente non ha configurato il suo profilo");
        
        // L'utente non ha configurato il profilo, reindirizza a ConfigureProfileScreen
        navigation.navigate('ConfigureProfile');
      }

      // Naviga alla schermata principale dell'app dopo l'accesso
      // Navigation logic goes here
    } catch (error) {
      console.error('Errore durante il login:', error.message);
      //Alert.alert('Errore', 'Credenziali errate. Verifica email e password.');
    }
  };




  const handleRegistration = () => {
    setRegistrationVisible(true);
    setRegistrationLinkVisible(false);
  };





  const handleRegistrationSubmit =  async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Errore', 'Inserisci un indirizzo email valido.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Errore',
        'La password deve contenere almeno 8 caratteri, un numero e un carattere speciale.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Errore', 'Le password non corrispondono.');
      return;
    }

   /* // Verifica se l'account esiste già
    const methods = await fetchSignInMethodsForEmail(auth, email);
      
    if (methods && methods.length == 0) {
      // L'account esiste già
      Alert.alert('Errore', 'Account già registrato con questa email.');
      return;
    }
  */

    try {
 
      // Crea un nuovo account su Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Invia l'email di verifica
      await sendEmailVerification(userCredential.user);

     
      // Mostra un messaggio di conferma
      Alert.alert(
        'Registrazione completata',
        'Conferma il tuo account cliccando sul link che ti abbiamo inviato tramite email.'
      );


      // Nasconde il form di registrazione dopo l'invio dell'email di verifica
      setRegistrationVisible(false);

      // Naviga alla schermata di conferma registrazione
      // (questa è una navigazione di esempio, adatta la tua logica di navigazione)
      // Navigation logic goes here
      // Ad esempio, puoi utilizzare la navigazione di React Navigation
      // o eseguire una semplice navigazione sezione/schermata
   
    } catch (error) {
    // Se la promessa viene rigettata, c'è stato un errore durante la registrazione
    console.error('Errore durante la registrazione:', error.message);

    // Verifica se l'errore è dovuto a un'email già in uso
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Errore', 'Account già registrato con questa email.');
    } else {
      Alert.alert('Errore', 'Si è verificato un errore durante la registrazione.');
    }
  }
    // Aggiungi qui la logica per la registrazione con email
    console.log('Registrazione con email:', email);

  };





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accedi con Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Indirizzo email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {registrationVisible ? (
        <>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Conferma password"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegistrationSubmit}>
            <Text style={styles.buttonText}>Registra</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Accedi</Text>
        </TouchableOpacity>
      )}

      {/* Aggiunta della nuova frase con condizione di visualizzazione */}
      {isRegistrationLinkVisible && (
        <Text style={styles.registerText}>
          Non hai un account registrato con l'email?{' '}
        </Text>
      )}
      {isRegistrationLinkVisible && (
        <Text style={styles.registerLink} onPress={handleRegistration}>
          Registra la tua email
        </Text>
      )}
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    //marginTop: 20,
    marginBottom: 30,
 },
 buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
 },
  // Nuovi stili per la frase di registrazione
  registerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  registerLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 16,
  },

  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});
