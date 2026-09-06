'use client';

import React from 'react';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { FloatingProduct } from './FloatingProduct';

export function RetailSceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 3, 5]} fov={50} />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={1} color="#0284c7" />

      {/* Retail Store Shelves & Podiums */}
      <group position={[0, -0.5, 0]}>
        {/* Floor Grid */}
        <Grid
          args={[20, 20]}
          cellSize={0.8}
          cellThickness={1}
          cellColor="#374151"
          sectionSize={3.2}
          sectionThickness={1.5}
          sectionColor="#3b82f6"
          fadeDistance={25}
          fadeStrength={1}
        />

        {/* Central Display Stand */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.8, 32]} />
          <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Display Stand Top Light Ring */}
        <mesh position={[0, 0.81, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#3b82f6" side={2} />
        </mesh>

        {/* Store Shelf Displays */}
        <FloatingProduct position={[0, 1.6, 0]} color="#3b82f6" type="box" scale={0.7} />
        <FloatingProduct position={[-1.2, 1.3, 0.5]} color="#10b981" type="sphere" scale={0.5} />
        <FloatingProduct position={[1.2, 1.3, -0.5]} color="#8b5cf6" type="cylinder" scale={0.5} />
      </group>

      <OrbitControls
        enableZoom={true}
        maxDistance={12}
        minDistance={3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}
