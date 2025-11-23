import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

import { CelestialBody, createFoodConstellation } from '../utils/foodToCelestialBody';

interface FoodConstellationProps {
  constellation: {
    id: string;
    name: string;
    foods: any[];
    center: { x: number; y: number; z: number };
  };
  bodies: CelestialBody[];
  isSelected: boolean;
  onSelect: () => void;
}

export const FoodConstellation: React.FC<FoodConstellationProps> = ({
  constellation,
  bodies,
  isSelected,
  onSelect
}) => {
  const constellationRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line>(null);

  // Create constellation connections
  const { connections } = useMemo(() => {
    return createFoodConstellation(bodies);
  }, [bodies]);

  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    if (connections.length === 0) return null;

    const positions = new Float32Array(connections.length * 6);
    connections.forEach((connection, i) => {
      const [start, end] = connection;
      const startPos = bodies[start]?.position || { x: 0, y: 0, z: 0 };
      const endPos = bodies[end]?.position || { x: 0, y: 0, z: 0 };

      positions[i * 6] = startPos.x;
      positions[i * 6 + 1] = startPos.y;
      positions[i * 6 + 2] = startPos.z;
      positions[i * 6 + 3] = endPos.x;
      positions[i * 6 + 4] = endPos.y;
      positions[i * 6 + 5] = endPos.z;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [connections, bodies]);

  useFrame((state) => {
    if (constellationRef.current) {
      // Subtle rotation of constellation
      constellationRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }

    if (lineRef.current && lineGeometry) {
      // Pulsing effect for selected constellations
      if (isSelected) {
        const material = lineRef.current.material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });

  if (!lineGeometry || connections.length === 0) {
    return null;
  }

  return (
    <group ref={constellationRef} position={[constellation.center.x, constellation.center.y, constellation.center.z]}>
      {/* Constellation Connections */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={isSelected ? "#00D4FF" : "#4CAF50"}
          transparent
          opacity={isSelected ? 0.6 : 0.3}
          linewidth={isSelected ? 2 : 1}
        />
      </line>

      {/* Constellation Boundary (optional visual effect) */}
      {isSelected && (
        <mesh onPointerOver={onSelect}>
          <sphereGeometry args={[5, 16, 16]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.05}
            wireframe
          />
        </mesh>
      )}

      {/* Constellation Label */}
      {isSelected && (
        <mesh position={[0, 3, 0]}>
          <planeGeometry args={[4, 1]} />
          <meshBasicMaterial
            color="#1a1a2e"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {isSelected && (
        <Text
          position={[0, 3, 0.01]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {constellation.name}
        </Text>
      )}

      {/* Constellation Stats */}
      {isSelected && bodies.length > 0 && (
        <group position={[0, 2, 0]}>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.2}
            color="#ccc"
            anchorX="center"
            anchorY="middle"
          >
            {bodies.length} foods | Avg: {Math.round(bodies.reduce((sum, b) => sum + b.calories, 0) / bodies.length)} cal
          </Text>
        </group>
      )}
    </group>
  );
};