import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Trail } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface AIAvatarProps {
  position: [number, number, number];
  message: string;
  isAnalyzing: boolean;
  onAnalysisComplete: (results: any) => void;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  position,
  message,
  isAnalyzing,
  onAnalysisComplete
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'talking' | 'analyzing'>('idle');
  const [gesturePhase, setGesturePhase] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      setCurrentAnimation('analyzing');
    } else if (message) {
      setCurrentAnimation('talking');
    } else {
      setCurrentAnimation('idle');
    }
  }, [isAnalyzing, message]);

  useFrame((state) => {
    if (avatarRef.current) {
      const time = state.clock.elapsedTime;

      // Idle animation - subtle breathing
      if (currentAnimation === 'idle') {
        avatarRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
        avatarRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
      }

      // Talking animation - head movement and gestures
      if (currentAnimation === 'talking') {
        avatarRef.current.rotation.y = Math.sin(time * 4) * 0.1;
        avatarRef.current.position.y = position[1] + Math.sin(time * 3) * 0.1;

        // Gesture timing
        if (Math.floor(time * 2) % 4 === 0) {
          setGesturePhase(prev => prev + 1);
        }
      }

      // Analyzing animation - focused thinking
      if (currentAnimation === 'analyzing') {
        avatarRef.current.rotation.z = Math.sin(time * 2) * 0.05;
        avatarRef.current.position.y = position[1] + Math.cos(time * 1.8) * 0.08;
      }
    }
  });

  return (
    <group ref={avatarRef} position={position}>
      {/* Avatar Body */}
      <AvatarBody isAnalyzing={isAnalyzing} gesturePhase={gesturePhase} />

      {/* Avatar Head */}
      <AvatarHead isAnalyzing={isAnalyzing} />

      {/* Speech Bubble */}
      {message && (
        <SpeechBubble
          message={message}
          position={[0, 2.5, 0]}
          isActive={currentAnimation === 'talking'}
        />
      )}

      {/* Holographic Base */}
      <HolographicBase />
    </group>
  );
};

// Avatar Body Component
const AvatarBody: React.FC<{ isAnalyzing: boolean; gesturePhase: number }> = ({
  isAnalyzing,
  gesturePhase
}) => {
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Arm animations
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 3 + gesturePhase) * 0.5;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -Math.sin(time * 3 + gesturePhase) * 0.3;
    }
  });

  return (
    <group>
      {/* Main Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial
          color={isAnalyzing ? "#4FC3F7" : "#9C27B0"}
          emissive={isAnalyzing ? "#4FC3F7" : "#9C27B0"}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.5, 0.7, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={isAnalyzing ? "#29B6F6" : "#7B1FA2"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.5, 0.7, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={isAnalyzing ? "#29B6F6" : "#7B1FA2"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Energy Core */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Avatar Head Component
const AvatarHead: React.FC<{ isAnalyzing: boolean }> = ({ isAnalyzing }) => {
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (headRef.current) {
      const time = state.clock.elapsedTime;
      headRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      headRef.current.rotation.x = Math.cos(time * 1.5) * 0.05;
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      {/* Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={isAnalyzing ? "#81D4FA" : "#BA68C8"}
          emissive={isAnalyzing ? "#81D4FA" : "#BA68C8"}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Eyes */}
      <Eye position={[-0.1, 0.1, 0.25]} isAnalyzing={isAnalyzing} />
      <Eye position={[0.1, 0.1, 0.25]} isAnalyzing={isAnalyzing} />

      {/* Visor/Antenna */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.5}
          metalness={0.9}
        />
      </mesh>

      {/* Antenna Light */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color={isAnalyzing ? "#FF5722" : "#4CAF50"}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Eye Component
const Eye: React.FC<{ position: [number, number, number]; isAnalyzing: boolean }> = ({
  position,
  isAnalyzing
}) => {
  const eyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (eyeRef.current) {
      const time = state.clock.elapsedTime;
      eyeRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
    }
  });

  return (
    <mesh position={position} ref={eyeRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial
        color={isAnalyzing ? "#FF5722" : "#FFFFFF"}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// Speech Bubble Component
const SpeechBubble: React.FC<{
  message: string;
  position: [number, number, number];
  isActive: boolean;
}> = ({ message, position, isActive }) => {
  return (
    <group position={position}>
      {/* Bubble Background */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#1a1a2e"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Text */}
      <Text
        position={[0, 0, 0.61]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {message}
      </Text>

      {/* Bubble Tail */}
      <mesh position={[0, -0.8, 0]}>
        <coneGeometry args={[0.3, 0.4, 4]} />
        <meshBasicMaterial
          color="#1a1a2e"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Animated Border */}
      {isActive && (
        <mesh position={[0, 0, 0.62]}>
          <torusGeometry args={[1.21, 0.05, 8, 32]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
};

// Holographic Base Component
const HolographicBase: React.FC = () => {
  const baseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (baseRef.current) {
      baseRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh position={[0, -0.1, 0]} ref={baseRef}>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive="#00D4FF"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};