import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';
import GameComplete from './GameComplete';
import { GameHeader, ConfettiOverlay } from './CountingGame';

const { width: SCREEN_W } = Dimensions.get('window');
const animalEmojis = ['🐻', '🐰', '🦁', '🐸', '🐱', '🐶', '🐼', '🦊'];
const groupColors = ['#ff6b9d', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3'];
const TOTAL_ROUNDS = 5;

function generateRound(roundNum) {
  const emojiA = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
  let emojiB = emojiA;
  while (emojiB === emojiA) {
    emojiB = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
  }

  let min, max;
  if (roundNum <= 2) { min = 1; max = 4; }
  else if (roundNum <= 4) { min = 2; max = 6; }
  else { min = 3; max = 8; }

  let countA = min + Math.floor(Math.random() * (max - min + 1));
  let countB;
  do {
    countB = min + Math.floor(Math.random() * (max - min + 1));
  } while (countB === countA);

  const colorA = groupColors[Math.floor(Math.random() * groupColors.length)];
  let colorB = colorA;
  while (colorB === colorA) {
    colorB = groupColors[Math.floor(Math.random() * groupColors.length)];
  }

  return {
    groupA: { emoji: emojiA, count: countA, color: colorA, items: Array(countA).fill(emojiA) },
    groupB: { emoji: emojiB, count: countB, color: colorB, items: Array(countB).fill(emojiB) },
    correctSide: countA > countB ? 'A' : 'B',
  };
}

const BounceAnimal = ({ emoji, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: delay * 100,
      useNativeDriver: true,
      tension: 250,
      friction: 12,
    }).start();

    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -8, duration: 900 + Math.random() * 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 900 + Math.random() * 400, useNativeDriver: true }),
        ])
      ).start();
    }, delay * 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.Text style={[styles.puppet, { transform: [{ translateY: anim }, { scale: scaleAnim }] }]}>
      {emoji}
    </Animated.Text>
  );
};

const GroupButton = ({ group, side, isWinner, isWrong, onPress, fromLeft }) => {
  const slideAnim = useRef(new Animated.Value(fromLeft ? -40 : 40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 18,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isWrong) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [isWrong]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 10 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 15 }).start();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: opacityAnim,
        transform: [
          { translateX: Animated.add(slideAnim, shakeAnim) },
          { scale: pressAnim },
        ],
      }}
    >
      <Pressable
        style={[
          styles.group,
          { borderColor: group.color },
          isWinner && styles.groupWinner,
        ]}
        onPress={() => onPress(side)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.groupItems}>
          {group.items.map((emoji, i) => (
            <BounceAnimal key={i} emoji={emoji} delay={i} />
          ))}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const CompareGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleGroupTap = useCallback((side) => {
    if (feedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (side === roundData.correctSide) {
      setFeedback('correct');
      setScore((s) => s + 1);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200);
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) setGameOver(true);
        else { setRound((r) => r + 1); setFeedback(null); }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, roundData.correctSide, round]);

  if (gameOver) {
    return <GameComplete student={student} score={score} onBack={onBack} />;
  }

  return (
    <View style={styles.container}>
      <GameHeader round={round} score={score} onBack={onBack} />

      <View style={styles.owlSection}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            Chi ha <Text style={styles.bold}>di più</Text>? 🤔 Tocca il gruppo!
          </Text>
          <View style={styles.speechArrowDown} />
        </View>
        <View style={styles.owlMini}>
          <OwlTeacher speaking={speaking} size={65} />
        </View>
      </View>

      <View style={styles.groupsRow} key={round}>
        <GroupButton
          group={roundData.groupA}
          side="A"
          isWinner={feedback === 'correct' && roundData.correctSide === 'A'}
          isWrong={feedback === 'wrong' && roundData.correctSide !== 'A'}
          onPress={handleGroupTap}
          fromLeft={true}
        />

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <GroupButton
          group={roundData.groupB}
          side="B"
          isWinner={feedback === 'correct' && roundData.correctSide === 'B'}
          isWrong={feedback === 'wrong' && roundData.correctSide !== 'B'}
          onPress={handleGroupTap}
          fromLeft={false}
        />
      </View>

      {feedback && <ConfettiOverlay type={feedback} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
  bold: {
    fontWeight: '700',
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
  groupsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
  },
  group: {
    flex: 1,
    minHeight: 200,
    borderWidth: 4,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  groupWinner: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    borderColor: '#00ff88',
  },
  groupItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  puppet: {
    fontSize: 32,
  },
  vsContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -22,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ff2d7b',
  },
});

export default CompareGame;
