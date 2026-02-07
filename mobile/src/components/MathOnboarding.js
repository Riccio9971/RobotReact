import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Pressable,
  Animated, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import OwlTeacher from './OwlTeacher';

const ageGroups = [5, 6, 7, 8];
const ageColors = ['#ff6b35', '#7b2fff', '#00f0ff', '#00ff88'];

const getDifficultyLabel = (age) => {
  if (age <= 5) return 'Piccoli Esploratori';
  if (age <= 6) return 'Giovani Matematici';
  return 'Super Matematici';
};

const SpeechBubble = ({ children }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 18,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.speechBubble,
        {
          opacity: anim,
          transform: [{ scale: anim }],
        },
      ]}
    >
      {children}
      <View style={styles.speechArrow} />
    </Animated.View>
  );
};

const MathOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSpeaking(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => setSpeaking(false), 1500);
    return () => clearTimeout(t);
  }, [step]);

  const handleNameSubmit = () => {
    if (name.trim().length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(1);
    }
  };

  const handleAgeSelect = (selectedAge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAge(selectedAge);
    setStep(2);
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onComplete({ name: name.trim(), age, difficulty: getDifficultyLabel(age) });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.scene}>
        {/* Owl */}
        <OwlTeacher speaking={speaking} size={140} />

        {/* Speech bubble */}
        {step === 0 && (
          <SpeechBubble key="step0">
            <Text style={styles.speechText}>
              Ciao! Sono il <Text style={styles.speechBold}>Prof. Gufo</Text>! 🦉
              {'\n'}Come ti chiami?
            </Text>
          </SpeechBubble>
        )}
        {step === 1 && (
          <SpeechBubble key="step1">
            <Text style={styles.speechText}>
              Che bel nome, <Text style={styles.speechBold}>{name}</Text>! 🌟
              {'\n'}Quanti anni hai?
            </Text>
          </SpeechBubble>
        )}
        {step === 2 && (
          <SpeechBubble key="step2">
            <Text style={styles.speechText}>
              Fantastico <Text style={styles.speechBold}>{name}</Text>! Hai <Text style={styles.speechBold}>{age} anni</Text>! 🎉
              {'\n'}Sei un <Text style={styles.speechBold}>{getDifficultyLabel(age)}</Text>!
              {'\n'}Pronto a divertirti con i numeri?
            </Text>
          </SpeechBubble>
        )}

        {/* Input areas */}
        <Animated.View style={[styles.inputArea, { opacity: fadeAnim }]}>
          {step === 0 && (
            <View style={styles.nameInputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Scrivi il tuo nome..."
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleNameSubmit}
              />
              <Pressable
                style={[styles.submitBtn, name.trim().length === 0 && styles.submitBtnDisabled]}
                onPress={handleNameSubmit}
                disabled={name.trim().length === 0}
              >
                <Text style={styles.submitBtnText}>Ecco! 👋</Text>
              </Pressable>
            </View>
          )}

          {step === 1 && (
            <View style={styles.ageGrid}>
              {ageGroups.map((a, i) => (
                <AgeBubble
                  key={a}
                  age={a}
                  color={ageColors[i]}
                  delay={i * 80}
                  onPress={() => handleAgeSelect(a)}
                />
              ))}
            </View>
          )}

          {step === 2 && (
            <Pressable style={styles.startBtn} onPress={handleStart}>
              <Text style={styles.startBtnText}>Iniziamo! 🚀</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const AgeBubble = ({ age, color, delay, onPress }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 400 + delay,
      useNativeDriver: true,
      tension: 250,
      friction: 12,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: anim }] }}>
      <Pressable
        style={[styles.ageBtn, { backgroundColor: color }]}
        onPress={onPress}
      >
        <Text style={styles.ageBtnText}>{age}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scene: {
    alignItems: 'center',
    gap: 20,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    paddingHorizontal: 28,
    maxWidth: 360,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  speechArrow: {
    position: 'absolute',
    top: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  speechText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
  },
  speechBold: {
    fontWeight: '700',
    color: '#ff6b35',
  },
  inputArea: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  nameInputRow: {
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  textInput: {
    width: '100%',
    maxWidth: 320,
    padding: 14,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#eee',
    borderRadius: 50,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'white',
  },
  submitBtn: {
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: '#ff6b35',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  ageGrid: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ageBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  ageBtnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  startBtn: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  startBtnText: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default MathOnboarding;
