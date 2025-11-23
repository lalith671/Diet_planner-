import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, Float, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

import { FoodPlanet } from '../components/FoodPlanet';
import { FoodConstellation } from '../components/FoodConstellation';
import { SearchField } from '../components/SearchField';
import { FilterPanel } from '../components/FilterPanel';
import { transformFoodToCelestialBody } from '../utils/foodToCelestialBody';

interface NutrientUniverseProps {
  foodDatabase: any;
  onNavigate: (scene: string) => void;
}

export const NutrientUniverse: React.FC<NutrientUniverseProps> = ({
  foodDatabase,
  onNavigate
}) => {
  const { camera } = useThree();
  const universeRef = useRef<THREE.Group>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'categories' | 'nutrients' | 'budget'>('categories');

  // Transform food database into celestial bodies
  const celestialBodies = useMemo(() => {
    if (!foodDatabase) return [];

    const bodies = [];
    Object.entries(foodDatabase).forEach(([category, foods]) => {
      (foods as any[]).forEach((food, index) => {
        bodies.push(transformFoodToCelestialBody(food, category, index));
      });
    });
    return bodies;
  }, [foodDatabase]);

  // Create constellations based on categories
  const constellations = useMemo(() => {
    if (!foodDatabase) return [];

    return Object.entries(foodDatabase).map(([category, foods]) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      foods: foods as any[],
      center: {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 20
      }
    }));
  }, [foodDatabase]);

  // Filter celestial bodies based on search and filters
  const filteredBodies = useMemo(() => {
    let filtered = celestialBodies;

    if (searchTerm) {
      filtered = filtered.filter(body =>
        body.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter(body =>
        activeFilters.includes(body.category) ||
        activeFilters.includes(body.dominantNutrient)
      );
    }

    return filtered;
  }, [celestialBodies, searchTerm, activeFilters]);

  useFrame((state) => {
    if (universeRef.current) {
      // Subtle rotation of the entire universe
      universeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }

    // Camera positioning based on view mode
    if (viewMode === 'categories') {
      camera.position.lerp(
        new THREE.Vector3(0, 10, 30),
        0.02
      );
    } else if (viewMode === 'nutrients') {
      camera.position.lerp(
        new THREE.Vector3(15, 15, 15),
        0.02
      );
    }
  });

  return (
    <group ref={universeRef}>
      {/* Background Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Cosmic Environment */}
      <CosmicEnvironment />

      {/* Food Constellations */}
      {constellations.map(constellation => (
        <FoodConstellation
          key={constellation.id}
          constellation={constellation}
          bodies={filteredBodies.filter(body => body.category === constellation.id)}
          isSelected={activeFilters.includes(constellation.id)}
          onSelect={() => {
            setActiveFilters(prev =>
              prev.includes(constellation.id)
                ? prev.filter(f => f !== constellation.id)
                : [...prev, constellation.id]
            );
          }}
        />
      ))}

      {/* Food Planets */}
      {filteredBodies.map((body, index) => (
        <FoodPlanet
          key={`${body.id}-${index}`}
          celestialBody={body}
          position={[body.position.x, body.position.y, body.position.z]}
          isSelected={selectedPlanet?.id === body.id}
          isHovered={hoveredPlanet === body.id}
          onSelect={() => setSelectedPlanet(body)}
          onHover={() => setHoveredPlanet(body.id)}
          onHoverOut={() => setHoveredPlanet(null)}
          onAnalyze={() => {
            setSelectedPlanet(body);
            onNavigate('holographic-analyzer');
          }}
        />
      ))}

      {/* Central Sun (Nutrient Universe Core) */}
      <NutrientUniverseCore />

      {/* UI Elements */}
      <SearchField
        position={[-8, 5, -5]}
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <FilterPanel
        position={[8, 5, -5]}
        filters={[
          { id: 'breakfast', label: 'Breakfast', color: '#FF9800' },
          { id: 'lunch', label: 'Lunch', color: '#4CAF50' },
          { id: 'dinner', label: 'Dinner', color: '#2196F3' },
          { id: 'snack', label: 'Snacks', color: '#9C27B0' },
          { id: 'drink', label: 'Drinks', color: '#00BCD4' },
          { id: 'protein', label: 'High Protein', color: '#F44336' },
          { id: 'carbs', label: 'High Carbs', color: '#FFC107' },
          { id: 'fats', label: 'High Fats', color: '#795548' }
        ]}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      {/* View Mode Controls */}
      <ViewModeControls
        position={[0, -8, 0]}
        currentMode={viewMode}
        onModeChange={setViewMode}
      />

      {/* Selected Planet Information */}
      {selectedPlanet && (
        <PlanetInfoPanel
          planet={selectedPlanet}
          position={[0, 3, -8]}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {/* Navigation Portal Back to AI Lab */}
      <NavigationPortal
        position={[0, 0, 15]}
        label="Return to AI Lab"
        onClick={() => onNavigate('ai-lab')}
      />

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI}
      />
    </group>
  );
};

// Cosmic Environment Component
const CosmicEnvironment: React.FC = () => {
  return (
    <group>
      {/* Nebula Effects */}
      <mesh position={[0, 0, -50]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial
          color="#1a0033"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cosmic Particles */}
      {[...Array(100)].map((_, i) => (
        <CosmicParticle
          key={i}
          position={[
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
          ]}
          size={Math.random() * 0.5 + 0.1}
          color={['#FF9800', '#4CAF50', '#2196F3', '#9C27B0'][Math.floor(Math.random() * 4)]}
        />
      ))}
    </group>
  );
};

// Nutrient Universe Core
const NutrientUniverseCore: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const time = state.clock.elapsedTime;
      coreRef.current.scale.setScalar(2 + Math.sin(time * 2) * 0.1);
      coreRef.current.rotation.x = time * 0.3;
      coreRef.current.rotation.z = time * 0.2;
    }
  });

  return (
    <group>
      {/* Main Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Energy Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5 + i * 0.5, 0.1, 16, 100]} />
          <meshStandardMaterial
            color={['#FF9800', '#4CAF50', '#2196F3'][i]}
            emissive={['#FF9800', '#4CAF50', '#2196F3'][i]}
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Core Label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Nutrient Universe
      </Text>
    </group>
  );
};

// Cosmic Particle Component
const CosmicParticle: React.FC<{
  position: [number, number, number];
  size: number;
  color: string;
}> = ({ position, size, color }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime;
      particleRef.current.position.y = position[1] + Math.sin(time + position[0]) * 2;
      particleRef.current.rotation.x = time * 0.5;
      particleRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <mesh ref={particleRef} position={position}>
      <octahedronGeometry args={[size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// View Mode Controls Component
const ViewModeControls: React.FC<{
  position: [number, number, number];
  currentMode: 'categories' | 'nutrients' | 'budget';
  onModeChange: (mode: 'categories' | 'nutrients' | 'budget') => void;
}> = ({ position, currentMode, onModeChange }) => {
  const modes = [
    { id: 'categories', label: 'Categories', icon: '🍽️' },
    { id: 'nutrients', label: 'Nutrients', icon: '🧬' },
    { id: 'budget', label: 'Budget', icon: '💰' }
  ];

  return (
    <group position={position}>
      {modes.map((mode, index) => {
        const xPos = (index - 1) * 3;
        return (
          <mesh
            key={mode.id}
            position={[xPos, 0, 0]}
            onClick={() => onModeChange(mode.id as any)}
          >
            <boxGeometry args={[2, 0.8, 0.2]} />
            <meshStandardMaterial
              color={currentMode === mode.id ? '#4CAF50' : '#1a1a2e'}
              emissive={currentMode === mode.id ? '#4CAF50' : '#333'}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Labels */}
      {modes.map((mode, index) => {
        const xPos = (index - 1) * 3;
        return (
          <Text
            key={`text-${mode.id}`}
            position={[xPos, -0.6, 0.1]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {mode.icon} {mode.label}
          </Text>
        );
      })}
    </group>
  );
};

