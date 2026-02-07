import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_W } = Dimensions.get('window');
const SCENE_SIZE = Math.min(SCREEN_W * 0.82, 360);
const ITEM_SIZE = Math.min(68, SCREEN_W * 0.17);
const ORBIT_RADIUS = SCENE_SIZE * 0.38;

const menuItems = [
  { id: 'math', label: 'Matematica', emoji: '🔢', color: '#ff6b35' },
  { id: 'italian', label: 'Italiano', emoji: '📖', color: '#7b2fff' },
  { id: 'science', label: 'Scienze', emoji: '🔬', color: '#00ff88' },
  { id: 'english', label: 'Inglese', emoji: '🇬🇧', color: '#00f0ff' },
  { id: 'art', label: 'Arte', emoji: '🎨', color: '#ff2d7b' },
  { id: 'music', label: 'Musica', emoji: '🎵', color: '#ffaa00' },
];

const OrbitItem = ({ item, index, rotation, onSubjectClick }) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      tension: 200,
      friction: 15,
    }).start();
  }, []);

  const angleDeg = (360 / menuItems.length) * index + rotation;
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = SCENE_SIZE / 2 + Math.sin(angleRad) * ORBIT_RADIUS - ITEM_SIZE / 2;
  const y = SCENE_SIZE / 2 - Math.cos(angleRad) * ORBIT_RADIUS - ITEM_SIZE / 2;

  return (
    <Animated.View
      style={[
        styles.orbitItem,
        {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          borderRadius: ITEM_SIZE / 2,
          left: x,
          top: y,
          transform: [
            { scale: Animated.multiply(entranceAnim, tapScale) },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSubjectClick(item.id);
        }}
        onPressIn={() => {
          Animated.spring(tapScale, {
            toValue: 0.85,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(tapScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 200,
            friction: 15,
          }).start();
        }}
        style={[
          styles.orbitItemInner,
          {
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderRadius: ITEM_SIZE / 2,
            borderColor: item.color + '40',
          },
        ]}
      >
        <Text style={[styles.orbitEmoji, { fontSize: ITEM_SIZE * 0.36 }]}>{item.emoji}</Text>
        <Text
          style={[styles.orbitLabel, { color: item.color, fontSize: Math.max(5, ITEM_SIZE * 0.085) }]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const OrbitalMenu = ({ onSubjectClick }) => {
  const [rotation, setRotation] = useState(0);
  const ringAnim = useRef(new Animated.Value(0)).current;
  const rotationTimerRef = useRef(null);

  useEffect(() => {
    // Slow auto-rotation
    let angle = 0;
    rotationTimerRef.current = setInterval(() => {
      angle += 0.15;
      setRotation(angle);
    }, 50);

    // Decorative ring rotation
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
    };
  }, []);

  const ringRotation = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: SCENE_SIZE, height: SCENE_SIZE }]}>
      {/* Decorative outer ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: SCENE_SIZE * 0.94,
            height: SCENE_SIZE * 0.94,
            borderRadius: SCENE_SIZE * 0.47,
            transform: [{ rotate: ringRotation }],
          },
        ]}
      />

      {/* Orbit path */}
      <View
        style={[
          styles.orbitPath,
          {
            width: ORBIT_RADIUS * 2 + ITEM_SIZE,
            height: ORBIT_RADIUS * 2 + ITEM_SIZE,
            borderRadius: ORBIT_RADIUS + ITEM_SIZE / 2,
          },
        ]}
      />

      {/* Menu items - each is independently tappable */}
      {menuItems.map((item, index) => (
        <OrbitItem
          key={item.id}
          item={item}
          index={index}
          rotation={rotation}
          onSubjectClick={onSubjectClick}
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
    top: '3%',
    left: '3%',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.1)',
    borderStyle: 'dashed',
  },
  orbitPath: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -(ORBIT_RADIUS + ITEM_SIZE / 2),
    marginLeft: -(ORBIT_RADIUS + ITEM_SIZE / 2),
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.05)',
    borderStyle: 'dotted',
  },
  orbitItem: {
    position: 'absolute',
    zIndex: 10,
  },
  orbitItemInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  orbitEmoji: {
    // fontSize set dynamically
  },
  orbitLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default OrbitalMenu;
