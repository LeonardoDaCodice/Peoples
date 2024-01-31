// useAuthentication.js
import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase'; 
import { getFirestore, doc, getDoc, updateDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


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




    const getFriendsData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          // Ottieni gli amici dell'utente loggato
          const friendsMap = userData.friends || {};
          const friendUids = Object.keys(friendsMap);
    
          // Ottieni direttamente i dati degli amici senza chiamare getUsersData
          const friendsData = await Promise.all(friendUids.map(async (friendUid) => {
            const db = getFirestore();
            const userDocRef = doc(db, 'users', friendUid);
            const userSnapshot = await getDoc(userDocRef);
    
            if (userSnapshot.exists()) {
              return userSnapshot.data();
            } else {
              console.error(`Dati utente non trovati per l'UID ${friendUid}.`);
              return null;
            }
          }));
    
          return friendsData.filter((friend) => friend !== null);
        } else {
          console.error('Dati utente non trovati.');
          return [];
        }
      } catch (error) {
        console.error('Errore durante l\'ottenimento dei dati degli amici:', error);
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



   // Funzione per ottenere i dati di tutti gli utenti
   const getUsersData = async () => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      return usersSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error getting users data:', error);
      throw error;
    }
  };



  const uploadProfileImage = async (imageUri) => {
    try {
      const uid = auth.currentUser.uid;
      const storage = getStorage();
      const storageRef = ref(storage, `profile_images/${uid}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Aggiorna l'URL dell'immagine del profilo nel documento dell'utente
      const db = getFirestore();
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, { profileImage: downloadURL });
  
      // Aggiorna lo stato locale dell'utente con l'URL dell'immagine del profilo
      setUserProfile((prevUserProfile) => ({
        ...prevUserProfile,
        profileImage: downloadURL,
      }));
  
      console.log('Immagine del profilo caricata con successo.');
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine del profilo:', error);
      throw error;
    }
  };
  


  return { userProfile,
           isLoading,
           handleLogout,
           updateProfile,
           configureProfile,
           getUserData,
           getUsersData,
           getFriendsData,
           uploadUserLocation, 
           uploadProfileImage,
          };
};



export default UseAuthentication;
