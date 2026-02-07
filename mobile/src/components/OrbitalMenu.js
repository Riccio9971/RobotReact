import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const SCENE_SIZE = Math.min(SCREEN_W * 0.85, 380);

const menuItems = [
  { id: 'math', label: 'Matematica', emoji: '🔢', color: '#ff6b35' },
  { id: 'italian', label: 'Italiano', emoji: '📖', color: '#7b2fff' },
  { id: 'science', label: 'Scienze', emoji: '🔬', color: '#00ff88' },
  { id: 'english', label: 'Inglese', emoji: '🇬🇧', color: '#00f0ff' },
  { id: 'art', label: 'Arte', emoji: '🎨', color: '#ff2d7b' },
  { id: 'music', label: 'Musica', emoji: '🎵', color: '#ffaa00' },
];

const OrbitItem = ({ item, index, total, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const angleDeg = (360 / total) * index;
  const angleRad = (angleDeg * Math.PI) / 180;
  const radius = SCENE_SIZE * 0.42;
  const centerX = SCENE_SIZE / 2;
  const centerY = SCENE_SIZE / 2;
  const x = centerX + Math.sin(angleRad) * radius - 40;
  const y = centerY - Math.cos(angleRad) * radius - 40;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      tension: 200,
      friction: 15,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 15,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.orbitItem,
        {
          left: x,
          top: y,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.orbitItemInner}
      >
        <Text style={styles.orbitEmoji}>{item.emoji}</Text>
        <Text style={[styles.orbitLabel, { color: item.color }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const OrbitalMenu = ({ onSubjectClick }) => {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const ringRotation = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: SCENE_SIZE, height: SCENE_SIZE }]}>
      {/* Decorative ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: SCENE_SIZE * 0.96,
            height: SCENE_SIZE * 0.96,
            transform: [{ rotate: ringRotation }],
          },
        ]}
      />

      {/* Menu items */}
      {menuItems.map((item, index) => (
        <OrbitItem
          key={item.id}
          item={item}
          index={index}
          total={menuItems.length}
          onPress={onSubjectClick}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.08)',
  },
  orbitItem: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  orbitItemInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  orbitEmoji: {
    fontSize: 28,
  },
  orbitLabel: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default OrbitalMenu;
