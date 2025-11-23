import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder, Float, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

import { AIAvatar } from '../components/AIAvatar';
import { NutrientDisplay } from '../components/NutrientDisplay';
import { HolographicTable } from '../components/HolographicTable';

interface AINutritionistLabProps {
  nutritionData: any;
  userData: any;
  onNavigate: (scene: string) => void;
}

export const AINutritionistLab: React.FC<AINutritionistLabProps> = ({
  nutritionData,
  userData,
  onNavigate
}) => {
  const [avatarMessage, setAvatarMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const labRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Welcome message based on user data
    if (userData?.goal) {
      const goalMessages = {
        lose: "I'll help you create a sustainable weight loss plan that preserves muscle mass.",
        maintain: "Let's optimize your nutrition for peak performance and health maintenance.",
        gain: "I'll design a healthy weight gain plan focused on lean muscle development."
      };
      setAvatarMessage(goalMessages[userData.goal] || "Welcome to your personal nutrition lab!");
    } else {
      setAvatarMessage("Hello! I'm your AI nutritionist. Let's create your perfect meal plan!");
    }
  }, [userData]);

  useFrame((state) => {
    if (labRef.current) {
      // Subtle floating animation for the entire lab
      labRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={labRef}>
      {/* Lab Environment */}
      <LabEnvironment />

      {/* AI Nutritionist Avatar */}
      <AIAvatar
        position={[0, 1, 0]}
        message={avatarMessage}
        isAnalyzing={isAnalyzing}
        onAnalysisComplete={(results) => {
          setIsAnalyzing(false);
          setAvatarMessage("Perfect! I've analyzed your requirements. Let me show you your personalized recommendations.");
        }}
      />

      {/* Holographic Display Table */}
      <HolographicTable
        position={[0, 0, 0]}
        userData={userData}
        nutritionData={nutritionData}
      />

      {/* Navigation Portals */}
      <NavigationPortals onNavigate={onNavigate} />

      {/* Floating Nutrient Displays */}
      <NutrientDisplay
        position={[-3, 2, -2]}
        nutrient="protein"
        value={nutritionData?.totalProtein || 0}
        target={userData?.goal === 'gain' ? 60 : 50}
      />
      <NutrientDisplay
        position={[3, 2, -2]}
        nutrient="carbs"
        value={nutritionData?.totalCarbs || 0}
        target={250}
      />
      <NutrientDisplay
        position={[0, 3, -3]}
        nutrient="calories"
        value={nutritionData?.totalCalories || 0}
        target={nutritionData?.targetCalories || 2000}
      />

      {/* Interactive Analysis Panel */}
      <AnalysisPanel
        position={[0, 1.5, 3]}
        userData={userData}
        onAnalyze={() => {
          setIsAnalyzing(true);
          setAvatarMessage("Analyzing your nutritional needs and creating personalized recommendations...");
        }}
      />
    </group>
  );
};

// Lab Environment Component
const LabEnvironment: React.FC = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial
          color="#16213e"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Side Walls */}
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial
          color="#16213e"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial
          color="#16213e"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Lighting Panels */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={x} position={[x, 5.5, -4.9]}>
          <planeGeometry args={[2, 1]} />
          <meshBasicMaterial color="#00d4ff" intensity={0.5} />
        </mesh>
      ))}

      {/* futuristic glowing lines */}
      {[-6, 0, 6].map((z) => (
        <mesh key={z} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 0.1]} />
          <meshBasicMaterial color="#00ff88" opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  );
};

// Navigation Portals Component
const NavigationPortals: React.FC<{ onNavigate: (scene: string) => void }> = ({ onNavigate }) => {
  const portals = [
    { position: [-8, 1.5, -4], color: '#9C27B0', scene: 'nutrient-universe', label: 'Nutrient Universe' },
    { position: [0, 1.5, -4], color: '#00BCD4', scene: 'holographic-analyzer', label: 'Food Analyzer' },
    { position: [8, 1.5, -4], color: '#FF5722', scene: 'body-lab', label: 'Body Lab' },
    { position: [0, 1.5, 4], color: '#FFD700', scene: 'budget-universe', label: 'Budget Tracker' }
  ];

  return (
    <>
      {portals.map((portal) => (
        <group key={portal.scene} position={portal.position}>
          {/* Portal Ring */}
          <Torus args={[1, 0.1, 16, 100]}>
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </Torus>

          {/* Portal Energy */}
          <Plane args={[1.8, 1.8]} rotation={[0, 0, 0]}>
            <meshBasicMaterial
              color={portal.color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </Plane>

          {/* Portal Label */}
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {portal.label}
          </Text>

          {/* Click Handler */}
          <mesh
            position={[0, 0, 0]}
            onClick={() => onNavigate(portal.scene)}
            onPointerOver={(e) => (e.object.scale.setScalar(1.1))}
            onPointerOut={(e) => (e.object.scale.setScalar(1))}
          >
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      ))}
    </>
  );
};

// Analysis Panel Component
const AnalysisPanel: React.FC<{
  position: [number, number, number];
  userData: any;
  onAnalyze: () => void;
}> = ({ position, userData, onAnalyze }) => {
  return (
    <group position={position}>
      {/* Panel Background */}
      <Box args={[4, 2, 0.1]}>
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.6}
          roughness={0.4}
        />
      </Box>

      {/* Analysis Button */}
      <mesh position={[0, 0, 0.1]} onClick={onAnalyze}>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} />
      </mesh>

      {/* Button Text */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Start Analysis
      </Text>
    </group>
  );
};

// Helper components for 3D primitives
const Torus: React.FC<any> = (props) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  return <mesh ref={ref} {...props}><torusGeometry {...props.args} /><meshStandardMaterial {...props} /></mesh>;
};

const Plane: React.FC<any> = (props) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  return <mesh ref={ref} {...props}><planeGeometry {...props.args} /><meshBasicMaterial {...props} /></mesh>;
};