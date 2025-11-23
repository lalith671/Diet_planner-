import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SearchFieldProps {
  position: [number, number, number];
  value: string;
  onChange: (value: string) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  position,
  value,
  onChange
}) => {
  const searchRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (searchRef.current) {
      // Floating animation
      searchRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Hover effect
      if (isHovered) {
        searchRef.current.scale.setScalar(1.05);
      } else {
        searchRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = () => {
    // In a real implementation, this would open a search UI
    const searchQuery = prompt('Search for foods:');
    if (searchQuery !== null) {
      onChange(searchQuery);
    }
  };

  return (
    <group
      ref={searchRef}
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Search Field Background */}
      <mesh>
        <boxGeometry args={[4, 1, 0.2]} />
        <meshStandardMaterial
          color={isHovered ? "#2a3f5f" : "#1a1a2e"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Search Icon */}
      <mesh position={[-1.5, 0, 0.1]}>
        <circleGeometry args={[0.3]} />
        <meshBasicMaterial color="#4FC3F7" />
      </mesh>

      {/* Search Text */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.2}
        color={value ? "white" : "#ccc"}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {value || "Search foods..."}
      </Text>

      {/* Glow effect when hovered */}
      {isHovered && (
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[4.2, 1.2]} />
          <meshBasicMaterial
            color="#4FC3F7"
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};