// Navigation Portal Component
const NavigationPortal: React.FC<{
  position: [number, number, number];
  label: string;
  onClick: () => void;
}> = ({ position, label, onClick }) => {
  const portalRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={portalRef} position={position}>
      {/* Portal Ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.2, 16, 100]} />
        <meshStandardMaterial
          color="#9C27B0"
          emissive="#9C27B0"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Portal Energy */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color="#9C27B0"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Click Handler */}
      <mesh
        rotation={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => (e.object.scale.setScalar(1.1))}
        onPointerOut={(e) => (e.object.scale.setScalar(1))}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Portal Label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

// Planet Info Panel Component
const PlanetInfoPanel: React.FC<{
  planet: any;
  position: [number, number, number];
  onClose: () => void;
}> = ({ planet, position, onClose }) => {
  return (
    <group position={position}>
      {/* Panel Background */}
      <mesh>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Planet Name */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.3}
        color={planet.color}
        anchorX="center"
        anchorY="middle"
      >
        {planet.name}
      </Text>

      {/* Nutrition Info */}
      <Text
        position={[0, 0.5, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Calories: {planet.calories} | Protein: {planet.protein}g
      </Text>

      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Carbs: {planet.carbs}g | Fats: {planet.fats}g | Fiber: {planet.fiber}g
      </Text>

      <Text
        position={[0, -0.1, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Price: ₹{planet.price} | Type: {planet.type}
      </Text>

      {/* Close Button */}
      <mesh position={[0, -1.5, 0.1]} onClick={onClose}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="#F44336" />
      </mesh>

      <Text
        position={[0, -1.5, 0.2]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Close
      </Text>
    </group>
  );
};