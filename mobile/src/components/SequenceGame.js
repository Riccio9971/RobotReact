import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';
import GameComplete from './GameComplete';
import { GameHeader, ConfettiOverlay } from './CountingGame';

const { width: SCREEN_W } = Dimensions.get('window');
const dollEmojis = ['🎎', '👧', '💃', '🧝‍♀️', '🧚', '🎀', '👸', '🌸'];
const dollColors = ['#ff6b9d', '#c471ed', '#f7797d', '#fbc2eb', '#a18cd1', '#e8a0bf', '#ff9a9e', '#fad0c4'];
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
  const count = Math.min(3 + Math.floor((roundNum - 1) / 2), 5);
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  const shuffled = shuffleArray(numbers);

  const items = shuffled.map((num) => ({
    id: `${roundNum}-${num}`,
    number: num,
    emoji: dollEmojis[(num - 1) % dollEmojis.length],
    color: dollColors[(num - 1) % dollColors.length],
    bounceDelay: Math.random() * 600,
  }));

  return { count, items, correctOrder: numbers };
}

const SequenceGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleItemTap = useCallback((item) => {
    if (transitioning) return;

    const nextExpected = placed.length + 1;

    if (item.number === nextExpected) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const newPlaced = [...placed, item.number];
      setPlaced(newPlaced);
      setWrongId(null);

      if (newPlaced.length === roundData.count) {
        setTransitioning(true);
        setScore((s) => s + 1);
        setSpeaking(true);
        setTimeout(() => setSpeaking(false), 1200);
        setTimeout(() => {
          if (round >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            setRound((r) => r + 1);
            setPlaced([]);
            setTransitioning(false);
          }
        }, 1500);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrongId(item.id);
      setTimeout(() => setWrongId(null), 600);
    }
  }, [placed, roundData.count, round, transitioning]);

  if (gameOver) {
    return <GameComplete student={student} score={score} onBack={onBack} />;
  }

  // Calculate responsive slot size
  const maxSlotWidth = (SCREEN_W - 64 - (roundData.count - 1) * 12) / roundData.count;
  const slotW = Math.min(74, maxSlotWidth);
  const slotH = slotW * 1.2;

  return (
    <View style={styles.container}>
      <GameHeader round={round} score={score} onBack={onBack} />

      <View style={styles.owlSection}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Metti in fila! 🎎 Tocca 1, poi 2, poi 3...</Text>
          <View style={styles.speechArrowDown} />
        </View>
        <View style={styles.owlMini}>
          <OwlTeacher speaking={speaking} size={65} />
        </View>
      </View>

      {/* Target slots */}
      <View style={styles.slots} key={`slots-${round}`}>
        {roundData.correctOrder.map((num) => {
          const isPlaced = placed.includes(num);
          const item = roundData.items.find((it) => it.number === num);
          return (
            <View
              key={`${round}-slot-${num}`}
              style={[
                styles.slot,
                { width: slotW, height: slotH },
                isPlaced && { borderStyle: 'solid', borderColor: item.color, backgroundColor: 'rgba(255,255,255,0.85)' },
              ]}
            >
              {isPlaced ? (
                <SlotContent emoji={item.emoji} num={num} />
              ) : (
                <Text style={[styles.slotPlaceholder, { fontSize: slotW * 0.3 }]}>{num}</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Tappable items */}
      <View style={styles.items} key={`items-${round}`}>
        {roundData.items.map((item, i) => {
          const isPlaced = placed.includes(item.number);
          if (isPlaced) return null;
          return (
            <SequenceItem
              key={item.id}
              item={item}
              wrong={wrongId === item.id}
              onPress={() => handleItemTap(item)}
              delay={i}
            />
          );
        })}
      </View>

      {transitioning && <ConfettiOverlay type="correct" />}
    </View>
  );
};

const SlotContent = ({ emoji, num }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 15,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.slotContent,
        {
          transform: [
            { scale: anim },
            { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] }) },
          ],
        },
      ]}
    >
      <Text style={styles.slotEmoji}>{emoji}</Text>
      <Text style={styles.slotNum}>{num}</Text>
    </Animated.View>
  );
};

const SequenceItem = ({ item, wrong, onPress, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: delay * 100,
      useNativeDriver: true,
      tension: 250,
      friction: 12,
    }).start();

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -8, duration: 900 + Math.random() * 400, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 900 + Math.random() * 400, useNativeDriver: true }),
        ])
      ).start();
    }, item.bounceDelay);
  }, []);

  useEffect(() => {
    if (wrong) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [wrong]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(wiggleAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateY: bounceAnim },
          { translateX: Animated.add(shakeAnim, wiggleAnim) },
        ],
      }}
    >
      <Pressable
        style={[styles.item, { borderColor: item.color }]}
        onPress={handlePress}
      >
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <Text style={styles.itemNum}>{item.number}</Text>
      </Pressable>
    </Animated.View>
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
  slots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 12,
  },
  slot: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  slotContent: {
    alignItems: 'center',
    gap: 2,
  },
  slotEmoji: {
    fontSize: 26,
  },
  slotNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  slotPlaceholder: {
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.12)',
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 18,
    padding: 16,
  },
  item: {
    width: 82,
    height: 96,
    borderWidth: 4,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemNum: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
});

export default SequenceGame;
