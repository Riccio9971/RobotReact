import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');

const activities = [
  { id: 'counting', items: ['🧸', '🚗', '🎲'], title: 'Conta!', colors: colors.activityBg.counting },
  { id: 'balloons', items: ['⚽', '🏀', '🎾'], title: 'Prendi!', colors: colors.activityBg.balloons },
  { id: 'sequence', items: ['🎎', '🎀', '🌸'], title: 'In fila!', colors: colors.activityBg.sequence },
  { id: 'compare', items: ['🐻', '🐰', '🦊'], title: 'Di più!', colors: colors.activityBg.compare },
];

const BounceEmoji = ({ emoji, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -10, duration: 1100, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1100, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.Text style={[styles.cardEmoji, { transform: [{ translateY: anim }] }]}>
      {emoji}
    </Animated.Text>
  );
};

const ActivityCard = ({ activity, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 600 + index * 120,
      useNativeDriver: true,
      tension: 200,
      friction: 15,
    }).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 15 }),
    ]).start(() => onPress(activity.id));
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={activity.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardSheen} />
          <View style={styles.cardEmojis}>
            {activity.items.map((e, j) => (
              <BounceEmoji key={j} emoji={e} delay={j * 300} />
            ))}
          </View>
          <Text style={styles.cardTitle}>{activity.title}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const MathActivities = ({ student, onSelectActivity }) => {
  const [speaking, setSpeaking] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSpeaking(true);
    const t = setTimeout(() => setSpeaking(false), 1500);

    Animated.spring(headerAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 12,
    }).start();

    Animated.timing(gridAnim, {
      toValue: 1,
      duration: 400,
      delay: 500,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* Owl + speech */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.speechBubble,
            { opacity: headerAnim, transform: [{ scale: headerAnim }] },
          ]}
        >
          <Text style={styles.speechText}>
            Bene <Text style={styles.speechBold}>{student.name}</Text>! 🌟
            {'\n'}A cosa vuoi giocare?
          </Text>
          <View style={styles.speechArrowDown} />
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: headerAnim }] }}>
          <OwlTeacher speaking={speaking} size={90} />
        </Animated.View>
      </View>

      {/* Activity grid */}
      <Animated.View style={[styles.grid, { opacity: gridAnim }]}>
        {activities.map((act, i) => (
          <ActivityCard
            key={act.id}
            activity={act}
            index={i}
            onPress={onSelectActivity}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const cardWidth = (SCREEN_W - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    paddingHorizontal: 24,
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  speechText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    lineHeight: 26,
    textAlign: 'center',
  },
  speechBold: {
    fontWeight: '700',
    color: '#ff6b35',
  },
  speechArrowDown: {
    position: 'absolute',
    bottom: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  cardWrapper: {
    width: cardWidth,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    minHeight: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  cardSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 28,
    height: '50%',
  },
  cardEmojis: {
    flexDirection: 'row',
    gap: 6,
  },
  cardEmoji: {
    fontSize: 38,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

export default MathActivities;
