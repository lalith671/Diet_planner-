import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Filter {
  id: string;
  label: string;
  color: string;
}

interface FilterPanelProps {
  position: [number, number, number];
  filters: Filter[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  position,
  filters,
  activeFilters,
  onFilterChange
}) => {
  const panelRef = useRef<THREE.Group>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useFrame((state) => {
    if (panelRef.current) {
      // Subtle floating animation
      panelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  const handleFilterClick = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newFilters);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <group ref={panelRef} position={position}>
      {/* Main Panel Background */}
      <mesh>
        <boxGeometry args={[3, isExpanded ? filters.length * 0.8 + 2 : 1.5, 0.2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Panel Title */}
      <Text
        position={[0, isExpanded ? filters.length * 0.4 : 0, 0.11]}
        fontSize={0.2}
        color="#4FC3F7"
        anchorX="center"
        anchorY="middle"
      >
        Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
      </Text>

      {/* Expand/Collapse Button */}
      <mesh position={[1.2, isExpanded ? filters.length * 0.4 : 0, 0.1]} onClick={toggleExpanded}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.3}
        />
      </mesh>

      <Text
        position={[1.2, isExpanded ? filters.length * 0.4 : 0, 0.11]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isExpanded ? '−' : '+'}
      </Text>

      {/* Filter Options */}
      {isExpanded && filters.map((filter, index) => {
        const yPos = filters.length * 0.4 - (index + 1) * 0.6;
        const isActive = activeFilters.includes(filter.id);

        return (
          <FilterOption
            key={filter.id}
            filter={filter}
            position={[0, yPos, 0.1]}
            isActive={isActive}
            onClick={() => handleFilterClick(filter.id)}
          />
        );
      })}

      {/* Clear All Button */}
      {isExpanded && activeFilters.length > 0 && (
        <mesh position={[0, -filters.length * 0.4, 0.1]}>
          <planeGeometry args={[2.5, 0.4]} />
          <meshBasicMaterial color="#F44336" transparent opacity={0.3} />
        </mesh>
      )}

      {isExpanded && activeFilters.length > 0 && (
        <Text
          position={[0, -filters.length * 0.4, 0.11]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          onClick={() => onFilterChange([])}
        >
          Clear All
        </Text>
      )}
    </group>
  );
};

// Filter Option Component
const FilterOption: React.FC<{
  filter: Filter;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}> = ({ filter, position, isActive, onClick }) => {
  const optionRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (optionRef.current && isActive) {
      // Pulsing effect for active filters
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      optionRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Filter Background */}
      <mesh ref={optionRef} onClick={onClick}>
        <planeGeometry args={[2.5, 0.5]} />
        <meshStandardMaterial
          color={isActive ? filter.color : "#2a2a3e"}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Filter Color Indicator */}
      <mesh position={[-1, 0, 0.01]}>
        <circleGeometry args={[0.15]} />
        <meshBasicMaterial color={filter.color} />
      </mesh>

      {/* Filter Label */}
      <Text
        position={[0.3, 0, 0.02]}
        fontSize={0.15}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {filter.label}
      </Text>

      {/* Active Indicator */}
      {isActive && (
        <mesh position={[1.1, 0, 0.01]}>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </group>
  );
};