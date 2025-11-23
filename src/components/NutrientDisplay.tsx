import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface NutrientDisplayProps {
  position: [number, number, number];
  nutrient: 'protein' | 'carbs' | 'calories' | 'fats' | 'fiber';
  value: number;
  target: number;
}

export const NutrientDisplay: React.FC<NutrientDisplayProps> = ({
  position,
  nutrient,
  value,
  target
}) => {
  const displayRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    // Create particle system
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: getNutrientColor(nutrient),
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    particlesRef.current = points;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [nutrient]);

  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      displayRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  const percentage = Math.min((value / target) * 100, 100);
  const status = percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'low';

  return (
    <group ref={displayRef} position={position}>
      {/* Central Orb */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={getNutrientColor(nutrient)}
          emissive={getNutrientColor(nutrient)}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Rotating Ring */}
      <mesh>
        <torusGeometry args={[0.4, 0.05, 8, 32]} />
        <meshStandardMaterial
          color={getNutrientColor(nutrient)}
          emissive={getNutrientColor(nutrient)}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Particle System */}
      {particlesRef.current && <primitive object={particlesRef.current} />}

      {/* Nutrient Label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {nutrient.toUpperCase()}
      </Text>

      {/* Value Display */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {formatNutrientValue(nutrient, value)}
      </Text>

      {/* Target Display */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.1}
        color="#ccc"
        anchorX="center"
        anchorY="middle"
      >
        Target: {formatNutrientValue(nutrient, target)}
      </Text>

      {/* Status Indicator */}
      <StatusIndicator
        position={[0.5, 0, 0]}
        status={status}
      />
    </group>
  );
};

function getNutrientColor(nutrient: string): string {
  switch (nutrient) {
    case 'protein': return '#4CAF50';
    case 'carbs': return '#FF9800';
    case 'calories': return '#F44336';
    case 'fats': return '#FFC107';
    case 'fiber': return '#9C27B0';
    default: return '#2196F3';
  }
}

function formatNutrientValue(nutrient: string, value: number): string {
  switch (nutrient) {
    case 'calories': return `${Math.round(value)} cal`;
    default: return `${Math.round(value)}g`;
  }
}

// Status Indicator Component
const StatusIndicator: React.FC<{
  position: [number, number, number];
  status: 'excellent' | 'good' | 'low';
}> = ({ position, status }) => {
  const indicatorRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (indicatorRef.current) {
      const color = status === 'excellent' ? '#4CAF50' : status === 'good' ? '#FF9800' : '#F44336';
      (indicatorRef.current.material as THREE.MeshStandardMaterial).color.set(color);
      (indicatorRef.current.material as THREE.MeshStandardMaterial).emissive.set(color);
    }
  }, [status]);

  useFrame((state) => {
    if (indicatorRef.current) {
      const intensity = status === 'excellent' ? 1 : status === 'good' ? 0.6 : 0.3;
      indicatorRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2 * intensity);
    }
  });

  return (
    <mesh ref={indicatorRef} position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color="#4CAF50"
        emissive="#4CAF50"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};