import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';

const TOTAL_ROUNDS = 5;

const Star = ({ index, earned }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 300 + index * 200,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

    if (earned) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 12,
    }).start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
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
        Bravo <Text style={styles.textBold}>{student.name}</Text>! 🎉
        {'\n'}Hai fatto {score} su {TOTAL_ROUNDS}!
      </Text>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 20,
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
