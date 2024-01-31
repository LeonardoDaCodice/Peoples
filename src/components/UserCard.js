import React from 'react';
import { TouchableOpacity, Animated, View, Text, StyleSheet } from 'react-native';
import { Card, Image } from 'react-native-elements';

const UserCard = ({ user, index, flippedCards, flipAnimations, onCardPress }) => {
  const cardId = user.uid || index;

  const handlePress = () => {
    onCardPress(cardId);
  };

  if (!flipAnimations[cardId]) {
    flipAnimations[cardId] = new Animated.Value(0);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View
        style={[
          flippedCards && flippedCards.includes(cardId) && { zIndex: 1 },
          {
            transform: [
              {
                rotateY: flipAnimations[cardId].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Card containerStyle={styles.card}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.userImage} />
          ) : (
            <Image
              source={require('../assets/default-profile-image.png')}
              style={styles.userImage}
            />
          )}
          <View style={styles.userNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
              {user.nickname}
            </Text>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  userNameContainer: {
    padding: 10,
    width: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserCard;
