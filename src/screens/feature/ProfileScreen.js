import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UseAuthentication from '../../utils/UseAuthentication';
import LoadingScreen from '../../components/LoadingScreen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Aggiungi questo import


export default function ProfileScreen() {
  const navigation = useNavigation();
  const { userProfile, isLoading, handleLogout, updateProfile, uploadProfileImage } = UseAuthentication();
  const [profileData, setProfileData] = useState({
    profileImage: require('../../assets/default-profile-image.png'),
  });
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
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
        setLoading(true);

        const selectedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;

        if (selectedAsset) {
          try {
            await uploadProfileImage(selectedAsset.uri);
            await updateProfileConfirm();
          } catch (error) {
            Alert.alert('Errore durante il caricamento dell\'immagine del profilo:', error.message);
            console.error('Errore durante il caricamento dell\'immagine del profilo:', error);
          } finally {
            setLoading(false);
          }
        }
      }
    } catch (error) {
      Alert.alert('Errore durante la selezione dell\'immagine:', error.message);
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
        <View style={{ position: 'relative' }}>
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
          {loading ? (
            <ActivityIndicator size="large" color="#166020" />
          ) : (
            <Image
              source={userProfile?.profileImage ? { uri: userProfile.profileImage } : profileData.profileImage}
              style={{ width: '100%', height: '100%', borderRadius: 60 }}
            />
          )}

          {/* Aggiunta della condizione per mostrare/nascondere l'icona della macchina fotografica */}
          {(!userProfile?.profileImage || loading) && (
            <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -12 }, { translateY: -12 }] }}>
              <TouchableOpacity onPress={selectProfileImage}>
                <AntDesign name="camera" size={25} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
        <TouchableOpacity onPress={updateProfileConfirm}>
            <LinearGradient
              colors={['#009900', '#004d00']}
              style={[styles.button, { backgroundColor: 'green' }]}
            >
              <Text style={styles.buttonText}>Salva Modifiche</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gradientButton} onPress={handleLogoutPress}>
            <LinearGradient
              colors={['#0000ff', '#000080']}
              style={[styles.button, { backgroundColor: 'blue' }]}
            >
              <Text style={styles.buttonText}>Esci</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gradientButton} onPress={handleDeleteProfile}>
            <LinearGradient
              colors={['#ff0000', '#8b0000']}
              style={[styles.button, { backgroundColor: 'red' }]}
            >
              <Text style={styles.buttonText}>Elimina Profilo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const SocialLinkInput = ({ platform, link, onUpdateLink, style }) => {
  return (
    <View style={style}>
      <Text style={{ fontSize: 14, color: '#777', marginBottom: 5 }}>{platform}</Text>
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
      <Text style={{ fontSize: 14, color: '#777', marginBottom: 5 }}>{label}</Text>
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
