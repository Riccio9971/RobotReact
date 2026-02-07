import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const TOTAL_ROUNDS = 5;
const confettiColors = ['#ff6b35', '#7b2fff', '#00ff88', '#ff2d7b', '#00f0ff', '#ffaa00', '#ff4757', '#2ed573', '#ffd700'];

const CelebrationConfetti = ({ delay, startX, color, size }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swayAmount = 20 + Math.random() * 50;
    const duration = 2000 + Math.random() * 1500;

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.8, duration: duration - 500, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(swayAnim, { toValue: swayAmount, duration: 250 + Math.random() * 200, useNativeDriver: true }),
            Animated.timing(swayAnim, { toValue: -swayAmount, duration: 250 + Math.random() * 200, useNativeDriver: true }),
          ])
        ),
        Animated.timing(spinAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, SCREEN_H * 0.7],
  });

  const rotateDeg = 360 + Math.random() * 720;
  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${rotateDeg}deg`],
  });

  const isRound = Math.random() > 0.5;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: startX,
        width: size,
        height: isRound ? size : size * 0.5,
        backgroundColor: color,
        borderRadius: isRound ? size / 2 : 2,
        opacity: opacityAnim,
        transform: [
          { translateY },
          { translateX: swayAnim },
          { rotate },
        ],
      }}
    />
  );
};

const Star = ({ index, earned }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 600 + index * 250,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

    if (earned) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 600 + index * 250);
    }
  }, []);

  return (
    <Animated.Text
      style={[
        styles.star,
        earned && styles.starEarned,
        {
          transform: [
            { scale: anim },
            {
              rotate: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-180deg', '0deg'],
              }),
            },
          ],
        },
      ]}
    >
      {earned ? '⭐' : '☆'}
    </Animated.Text>
  );
};

const GameComplete = ({ student, score, onBack }) => {
  const stars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 12,
    }).start();

    Animated.spring(btnAnim, {
      toValue: 1,
      delay: 1500,
      useNativeDriver: true,
      tension: 200,
      friction: 15,
    }).start();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const confettiPieces = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 800,
      startX: Math.random() * SCREEN_W,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: 6 + Math.random() * 12,
    }))
  ).current;

  return (
    <View style={styles.container}>
      {/* Confetti background */}
      <View style={styles.confettiLayer} pointerEvents="none">
        {confettiPieces.map((p) => (
          <CelebrationConfetti key={p.id} {...p} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <OwlTeacher speaking={true} size={120} />

        <View style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <Star key={s} index={s} earned={s <= stars} />
          ))}
        </View>

        <Text style={styles.text}>
          Bravo <Text style={styles.textBold}>{student.name}</Text>!
          {'\n'}Hai fatto {score} su {TOTAL_ROUNDS}!
        </Text>

        <Animated.View style={{ transform: [{ scale: btnAnim }] }}>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onBack();
            }}
          >
            <Text style={styles.backBtnText}>🏠 Torna ai giochi</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 20,
    zIndex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  star: {
    fontSize: 50,
    opacity: 0.3,
  },
  starEarned: {
    opacity: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 34,
  },
  textBold: {
    fontWeight: '700',
    color: '#ff6b35',
  },
  backBtn: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  backBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default GameComplete;
