import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: require('./default-profile-image.png'),
    socialLinks: {
      facebook: 'https://www.facebook.com/',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/',
    },
  });

  const updateProfileName = (newName) => {
    setProfileData((prevData) => ({ ...prevData, name: newName }));
  };

  const updateProfileEmail = (newEmail) => {
    setProfileData((prevData) => ({ ...prevData, email: newEmail }));
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
          setProfileData((prevData) => ({ ...prevData, profileImage: selectedAsset }));
        }
      }
    } catch (error) {
      console.error('Errore durante la selezione dell\'immagine:', error);
    }
  };

  const updateSocialLink = (socialPlatform, newLink) => {
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [socialPlatform]: newLink,
      },
    }));
  };

  const handleLogout = () => {
    // Aggiungi qui la logica per effettuare il logout
    console.log('Logout eseguito');
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
            // Aggiungi qui la logica per eliminare il profilo
            console.log('Profilo eliminato');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff' }}>
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
            source={profileData.profileImage}
            style={{ width: '100%', height: '100%', borderRadius: 60 }}
          />
        </View>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>Il tuo Profilo</Text>
      <Text style={{ fontSize: 18, color: '#555', marginBottom: 5 }}>Nome: {profileData.name}</Text>
      <Text style={{ fontSize: 18, color: '#555', marginBottom: 5 }}>Email: {profileData.email}</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, color: '#555', marginBottom: 10 }}>Link Social:</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <SocialLinkInput
            platform="Facebook"
            link={profileData.socialLinks.facebook}
            onUpdateLink={(newLink) => updateSocialLink('facebook', newLink)}
          />
          <SocialLinkInput
            platform="Twitter"
            link={profileData.socialLinks.twitter}
            onUpdateLink={(newLink) => updateSocialLink('twitter', newLink)}
          />
          <SocialLinkInput
            platform="Instagram"
            link={profileData.socialLinks.instagram}
            onUpdateLink={(newLink) => updateSocialLink('instagram', newLink)}
          />
        </View>
      </View>

      <TextInput
        placeholder="Nuovo Nome"
        value={profileData.name}
        onChangeText={(text) => updateProfileName(text)}
        style={{ width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Nuova Email"
        value={profileData.email}
        onChangeText={(text) => updateProfileEmail(text)}
        style={{ width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, marginBottom: 20, borderRadius: 5 }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#3498db',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={() => {
          console.log('Modifiche al profilo salvate:', profileData);
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Salva Modifiche</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#e74c3c',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={handleDeleteProfile}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Elimina Profilo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#2ecc71',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const SocialLinkInput = ({ platform, link, onUpdateLink }) => {
  return (
    <View style={{ flex: 1, marginRight: 10 }}>
      <Text style={{ fontSize: 14, color: '#777', marginBottom: 5 }}>{platform}</Text>
      <TextInput
        placeholder={`Link ${platform}`}
        value={link}
        onChangeText={(text) => onUpdateLink(text)}
        style={{ width: '100%', padding: 8, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 }}
      />
    </View>
  );
};
