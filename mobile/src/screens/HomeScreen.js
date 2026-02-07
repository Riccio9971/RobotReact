import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RobotFace from '../components/RobotFace';
import OrbitalMenu from '../components/OrbitalMenu';
import ParticleField from '../components/ParticleField';
import TypewriterText from '../components/TypewriterText';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SCENE_SIZE = Math.min(SCREEN_W * 0.82, 360);

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState(0);
  const robotAnim = useRef(new Animated.Value(0)).current;
  const orbitalAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setPhase(1);
        Animated.timing(particleAnim, {
          toValue: 1, duration: 1000, useNativeDriver: true,
        }).start();
      }, 300),
      setTimeout(() => {
        setPhase(2);
        Animated.spring(robotAnim, {
          toValue: 1, useNativeDriver: true, tension: 100, friction: 15,
        }).start();
      }, 1000),
      setTimeout(() => {
        setPhase(3);
        Animated.timing(textAnim, {
          toValue: 1, duration: 300, useNativeDriver: true,
        }).start();
      }, 2200),
      setTimeout(() => {
        setPhase(4);
        Animated.spring(orbitalAnim, {
          toValue: 1, useNativeDriver: true, tension: 60, friction: 18,
        }).start();
      }, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubjectClick = (subject) => {
    if (subject === 'math') {
      navigation.navigate('Math');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#0d0d1a', '#0a0a0f', '#050508']}
        style={StyleSheet.absoluteFill}
      />

      {/* Particle field */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: particleAnim }]}>
        <ParticleField />
      </Animated.View>

      {/* Ambient glow */}
      <View style={styles.ambientGlow} />

      {/* Scene */}
      <View style={styles.scene}>
        {/* Orbital menu */}
        {phase >= 4 && (
          <Animated.View
            style={[
              styles.orbitalLayer,
              {
                opacity: orbitalAnim,
                transform: [{ scale: orbitalAnim }],
              },
            ]}
          >
            <OrbitalMenu onSubjectClick={handleSubjectClick} />
          </Animated.View>
        )}

        {/* Robot + text center column */}
        <View style={styles.centerColumn}>
          {phase >= 2 && (
            <Animated.View
              style={{
                opacity: robotAnim,
                transform: [
                  { scale: robotAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                  { translateY: robotAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) },
                ],
              }}
            >
              <RobotFace />
            </Animated.View>
          )}

          {phase >= 3 && (
            <Animated.View style={{ opacity: textAnim }}>
              <TypewriterText />
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(0, 240, 255, 0.03)',
  },
  scene: {
    width: SCENE_SIZE,
    height: SCENE_SIZE,
    position: 'relative',
  },
  orbitalLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  centerColumn: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});

export default HomeScreen;
