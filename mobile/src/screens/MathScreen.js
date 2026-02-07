import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MathOnboarding from '../components/MathOnboarding';
import MathActivities from '../components/MathActivities';
import CountingGame from '../components/CountingGame';
import BalloonGame from '../components/BalloonGame';
import SequenceGame from '../components/SequenceGame';
import CompareGame from '../components/CompareGame';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const floatingChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '×', '÷', '='];
const numColors = ['#ff6b35', '#ff2d7b', '#7b2fff', '#00f0ff', '#00ff88', '#ffaa00', '#ff4757', '#2ed573'];

const FloatingNumber = ({ char, color, x, y, size, delay, duration }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, []);

  const opacity = anim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0.3, 0.15, 0.3, 0],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -30, 0],
  });

  return (
    <Animated.Text
      style={[
        styles.floatingNum,
        {
          left: x,
          top: y,
          fontSize: size,
          color,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {char}
    </Animated.Text>
  );
};

const MathScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [student, setStudent] = useState(null);
  const [activity, setActivity] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();
  }, []);

  const numbers = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      char: floatingChars[i % floatingChars.length],
      color: numColors[i % numColors.length],
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 90}%`,
      size: 16 + Math.random() * 30,
      delay: Math.random() * 2,
      duration: 3000 + Math.random() * 4000,
    }));
  }, []);

  const handleBack = () => {
    if (activity) {
      setActivity(null);
    } else {
      navigation.goBack();
    }
  };

  const renderContent = () => {
    if (!student) {
      return <MathOnboarding onComplete={setStudent} />;
    }
    if (!activity) {
      return (
        <MathActivities
          student={student}
          onSelectActivity={setActivity}
        />
      );
    }
    const gameProps = { student, onBack: () => setActivity(null) };
    switch (activity) {
      case 'counting': return <CountingGame {...gameProps} />;
      case 'balloons': return <BalloonGame {...gameProps} />;
      case 'sequence': return <SequenceGame {...gameProps} />;
      case 'compare': return <CompareGame {...gameProps} />;
      default: return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#fff5e6', '#ffe0f0', '#e0f0ff', '#e6ffe6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating numbers */}
      <View style={styles.floatingContainer} pointerEvents="none">
        {numbers.map((n) => (
          <FloatingNumber key={n.id} {...n} />
        ))}
      </View>

      {/* Back button - only on activity selection */}
      {!activity && (
        <Pressable
          style={[styles.backBtn, { top: insets.top + 16 }]}
          onPress={handleBack}
        >
          <Text style={styles.backBtnText}>← Torna a Robot</Text>
        </Pressable>
      )}

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 16 }]}>
        {renderContent()}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingNum: {
    position: 'absolute',
    fontWeight: '700',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    zIndex: 5,
  },
});

export default MathScreen;
