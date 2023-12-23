// useAuthentication.js
import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase'; 
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const UseAuthentication = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'users', user.uid);
          const userProfileSnapshot = await getDoc(userDocRef);

          if (userProfileSnapshot.exists()) {
            // Estrai i dati utente dal documento Firestore
            const userData = userProfileSnapshot.data();
            setUserProfile(userData);
          }
        } else {
          setUserProfile(null);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Errore su UseAuthentication:', error.message);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setUserProfile(null);

    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  
  const updateProfile = async (updatedProfile) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', updatedProfile.uid);

      await updateDoc(userDocRef, updatedProfile);
      setUserProfile(updatedProfile);
      console.log('Profilo utente aggiornato con successo.');
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo utente:', error);
      throw error;
    }
  };

  
  const configureProfile = async (name, surname, phoneNumber) => {
    try {
      const uid = auth.currentUser.uid; // Ottieni l'UID direttamente da auth.currentUser

      const db = getFirestore();
      const userDocRef = doc(db, 'users', uid);

      await setDoc(userDocRef, {
        uid: uid,
        email: auth.currentUser.email,
        name: name,
        surname: surname,
        phoneNumber: phoneNumber,
      });

      const userProfileSnapshot = await getDoc(userDocRef);

      if (userProfileSnapshot.exists()) {
        const userData = userProfileSnapshot.data();
        setUserProfile(userData);
      }

      console.log('Profilo utente configurato con successo.');
    } catch (error) {
      console.error('Errore durante la configurazione del profilo utente:', error);
      throw error;
    }
  };



    // Nuovo metodo per ottenere i dati utente
    const getUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const db = getFirestore();
        const userDocRef = doc(db, 'users', uid);
        const userProfileSnapshot = await getDoc(userDocRef);
  
        if (userProfileSnapshot.exists()) {
          const userData = userProfileSnapshot.data();
          return userData;
        } else {
          console.error('Dati utente non trovati.');
          return null;
        }
      } catch (error) {
        console.error('Errore durante l\'ottenimento dei dati utente:', error);
        throw error;
      }
    };



      // Funzione per caricare la posizione dell'utente
  const uploadUserLocation = async (latitude, longitude) => {
    try {
      const uid = auth.currentUser.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'users', uid);

      // Aggiorna la posizione dell'utente nel documento dell'utente
      await updateDoc(userDocRef, {
        latitude,
        longitude,
      });
    } catch (error) {
      console.error('Errore durante l\'upload della posizione utente:', error);
      throw error;
    }
  };



  return { userProfile, isLoading, handleLogout, updateProfile, configureProfile, getUserData };
};



export default UseAuthentication;
