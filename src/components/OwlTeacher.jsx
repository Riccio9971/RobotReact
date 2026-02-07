import React from 'react';
import { motion } from 'framer-motion';

const OwlTeacher = ({ speaking }) => {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width="180"
        height="200"
        viewBox="0 0 180 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(139, 90, 43, 0.2))' }}
      >
        {/* Body */}
        <ellipse cx="90" cy="140" rx="60" ry="55" fill="#8B5E3C" />
        <ellipse cx="90" cy="140" rx="60" ry="55" fill="url(#owlBodyGrad)" />
        {/* Belly */}
        <ellipse cx="90" cy="150" rx="38" ry="38" fill="#F5DEB3" />
        <ellipse cx="90" cy="150" rx="38" ry="38" fill="url(#bellyGrad)" />
        {/* Belly pattern - V shapes */}
        <g opacity="0.15" stroke="#8B5E3C" strokeWidth="1.5" fill="none">
          <path d="M78 135 L82 140 L86 135" />
          <path d="M90 135 L94 140 L98 135" />
          <path d="M72 145 L76 150 L80 145" />
          <path d="M84 145 L88 150 L92 145" />
          <path d="M96 145 L100 150 L104 145" />
          <path d="M78 155 L82 160 L86 155" />
          <path d="M90 155 L94 160 L98 155" />
        </g>

        {/* Head */}
        <ellipse cx="90" cy="75" rx="55" ry="50" fill="#A0724A" />
        <ellipse cx="90" cy="75" rx="55" ry="50" fill="url(#owlHeadGrad)" />

        {/* Ear tufts */}
        <path d="M45 40 Q50 20 58 38" fill="#8B5E3C" />
        <path d="M45 40 Q50 22 56 37" fill="#A0724A" />
        <path d="M135 40 Q130 20 122 38" fill="#8B5E3C" />
        <path d="M135 40 Q130 22 124 37" fill="#A0724A" />

        {/* Face disc - lighter area around eyes */}
        <ellipse cx="68" cy="72" rx="28" ry="26" fill="#F5DEB3" />
        <ellipse cx="112" cy="72" rx="28" ry="26" fill="#F5DEB3" />

        {/* Eyes - big and cute */}
        <circle cx="68" cy="70" r="18" fill="white" stroke="#5a3a1a" strokeWidth="2" />
        <circle cx="112" cy="70" r="18" fill="white" stroke="#5a3a1a" strokeWidth="2" />
        {/* Irises */}
        <circle cx="68" cy="70" r="11" fill="#4A2800" />
        <circle cx="112" cy="70" r="11" fill="#4A2800" />
        {/* Pupils */}
        <circle cx="68" cy="70" r="6" fill="#1a0a00" />
        <circle cx="112" cy="70" r="6" fill="#1a0a00" />
        {/* Eye shine */}
        <circle cx="63" cy="65" r="4" fill="white" opacity="0.9" />
        <circle cx="107" cy="65" r="4" fill="white" opacity="0.9" />
        <circle cx="72" cy="74" r="2" fill="white" opacity="0.5" />
        <circle cx="116" cy="74" r="2" fill="white" opacity="0.5" />

        {/* Glasses */}
        <circle cx="68" cy="70" r="22" fill="none" stroke="#ff6b35" strokeWidth="3" />
        <circle cx="112" cy="70" r="22" fill="none" stroke="#ff6b35" strokeWidth="3" />
        {/* Bridge */}
        <path d="M90 70 Q90 64 90 70" fill="none" stroke="#ff6b35" strokeWidth="3" />
        <line x1="90" y1="67" x2="90" y2="73" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" />
        {/* Arms of glasses */}
        <line x1="46" y1="68" x2="38" y2="60" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="134" y1="68" x2="142" y2="60" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        {/* Glasses glare */}
        <path d="M54 58 Q58 55 62 58" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <path d="M98 58 Q102 55 106 58" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

        {/* Beak */}
        <motion.path
          d={speaking
            ? "M82 92 Q90 108 98 92 Q90 100 82 92"
            : "M84 92 Q90 104 96 92 Q90 97 84 92"
          }
          fill="#FF8C00"
          stroke="#E07000"
          strokeWidth="1"
          transition={{ duration: 0.15 }}
        />

        {/* Rosy cheeks */}
        <circle cx="48" cy="82" r="8" fill="#FFB6C1" opacity="0.4" />
        <circle cx="132" cy="82" r="8" fill="#FFB6C1" opacity="0.4" />

        {/* Wings */}
        <path d="M30 115 Q18 130 28 155 Q32 145 35 140" fill="#7A5230" />
        <path d="M150 115 Q162 130 152 155 Q148 145 145 140" fill="#7A5230" />

        {/* Feet */}
        <g fill="#FF8C00" stroke="#E07000" strokeWidth="1">
          <path d="M65 192 L58 200 L66 197 L70 200 L72 195" />
          <path d="M115 192 L122 200 L114 197 L110 200 L108 195" />
        </g>

        {/* Graduation cap / teacher hat */}
        <rect x="60" y="26" width="60" height="6" rx="1" fill="#333" />
        <polygon points="90,8 60,26 120,26" fill="#333" />
        <polygon points="90,8 60,26 120,26" fill="#444" />
        {/* Tassel */}
        <line x1="112" y1="20" x2="125" y2="30" stroke="#ffaa00" strokeWidth="2" />
        <circle cx="127" cy="32" r="3" fill="#ffaa00" />

        <defs>
          <linearGradient id="owlBodyGrad" x1="30" y1="85" x2="150" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A0724A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6B4226" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="owlHeadGrad" x1="35" y1="25" x2="145" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B8855A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7A5230" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="bellyGrad" cx="90" cy="145" r="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D2B48C" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default OwlTeacher;
