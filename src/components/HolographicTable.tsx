import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface HolographicTableProps {
  position: [number, number, number];
  userData: any;
  nutritionData: any;
}

export const HolographicTable: React.FC<HolographicTableProps> = ({
  position,
  userData,
  nutritionData
}) => {
  const tableRef = useRef<THREE.Group>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useFrame((state) => {
    if (tableRef.current) {
      // Subtle hovering effect
      tableRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={tableRef} position={position}>
      {/* Table Base */}
      <TableBase />

      {/* Holographic Display */}
      <HolographicDisplay
        userData={userData}
        nutritionData={nutritionData}
        hoveredItem={hoveredItem}
        onItemHover={setHoveredItem}
      />

      {/* Control Panels */}
      <ControlPanels />
    </group>
  );
};

// Table Base Component
const TableBase: React.FC = () => {
  const baseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (baseRef.current) {
      // Rotating energy core
      baseRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      {/* Main Table Surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.7}
          roughness={0.3}
          emissive="#1e5f8e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Table Edge */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[2.5, 0.1, 8, 32]} />
        <meshStandardMaterial
          color="#1e5f8e"
          emissive="#4FC3F7"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Energy Core */}
      <mesh position={[0, 0.2, 0]} ref={baseRef}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Energy Particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <EnergyParticle
            key={i}
            position={[
              Math.cos(angle) * 2,
              0.5 + Math.sin(i * 0.5) * 0.2,
              Math.sin(angle) * 2
            ]}
            delay={i * 0.2}
          />
        );
      })}
    </group>
  );
};

// Holographic Display Component
const HolographicDisplay: React.FC<{
  userData: any;
  nutritionData: any;
  hoveredItem: string | null;
  onItemHover: (item: string | null) => void;
}> = ({ userData, nutritionData, hoveredItem, onItemHover }) => {
  return (
    <group position={[0, 0.3, 0]}>
      {/* User Stats Display */}
      <StatCard
        position={[-1.5, 0, -1]}
        title="BMI"
        value={nutritionData?.bmi?.toFixed(1) || '0'}
        subtitle={userData?.weight ? `${userData.weight}kg, ${userData.height}cm` : ''}
        color="#4CAF50"
        isHovered={hoveredItem === 'bmi'}
        onHover={() => onItemHover('bmi')}
        onHoverOut={() => onItemHover(null)}
      />

      <StatCard
        position={[-0.5, 0, -1]}
        title="BMR"
        value={`${nutritionData?.bmr || '0'} cal`}
        subtitle="Basal Metabolic Rate"
        color="#2196F3"
        isHovered={hoveredItem === 'bmr'}
        onHover={() => onItemHover('bmr')}
        onHoverOut={() => onItemHover(null)}
      />

      <StatCard
        position={[0.5, 0, -1]}
        title="Target"
        value={`${nutritionData?.targetCalories || '0'} cal`}
        subtitle="Daily Target"
        color="#FF9800"
        isHovered={hoveredItem === 'target'}
        onHover={() => onItemHover('target')}
        onHoverOut={() => onItemHover(null)}
      />

      <StatCard
        position={[1.5, 0, -1]}
        title="Budget"
        value={`₹${userData?.budget || '0'}`}
        subtitle="Daily Budget"
        color="#FFD700"
        isHovered={hoveredItem === 'budget'}
        onHover={() => onItemHover('budget')}
        onHoverOut={() => onItemHover(null)}
      />

      {/* Nutrition Summary */}
      <NutritionSummary
        position={[0, 0, 1]}
        nutritionData={nutritionData}
      />
    </group>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  position: [number, number, number];
  title: string;
  value: string;
  subtitle: string;
  color: string;
  isHovered: boolean;
  onHover: () => void;
  onHoverOut: () => void;
}> = ({ position, title, value, subtitle, color, isHovered, onHover, onHoverOut }) => {
  const cardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (cardRef.current && isHovered) {
      cardRef.current.scale.x = 1.05;
      cardRef.current.scale.y = 1.05;
      cardRef.current.position.z = position[2] + 0.1;
    } else if (cardRef.current) {
      cardRef.current.scale.x = 1;
      cardRef.current.scale.y = 1;
      cardRef.current.position.z = position[2];
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={cardRef}
        onPointerOver={onHover}
        onPointerOut={onHoverOut}
      >
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial
          color={isHovered ? color : '#1a1a2e'}
          emissive={color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Card Content */}
      <Text
        position={[0, 0.3, 0.06]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      <Text
        position={[0, -0.3, 0.06]}
        fontSize={0.1}
        color="#ccc"
        anchorX="center"
        anchorY="middle"
      >
        {subtitle}
      </Text>
    </group>
  );
};

// Nutrition Summary Component
const NutritionSummary: React.FC<{
  position: [number, number, number];
  nutritionData: any;
}> = ({ position, nutritionData }) => {
  return (
    <group position={position}>
      {/* Summary Background */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.6, 0.06]}
        fontSize={0.18}
        color="#4FC3F7"
        anchorX="center"
        anchorY="middle"
      >
        Nutrition Summary
      </Text>

      {/* Macro Nutrients */}
      <MacroBar
        position={[0, 0.2, 0.06]}
        label="Protein"
        value={nutritionData?.totalProtein || 0}
        target={50}
        color="#4CAF50"
      />

      <MacroBar
        position={[0, -0.1, 0.06]}
        label="Carbs"
        value={nutritionData?.totalCarbs || 0}
        target={250}
        color="#FF9800"
      />

      <MacroBar
        position={[0, -0.4, 0.06]}
        label="Fats"
        value={nutritionData?.totalFats || 0}
        target={65}
        color="#F44336"
      />
    </group>
  );
};

// Macro Bar Component
const MacroBar: React.FC<{
  position: [number, number, number];
  label: string;
  value: number;
  target: number;
  color: string;
}> = ({ position, label, value, target, color }) => {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <group position={position}>
      {/* Background Bar */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.5, 0.1]} />
        <meshBasicMaterial color="#333" />
      </mesh>

      {/* Progress Bar */}
      <mesh position={[-0.75 + (percentage / 100) * 0.75, 0, 0.01]}>
        <planeGeometry args={[(percentage / 100) * 1.5, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label */}
      <Text
        position={[-0.9, -0.15, 0.02]}
        fontSize={0.08}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {label}: {value}g
      </Text>

      {/* Percentage */}
      <Text
        position={[0.9, -0.15, 0.02]}
        fontSize={0.08}
        color={color}
        anchorX="right"
        anchorY="middle"
      >
        {percentage.toFixed(0)}%
      </Text>
    </group>
  );
};

// Energy Particle Component
const EnergyParticle: React.FC<{
  position: [number, number, number];
  delay: number;
}> = ({ position, delay }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime + delay;
      particleRef.current.position.y = position[1] + Math.sin(time * 3) * 0.1;
      particleRef.current.scale.setScalar(0.5 + Math.sin(time * 5) * 0.3);
    }
  });

  return (
    <mesh ref={particleRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial
        color="#00D4FF"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Control Panels Component
const ControlPanels: React.FC = () => {
  return (
    <group>
      {/* Left Control Panel */}
      <mesh position={[-3, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 2]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Right Control Panel */}
      <mesh position={[3, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 2]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};