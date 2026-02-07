import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';
import GameComplete from './GameComplete';
import { GameHeader, FeedbackOverlay } from './CountingGame';

const ballEmojis = ['⚽', '🏀', '🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚾', '🎾'];
const TOTAL_ROUNDS = 5;

function generateRound(roundNum) {
  let min, max;
  if (roundNum <= 2) { min = 1; max = 3; }
  else if (roundNum <= 4) { min = 3; max = 5; }
  else { min = 4; max = 7; }
  const target = min + Math.floor(Math.random() * (max - min + 1));
  const totalBalls = target + 2 + Math.floor(Math.random() * 3);

  const balls = [];
  for (let i = 0; i < totalBalls; i++) {
    balls.push({
      id: i,
      emoji: ballEmojis[Math.floor(Math.random() * ballEmojis.length)],
    });
  }
  return { target, balls };
}

const BallButton = ({ ball, selected, onPress, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: delay * 60,
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateY: bounceAnim }] }}>
      <Pressable
        style={[styles.ball, selected && styles.ballSelected]}
        onPress={() => onPress(ball.id)}
      >
        <Text style={styles.ballEmoji}>{ball.emoji}</Text>
        {selected && <Text style={styles.ballCheck}>✓</Text>}
      </Pressable>
    </Animated.View>
  );
};

const BalloonGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleBallTap = useCallback((id) => {
    if (feedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (feedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selected.size === roundData.target) {
      setFeedback('correct');
      setScore((s) => s + 1);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200);
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) setGameOver(true);
        else { setRound((r) => r + 1); setSelected(new Set()); setFeedback(null); }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, selected.size, roundData.target, round]);

  if (gameOver) {
    return <GameComplete student={student} score={score} onBack={onBack} />;
  }

  return (
    <View style={styles.container}>
      <GameHeader round={round} score={score} onBack={onBack} />

      {/* Owl + speech */}
      <View style={styles.owlSection}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            Prendi <Text style={styles.targetNum}>{roundData.target}</Text> palloni! ⚽
          </Text>
          <View style={styles.speechArrowDown} />
        </View>
        <View style={styles.owlMini}>
          <OwlTeacher speaking={speaking} size={65} />
        </View>
      </View>

      {/* Ball grid */}
      <View style={styles.ballGrid} key={round}>
        {roundData.balls.map((ball) => (
          <BallButton
            key={`${round}-${ball.id}`}
            ball={ball}
            selected={selected.has(ball.id)}
            onPress={handleBallTap}
            delay={ball.id}
          />
        ))}
      </View>

      {/* Footer: counter + check */}
      <View style={styles.footer}>
        <View style={styles.counter}>
          <Text style={styles.counterCurrent}>{selected.size}</Text>
          <Text style={styles.counterSep}>/</Text>
          <Text style={styles.counterTarget}>{roundData.target}</Text>
        </View>
        <Pressable
          style={[styles.checkBtn, selected.size === roundData.target && styles.checkBtnReady]}
          onPress={handleCheck}
        >
          <Text style={styles.checkBtnText}>✓ Fatto!</Text>
        </Pressable>
      </View>

      {feedback && <FeedbackOverlay type={feedback} />}
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
  targetNum: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7b2fff',
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
  ballGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  ball: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ballSelected: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderColor: '#00ff88',
  },
  ballEmoji: {
    fontSize: 30,
  },
  ballCheck: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00ff88',
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 16,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  counterCurrent: {
    fontSize: 32,
    fontWeight: '700',
    color: '#7b2fff',
  },
  counterSep: {
    fontSize: 24,
    color: '#aaa',
  },
  counterTarget: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6b35',
  },
  checkBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  checkBtnReady: {
    backgroundColor: '#00ff88',
  },
  checkBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});

export default BalloonGame;
