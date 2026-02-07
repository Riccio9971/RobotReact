import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const TypewriterText = () => {
  const fullText = 'Ciao! Sono RoBot';
  const [text, setText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const cursorAnim = useRef(new Animated.Value(1)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Cursor blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowSubtitle(true);
          Animated.timing(subtitleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{text}</Text>
        <Animated.View style={[styles.cursor, { opacity: cursorAnim }]} />
      </View>
      {showSubtitle && (
        <Animated.Text style={[styles.subtitle, { opacity: subtitleAnim }]}>
          Il tuo assistente futuristico
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 60,
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00f0ff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: '#00f0ff',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(224, 224, 255, 0.5)',
    fontWeight: '300',
    letterSpacing: 4,
    marginTop: 6,
  },
});

export default TypewriterText;
