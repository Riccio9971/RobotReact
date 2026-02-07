import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';
import GameComplete from './GameComplete';

const { width: SCREEN_W } = Dimensions.get('window');
const toyEmojis = ['🧸', '🚗', '🪀', '🎠', '🎲', '🧩', '🪁', '🎯', '🏎️', '🎪'];
const TOTAL_ROUNDS = 5;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(roundNum) {
  let min, max;
  if (roundNum <= 2) { min = 2; max = 4; }
  else if (roundNum <= 4) { min = 3; max = 6; }
  else { min = 5; max = 8; }

  const count = min + Math.floor(Math.random() * (max - min + 1));
  const fieldW = SCREEN_W - 80;
  const fieldH = 250;
  const toys = [];
  for (let i = 0; i < count; i++) {
    toys.push({
      id: i,
      emoji: toyEmojis[Math.floor(Math.random() * toyEmojis.length)],
      x: 10 + Math.random() * (fieldW - 90),
      y: 10 + Math.random() * (fieldH - 90),
    });
  }

  const choices = new Set([count]);
  while (choices.size < 3) {
    let wrong = count + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
    if (wrong < 1) wrong = count + 2;
    if (wrong > 10) wrong = count - 2;
    choices.add(wrong);
  }

  return { count, toys, choices: shuffleArray([...choices]) };
}

const ToyButton = ({ toy, tapped, onPress, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: delay * 80,
      useNativeDriver: true,
      tension: 300,
      friction: 15,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 1100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.toyWrapper,
        {
          left: toy.x,
          top: toy.y,
          transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
        },
      ]}
    >
      <Pressable
        style={[styles.toy, tapped && styles.toyTapped]}
        onPress={() => onPress(toy.id)}
      >
        <Text style={styles.toyEmoji}>{toy.emoji}</Text>
        {tapped && <Text style={styles.toyCheck}>✓</Text>}
      </Pressable>
    </Animated.View>
  );
};

const CountingGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tappedToys, setTappedToys] = useState(new Set());

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleToyTap = useCallback((id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTappedToys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleAnswer = useCallback((num) => {
    if (feedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (num === roundData.count) {
      setFeedback('correct');
      setScore((s) => s + 1);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200);
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) setGameOver(true);
        else { setRound((r) => r + 1); setFeedback(null); setTappedToys(new Set()); }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, roundData.count, round]);

  if (gameOver) {
    return <GameComplete student={student} score={score} onBack={onBack} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <GameHeader round={round} score={score} onBack={onBack} />

      {/* Owl + speech */}
      <View style={styles.owlSection}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Quanti giocattoli ci sono? 🧸</Text>
          <View style={styles.speechArrowDown} />
        </View>
        <View style={styles.owlMini}>
          <OwlTeacher speaking={speaking} size={65} />
        </View>
      </View>

      {/* Toy field */}
      <View style={styles.toyField} key={round}>
        {roundData.toys.map((toy) => (
          <ToyButton
            key={`${round}-${toy.id}`}
            toy={toy}
            tapped={tappedToys.has(toy.id)}
            onPress={handleToyTap}
            delay={toy.id}
          />
        ))}
      </View>

      {/* Answer buttons */}
      <View style={styles.answers}>
        {roundData.choices.map((num, i) => (
          <AnswerButton
            key={`${round}-${num}`}
            num={num}
            correct={feedback === 'correct' && num === roundData.count}
            onPress={() => handleAnswer(num)}
            delay={i}
          />
        ))}
      </View>

      {/* Feedback */}
      {feedback && <FeedbackOverlay type={feedback} />}
    </View>
  );
};

// Shared sub-components for all games
export const GameHeader = ({ round, score, onBack }) => (
  <View style={styles.header}>
    <Pressable style={styles.exitBtn} onPress={onBack}>
      <Text style={styles.exitBtnText}>←</Text>
    </Pressable>
    <View style={styles.progress}>
      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < round - 1 && styles.dotDone,
            i === round - 1 && styles.dotCurrent,
          ]}
        />
      ))}
    </View>
    <View style={styles.scoreBox}>
      <Text style={styles.scoreText}>⭐ {score}</Text>
    </View>
  </View>
);

export const FeedbackOverlay = ({ type }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

    if (type === 'correct') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  return (
    <Animated.View style={[styles.feedback, { transform: [{ scale: anim }] }]}>
      <Text style={styles.feedbackEmoji}>{type === 'correct' ? '🎉' : '🤔'}</Text>
    </Animated.View>
  );
};

const AnswerButton = ({ num, correct, onPress, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 300 + delay * 100,
      useNativeDriver: true,
      tension: 250,
      friction: 12,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: anim }] }}>
      <Pressable
        style={[styles.answerBtn, correct && styles.answerBtnCorrect]}
        onPress={onPress}
      >
        <Text style={styles.answerBtnText}>{num}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exitBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  exitBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  progress: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dotDone: {
    backgroundColor: '#00ff88',
  },
  dotCurrent: {
    backgroundColor: '#ff6b35',
    transform: [{ scale: 1.3 }],
  },
  scoreBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  // Owl section
  owlSection: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  speechText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  speechArrowDown: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  owlMini: {
    width: 65,
  },
  // Toy field
  toyField: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderStyle: 'dashed',
    marginBottom: 12,
    position: 'relative',
    minHeight: 250,
  },
  toyWrapper: {
    position: 'absolute',
  },
  toy: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  toyTapped: {
    backgroundColor: 'rgba(0, 255, 136, 0.25)',
    borderWidth: 3,
    borderColor: '#00ff88',
  },
  toyEmoji: {
    fontSize: 32,
  },
  toyCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#00ff88',
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    overflow: 'hidden',
  },
  // Answers
  answers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 16,
  },
  answerBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#764ba2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  answerBtnCorrect: {
    backgroundColor: '#00ff88',
  },
  answerBtnText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  // Feedback
  feedback: {
    position: 'absolute',
    top: '45%',
    left: '40%',
    zIndex: 100,
  },
  feedbackEmoji: {
    fontSize: 80,
  },
});

export default CountingGame;
