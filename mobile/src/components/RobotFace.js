import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Filter,
  Rect, Circle, Ellipse, Line, Path, G,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RobotFace = () => {
  const [blinking, setBlinking] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const antennaAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Antenna pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(antennaAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(antennaAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Blinking
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Svg
        width={160}
        height={160}
        viewBox="-20 -50 240 240"
        fill="none"
      >
        <Defs>
          <LinearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1a1a2e" />
            <Stop offset="50%" stopColor="#16162a" />
            <Stop offset="100%" stopColor="#0f0f1e" />
          </LinearGradient>
          <LinearGradient id="chromeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <Stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </LinearGradient>
          <LinearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1e1e38" />
            <Stop offset="100%" stopColor="#12122a" />
          </LinearGradient>
        </Defs>

        {/* Glow beneath */}
        <Ellipse cx="100" cy="175" rx="60" ry="8" fill="rgba(0, 240, 255, 0.06)" />

        {/* Antenna */}
        <Line x1="100" y1="-5" x2="100" y2="-35" stroke="#2a2a4a" strokeWidth="3" strokeLinecap="round" />
        <AnimatedCircle cx="100" cy="-40" r="7" fill="#7b2fff" opacity={antennaAnim} />

        {/* Ears */}
        <Rect x="-15" y="50" width="18" height="50" rx="6" fill="url(#earGrad)" stroke="#2a2a4a" strokeWidth="1" />
        <Rect x="197" y="50" width="18" height="50" rx="6" fill="url(#earGrad)" stroke="#2a2a4a" strokeWidth="1" />
        {/* Ear LEDs */}
        <Circle cx="-6" cy="65" r="2" fill="#00f0ff" opacity={0.6} />
        <Circle cx="-6" cy="75" r="2" fill="#7b2fff" opacity={0.6} />
        <Circle cx="-6" cy="85" r="2" fill="#ff2d7b" opacity={0.6} />
        <Circle cx="206" cy="65" r="2" fill="#00f0ff" opacity={0.6} />
        <Circle cx="206" cy="75" r="2" fill="#7b2fff" opacity={0.6} />
        <Circle cx="206" cy="85" r="2" fill="#ff2d7b" opacity={0.6} />

        {/* Head */}
        <Rect x="5" y="0" width="190" height="150" rx="35" fill="url(#headGrad)" stroke="#2a2a4a" strokeWidth="1.5" />
        <Rect x="5" y="0" width="190" height="150" rx="35" fill="url(#chromeHighlight)" />

        {/* Forehead line */}
        <Line x1="50" y1="25" x2="150" y2="25" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1" />

        {/* Eye sockets */}
        <Rect x="25" y="45" width="60" height="45" rx="14" fill="#080818" />
        <Rect x="115" y="45" width="60" height="45" rx="14" fill="#080818" />

        {/* Eyes */}
        <G opacity={blinking ? 0.1 : 1}>
          <Ellipse cx="55" cy="67" rx="20" ry={blinking ? 2 : 15} fill="#00f0ff" opacity={0.9} />
          <Ellipse cx="55" cy="67" rx="14" ry={blinking ? 1 : 10} fill="#00d4e0" />
          <Ellipse cx="55" cy="67" rx="7" ry={blinking ? 1 : 7} fill="#ffffff" opacity={0.9} />
          <Ellipse cx="50" cy="62" rx="3" ry={blinking ? 0.5 : 2} fill="#ffffff" opacity={0.6} />

          <Ellipse cx="145" cy="67" rx="20" ry={blinking ? 2 : 15} fill="#00f0ff" opacity={0.9} />
          <Ellipse cx="145" cy="67" rx="14" ry={blinking ? 1 : 10} fill="#00d4e0" />
          <Ellipse cx="145" cy="67" rx="7" ry={blinking ? 1 : 7} fill="#ffffff" opacity={0.9} />
          <Ellipse cx="140" cy="62" rx="3" ry={blinking ? 0.5 : 2} fill="#ffffff" opacity={0.6} />
        </G>

        {/* Nose */}
        <Circle cx="100" cy="100" r="3" fill="#2a2a4a" />

        {/* Mouth */}
        <Path
          d="M 60 118 Q 80 140 100 140 Q 120 140 140 118"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />

        {/* Chin dots */}
        <Circle cx="80" cy="140" r="1.5" fill="rgba(0, 240, 255, 0.2)" />
        <Circle cx="100" cy="144" r="1.5" fill="rgba(0, 240, 255, 0.3)" />
        <Circle cx="120" cy="140" r="1.5" fill="rgba(0, 240, 255, 0.2)" />

        {/* Circuit patterns */}
        <G opacity={0.1} stroke="#00f0ff" strokeWidth="0.5" fill="none">
          <Path d="M 30 30 L 40 30 L 40 35" />
          <Path d="M 160 30 L 170 30 L 170 35" />
          <Circle cx="40" cy="37" r="1.5" fill="#00f0ff" />
          <Circle cx="170" cy="37" r="1.5" fill="#00f0ff" />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default RobotFace;
