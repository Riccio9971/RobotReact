import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions, PanResponder } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_W } = Dimensions.get('window');
const SCENE_SIZE = Math.min(SCREEN_W * 0.82, 360);
const ITEM_SIZE = Math.min(72, SCREEN_W * 0.18);
const ORBIT_RADIUS = SCENE_SIZE * 0.40;

const menuItems = [
  { id: 'math', label: 'Matematica', emoji: '🔢', color: '#ff6b35' },
  { id: 'italian', label: 'Italiano', emoji: '📖', color: '#7b2fff' },
  { id: 'science', label: 'Scienze', emoji: '🔬', color: '#00ff88' },
  { id: 'english', label: 'Inglese', emoji: '🇬🇧', color: '#00f0ff' },
  { id: 'art', label: 'Arte', emoji: '🎨', color: '#ff2d7b' },
  { id: 'music', label: 'Musica', emoji: '🎵', color: '#ffaa00' },
];

const OrbitalMenu = ({ onSubjectClick }) => {
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const lastAngleRef = useRef(null);
  const velocityRef = useRef(0);
  const animFrameRef = useRef(null);
  const ringAnim = useRef(new Animated.Value(0)).current;
  const entranceAnims = useRef(menuItems.map(() => new Animated.Value(0))).current;
  const tapScaleAnims = useRef(menuItems.map(() => new Animated.Value(1))).current;
  const isDragging = useRef(false);
  const dragDistance = useRef(0);

  const centerX = SCENE_SIZE / 2;
  const centerY = SCENE_SIZE / 2;

  useEffect(() => {
    entranceAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: i * 80,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
      }).start();
    });

    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startMomentum = () => {
    const decay = () => {
      velocityRef.current *= 0.95;
      if (Math.abs(velocityRef.current) < 0.1) {
        velocityRef.current = 0;
        return;
      }
      rotationRef.current += velocityRef.current;
      setRotation(rotationRef.current);
      animFrameRef.current = requestAnimationFrame(decay);
    };
    animFrameRef.current = requestAnimationFrame(decay);
  };

  const getAngle = (x, y) => {
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
        velocityRef.current = 0;
        isDragging.current = false;
        dragDistance.current = 0;
        const touch = evt.nativeEvent;
        lastAngleRef.current = getAngle(touch.locationX, touch.locationY);
      },
      onPanResponderMove: (evt) => {
        const touch = evt.nativeEvent;
        const currentAngle = getAngle(touch.locationX, touch.locationY);
        if (lastAngleRef.current !== null) {
          let delta = currentAngle - lastAngleRef.current;
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;
          dragDistance.current += Math.abs(delta);
          if (dragDistance.current > 3) {
            isDragging.current = true;
          }
          rotationRef.current += delta;
          velocityRef.current = delta;
          setRotation(rotationRef.current);
        }
        lastAngleRef.current = currentAngle;
      },
      onPanResponderRelease: () => {
        lastAngleRef.current = null;
        if (Math.abs(velocityRef.current) > 0.5) {
          startMomentum();
        }
      },
    })
  ).current;

  const ringRotation = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[styles.container, { width: SCENE_SIZE, height: SCENE_SIZE }]}
      {...panResponder.panHandlers}
    >
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

      {/* Menu items */}
      {menuItems.map((item, index) => {
        const angleDeg = (360 / menuItems.length) * index + rotation;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = centerX + Math.sin(angleRad) * ORBIT_RADIUS - ITEM_SIZE / 2;
        const y = centerY - Math.cos(angleRad) * ORBIT_RADIUS - ITEM_SIZE / 2;

        const handlePressIn = () => {
          Animated.spring(tapScaleAnims[index], {
            toValue: 0.85,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
          }).start();
        };

        const handlePressOut = () => {
          Animated.spring(tapScaleAnims[index], {
            toValue: 1,
            useNativeDriver: true,
            tension: 200,
            friction: 15,
          }).start();
        };

        const handlePress = () => {
          if (!isDragging.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSubjectClick(item.id);
          }
        };

        return (
          <Animated.View
            key={item.id}
            style={[
              styles.orbitItem,
              {
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                borderRadius: ITEM_SIZE / 2,
                left: x,
                top: y,
                transform: [
                  { scale: Animated.multiply(entranceAnims[index], tapScaleAnims[index]) },
                ],
              },
            ]}
          >
            <Pressable
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
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
              <Text style={[styles.orbitEmoji, { fontSize: ITEM_SIZE * 0.38 }]}>{item.emoji}</Text>
              <Text style={[styles.orbitLabel, { color: item.color, fontSize: Math.max(6, ITEM_SIZE * 0.09) }]}>
                {item.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
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
