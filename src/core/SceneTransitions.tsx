import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface SceneTransitionsProps {
  currentScene: string;
  isTransitioning: boolean;
  performanceLevel: 'high' | 'medium' | 'low';
  children: React.ReactNode;
}

export const SceneTransitions: React.FC<SceneTransitionsProps> = ({
  currentScene,
  isTransitioning,
  performanceLevel,
  children
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<THREE.Points | null>(null);

  // Portal effect particles
  React.useEffect(() => {
    if (performanceLevel === 'low') return;

    const particleCount = performanceLevel === 'high' ? 1000 : 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      colors[i3] = 0.5 + Math.random() * 0.5;
      colors[i3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    setParticles(points);

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [performanceLevel]);

  useFrame((state) => {
    if (particles && isTransitioning) {
      particles.rotation.y = state.clock.elapsedTime * 0.5;
      particles.rotation.x = state.clock.elapsedTime * 0.3;

      // Animate particle opacity
      const material = particles.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Portal particles during transition */}
      {isTransitioning && particles && (
        <primitive object={particles} />
      )}

      {/* Main scene content with transition animations */}
      <motion.group
        animate={{
          scale: isTransitioning ? [1, 0.8, 1] : 1,
          rotationY: isTransitioning ? [0, Math.PI * 2] : 0,
          opacity: isTransitioning ? [1, 0.5, 1] : 1
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.group>

      {/* Scene-specific lighting adjustments */}
      {currentScene === 'ai-lab' && (
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#4FC3F7" />
      )}
      {currentScene === 'nutrient-universe' && (
        <spotLight
          position={[10, 20, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#9C27B0"
          castShadow
        />
      )}
      {currentScene === 'holographic-analyzer' && (
        <rectAreaLight
          position={[0, 5, -5]}
          width={20}
          height={20}
          intensity={2}
          color="#00BCD4"
        />
      )}
      {currentScene === 'body-lab' && (
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.7}
          color="#FF5722"
          castShadow
        />
      )}
      {currentScene === 'budget-universe' && (
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFD700" />
      )}
    </group>
  );
};