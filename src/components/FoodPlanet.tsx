import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

import { CelestialBody } from '../utils/foodToCelestialBody';

interface FoodPlanetProps {
  celestialBody: CelestialBody;
  position: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onHoverOut: () => void;
  onAnalyze: () => void;
}

export const FoodPlanet: React.FC<FoodPlanetProps> = ({
  celestialBody,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onHoverOut,
  onAnalyze
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state) => {
    if (planetRef.current) {
      // Planet rotation
      planetRef.current.rotation.y = state.clock.elapsedTime * celestialBody.orbitSpeed;

      // Hover effect - scale and lift
      if (isHovered) {
        planetRef.current.scale.setScalar(1.2);
        planetRef.current.position.y = position[1] + 0.5;
      } else if (isSelected) {
        planetRef.current.scale.setScalar(1.1);
        planetRef.current.position.y = position[1] + 0.2;
      } else {
        planetRef.current.scale.setScalar(1);
        planetRef.current.position.y = position[1];
      }

      // Pulse effect for selected planets
      if (isSelected) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        planetRef.current.scale.setScalar(pulse * 1.1);
      }
    }

    if (ringsRef.current) {
      // Rotate rings independently
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const glowIntensity = celestialBody.glowIntensity;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * glowIntensity * 0.3;
      glowRef.current.scale.setScalar(pulse);
      glowRef.current.material.opacity = glowIntensity * (0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onSelect();
  };

  const handleDoubleClick = (event: any) => {
    event.stopPropagation();
    onAnalyze();
  };

  return (
    <group
      ref={planetRef}
      position={position}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={onHover}
      onPointerOut={onHoverOut}
    >
      {/* Planet Core */}
      <mesh>
        <sphereGeometry args={[celestialBody.size, 32, 32]} />
        <meshStandardMaterial
          color={celestialBody.color}
          emissive={celestialBody.color}
          emissiveIntensity={isSelected ? 0.6 : (isHovered ? 0.4 : 0.2)}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Surface Features (continents/patterns) */}
      <PlanetSurface
        size={celestialBody.size}
        dominantNutrient={celestialBody.dominantNutrient}
      />

      {/* High Fiber Rings (for foods with >8g fiber) */}
      {celestialBody.hasRings && (
        <group ref={ringsRef}>
          <mesh rotation={[Math.PI / 2 - 0.3, 0, 0]}>
            <torusGeometry args={[celestialBody.size * 1.8, celestialBody.size * 0.1, 16, 100]} />
            <meshStandardMaterial
              color="#4CAF50"
              emissive="#4CAF50"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2 + 0.3, 0, Math.PI / 4]}>
            <torusGeometry args={[celestialBody.size * 2.2, celestialBody.size * 0.05, 8, 50]} />
            <meshStandardMaterial
              color="#81C784"
              emissive="#81C784"
              emissiveIntensity={0.2}
              transparent
              opacity={0.5}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* Nutrient Glow Aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[celestialBody.size * 1.2, 16, 16]} />
        <meshBasicMaterial
          color={celestialBody.color}
          transparent
          opacity={celestialBody.glowIntensity * 0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Click Effect Rings */}
      {isClicked && (
        <mesh>
          <sphereGeometry args={[celestialBody.size * 2, 16, 16]} />
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      )}

      {/* Food Name Label (shown on hover) */}
      {isHovered && (
        <Text
          position={[0, celestialBody.size + 0.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          backgroundColor="#1a1a2e"
          backgroundPadding={0.1}
          maxWidth={4}
        >
          {celestialBody.name}
        </Text>
      )}

      {/* Quick Stats (shown on hover) */}
      {isHovered && (
        <group position={[0, celestialBody.size + 1.5, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color={celestialBody.color}
            anchorX="center"
            anchorY="middle"
          >
            {celestialBody.calories} cal | {celestialBody.protein}g protein
          </Text>

          <Text
            position={[0, -0.25, 0]}
            fontSize={0.12}
            color="#ccc"
            anchorX="center"
            anchorY="middle"
          >
            ₹{celestialBody.price} | {celestialBody.type}
          </Text>
        </group>
      )}

      {/* Price Efficiency Indicator */}
      {celestialBody.priceEfficiency > 3.0 && (
        <mesh position={[celestialBody.size, celestialBody.size, 0]}>
          <octahedronGeometry args={[0.1]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <SelectionRing size={celestialBody.size} />
      )}

      {/* Orbital Path (faint line showing orbit) */}
      <OrbitPath radius={celestialBody.orbitRadius} />
    </group>
  );
};

// Planet Surface Component
const PlanetSurface: React.FC<{
  size: number;
  dominantNutrient: 'protein' | 'carbs' | 'fats';
}> = ({ size, dominantNutrient }) => {
  const surfacePattern = dominantNutrient === 'protein' ? 'crystalline' :
                         dominantNutrient === 'carbs' ? 'hexagonal' : 'spherical';

  const surfaceRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  if (surfacePattern === 'crystalline') {
    return (
      <mesh ref={surfaceRef}>
        <dodecahedronGeometry args={[size * 0.9]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    );
  } else if (surfacePattern === 'hexagonal') {
    return (
      <mesh ref={surfaceRef}>
        <octahedronGeometry args={[size * 0.85]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    );
  } else {
    return (
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[size * 0.95, 8, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );
  }
};

// Selection Ring Component
const SelectionRing: React.FC<{ size: number }> = ({ size }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.elapsedTime;
      ringRef.current.rotation.z = time * 0.5;
      ringRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[size * 1.3, size * 0.05, 16, 100]} />
      <meshStandardMaterial
        color="#00D4FF"
        emissive="#00D4FF"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

// Orbit Path Component
const OrbitPath: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.1, radius + 0.1, 64]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};