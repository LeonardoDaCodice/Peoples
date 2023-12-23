import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UseAuthentication from '../../utils/UseAuthentication';
import LoadingScreen from '../../utils/LoadingScreen';
import { useNavigation } from '@react-navigation/native';


export default function ProfileScreen() {
  const navigation = useNavigation(); // Ottieni l'oggetto di navigazione
  const { userProfile, isLoading, handleLogout, updateProfile } = UseAuthentication();
  const [profileData, setProfileData] = useState({
    profileImage: require('./default-profile-image.png'),
  });
      const [name, setName] = useState('');
      const [surname, setSurname] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [nickname, setNickname] = useState('');
  
  
      const [loggingOut, setLoggingOut] = useState(false);


      const updateProfileConfirm = async () => {
        const nameSurnameRegex = /^[a-zA-Z\s]*$/;
      
        if (name.trim() === '' && surname.trim() === '' && nickname.trim() === '' && phoneNumber.trim() === '') {
          return;
        }
      
        if (!nameSurnameRegex.test(name)) {
          Alert.alert('Errore', 'Il campo Nome non può contenere caratteri speciali o numeri.');
          return;
        }
      
        if (!nameSurnameRegex.test(surname)) {
          Alert.alert('Errore', 'Il campo Cognome non può contenere caratteri speciali o numeri.');
          return;
        }
      
        const updatedProfile = {
          ...userProfile,
          name: name.trim() !== '' ? name.trim() : userProfile.name,
          surname: surname.trim() !== '' ? surname.trim() : userProfile.surname,
          nickname: nickname.trim() !== '' ? nickname.trim() : userProfile.nickname,
          phoneNumber: phoneNumber.trim() !== '' ? phoneNumber.trim() : userProfile.phoneNumber,
        };


        try {
          await updateProfile(updatedProfile);
          Alert.alert('Successo', 'Profilo aggiornato con successo.');
        } catch (error) {
          Alert.alert('Errore', 'Si è verificato un errore durante l\'aggiornamento del profilo.');
        }
      };


  const updateSocialLink = (socialPlatform, newLink) => {
    const updatedSocialLinks = { ...userProfile.socialLinks, [socialPlatform]: newLink };
    const updatedProfile = { ...userProfile, socialLinks: updatedSocialLinks };
    updateProfile(updatedProfile);
  };


  
  const selectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permesso negato per accedere alla libreria del cellulare.');
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
  
        if (selectedAsset) {
          await updateProfileImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error('Errore durante la selezione dell\'immagine:', error);
    }
  };


  const handleDeleteProfile = () => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare il tuo profilo?',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => {
            // Aggiungi qui la logica per eliminare il profilo utente
            console.log('Profilo eliminato');
          },
        },
      ]
    );
  };

       
  const handleLogoutPress = async () => {
    setLoggingOut(true);
    await handleLogout();
    setLoggingOut(false);
    navigation.navigate('Login');
  };


  if (isLoading || loggingOut) {
    return <LoadingScreen />;
  }

  const containerStyle = {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  };

  const inputContainerStyle = {
    width: '100%',
    marginBottom: 20,
  };

  const inputStyle = {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  };

  const labelTextStyle = {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  };

  const headerTextStyle = {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  };
  

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <View style={containerStyle}>
        <TouchableOpacity onPress={selectProfileImage}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              marginBottom: 20,
              borderWidth: 2,
              borderColor: '#ddd',
            }}
          >
            <Image
            source={{ uri: userProfile?.profileImage }}
            style={{ width: '100%', height: '100%', borderRadius: 60 }}
            />
          </View>
        </TouchableOpacity>

        <Text style={headerTextStyle}>Il tuo Profilo</Text>

        <View style={inputContainerStyle}>
          <Text style={{ fontSize: 18, color: 'black', marginBottom: 10 }}>Link Social:</Text>
          <SocialLinkInput
            platform="Facebook"
            link={userProfile?.socialLinks?.facebook || ''}
            onUpdateLink={(newLink) => updateSocialLink('facebook', newLink)}
            style={inputStyle}
          />
          <SocialLinkInput
            platform="Twitter"
            link={userProfile?.socialLinks?.twitter || ''}
            onUpdateLink={(newLink) => updateSocialLink('twitter', newLink)}
            style={inputStyle}
          />
          <SocialLinkInput
            platform="Instagram"
            link={userProfile?.socialLinks?.instagram || ''}
            onUpdateLink={(newLink) => updateSocialLink('instagram', newLink)}
            style={inputStyle}
          />
        </View>

        <View style={inputContainerStyle}>
        <Text style={{ fontSize: 18, color: 'black', marginBottom: 10 }}>Dati Personali:</Text>
        
        
        <TextInputWithLabel
          label="Nome"
          placeholder={userProfile?.name || ''}
          onChangeText={(text) => setName(text)}
          style={inputStyle}
        />


        <TextInputWithLabel
          label="Cognome"
          placeholder={userProfile?.surname || ''}
          onChangeText={(text) => setSurname(text)}
          style={inputStyle}
        />

        
        <TextInputWithLabel
          label="Nickname"
          placeholder={userProfile?.nickname || ''}
          onChangeText={(text) => setNickname(text)}
          style={inputStyle}
        />


        <TextInputWithLabel
          label="Telefono"
          placeholder={userProfile?.phoneNumber || ''}
          onChangeText={(text) => setPhoneNumber(text)}
          style={inputStyle}
        />
        </View>

        
        <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={updateProfileConfirm}>
          <Text style={styles.buttonText}>Salva Modifiche</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Esci</Text>
        </TouchableOpacity>
        


        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDeleteProfile}>
          <Text style={styles.buttonText}>Elimina Profilo</Text>
        </TouchableOpacity>
       </View>
      </View>
    </ScrollView>
  );
}

const SocialLinkInput = ({ platform, link, onUpdateLink, style }) => {
  return (
    <View style={style}>
      <Text style={{ fontSize: 14, color: 'black', marginBottom: 5 }}>{platform}</Text>
      <TextInput
        placeholder={`Link ${platform}`}
        value={link}
        onChangeText={(text) => onUpdateLink(text)}
        style={{ width: '100%', padding: 8, borderColor: '#ddd', borderWidth: 2, borderRadius: 5 }}
      />
    </View>
  );
};

const TextInputWithLabel = ({ label, value, onChangeText, placeholder, style }) => {
  return (
    <View style={style}>
      <Text style={{ fontSize: 14, color: 'black', marginBottom: 5 }}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={{ width: '100%', padding: 8, borderColor: '#ddd', borderWidth: 2, borderRadius: 5 }}
      />
    </View>
  );
};

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
