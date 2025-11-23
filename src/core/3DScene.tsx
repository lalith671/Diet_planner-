import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Effects, Environment, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, GodRays, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

import { AINutritionistLab } from '../scenes/AINutritionistLab';
import { NutrientUniverse } from '../scenes/NutrientUniverse';
import { HolographicAnalyzer } from '../scenes/HolographicAnalyzer';
import { VirtualBodyLab } from '../scenes/VirtualBodyLab';
import { BudgetUniverse } from '../scenes/BudgetUniverse';
import { SceneTransitions } from './SceneTransitions';
import { LoadingScreen } from '../components/LoadingScreen';
import { PerformanceManager } from '../utils/PerformanceManager';

export type SceneType = 'ai-lab' | 'nutrient-universe' | 'holographic-analyzer' | 'body-lab' | 'budget-universe';

interface Scene3DProps {
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
  nutritionData: any;
  userData: any;
  className?: string;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  currentScene,
  onSceneChange,
  nutritionData,
  userData,
  className = ''
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{
          position: [0, 5, 10],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: performanceLevel !== 'low',
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          // Performance optimization based on device capabilities
          const performanceManager = new PerformanceManager();
          const detectedLevel = performanceManager.detectPerformanceLevel();
          setPerformanceLevel(detectedLevel);

          if (detectedLevel === 'low') {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
          }
        }}
      >
        <Suspense fallback={<LoadingScreen />}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={performanceLevel === 'high' ? 2048 : 1024}
            shadow-mapSize-height={performanceLevel === 'high' ? 2048 : 1024}
          />

          {/* Environment and Sky */}
          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.6}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={0.5}
            turbidity={10}
          />

          {/* Post-processing Effects (only on high/medium performance) */}
          {(performanceLevel === 'high' || performanceLevel === 'medium') && (
            <Effects>
              <EffectComposer>
                <Bloom
                  intensity={performanceLevel === 'high' ? 1.5 : 0.8}
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
                {performanceLevel === 'high' && (
                  <DepthOfField
                    focusDistance={0}
                    focalLength={0.02}
                    bokehScale={2}
                    height={480}
                  />
                )}
              </EffectComposer>
            </Effects>
          )}

          {/* Scene Content */}
          <SceneTransitions
            currentScene={currentScene}
            isTransitioning={isTransitioning}
            performanceLevel={performanceLevel}
          >
            {currentScene === 'ai-lab' && (
              <AINutritionistLab
                nutritionData={nutritionData}
                userData={userData}
                onNavigate={onSceneChange}
              />
            )}
            {currentScene === 'nutrient-universe' && (
              <NutrientUniverse
                foodDatabase={nutritionData?.foodDatabase}
                onNavigate={onSceneChange}
              />
            )}
            {currentScene === 'holographic-analyzer' && (
              <HolographicAnalyzer
                selectedFood={nutritionData?.selectedFood}
                onNavigate={onSceneChange}
              />
            )}
            {currentScene === 'body-lab' && (
              <VirtualBodyLab
                userData={userData}
                nutritionPlan={nutritionData?.mealPlan}
                onNavigate={onSceneChange}
              />
            )}
            {currentScene === 'budget-universe' && (
              <BudgetUniverse
                budgetData={nutritionData?.budgetData}
                mealPlan={nutritionData?.mealPlan}
                onNavigate={onSceneChange}
              />
            )}
          </SceneTransitions>

          {/* Environment particles for atmosphere */}
          {performanceLevel === 'high' && (
            <Environment preset="city" background blur={0.5} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};