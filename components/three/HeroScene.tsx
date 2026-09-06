'use client';

import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { FloatingProduct } from './FloatingProduct';
import { DataSphere } from './DataSphere';

export function HeroSceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={50} />
      
      {/* Lighting Setup */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, -2, -2]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[5, 3, 2]} intensity={1.2} color="#10b981" />

      {/* Floating 3D Retail & Data Mesh Objects */}
      <group position={[0, 0, 0]}>
        {/* Central Data Analytics Sphere */}
        <DataSphere position={[0, 0.2, 0]} scale={1.1} />

        {/* Floating Product Package Cubes */}
        <FloatingProduct
          position={[-2.2, 1.2, -0.5]}
          color="#3b82f6"
          type="box"
          scale={0.8}
          rotationSpeed={0.7}
        />
        <FloatingProduct
          position={[2.3, 0.8, -0.8]}
          color="#10b981"
          type="cylinder"
          scale={0.75}
          rotationSpeed={0.5}
        />
        <FloatingProduct
          position={[-1.8, -1.2, 0.5]}
          color="#8b5cf6"
          type="ring"
          scale={0.9}
          rotationSpeed={0.4}
        />
        <FloatingProduct
          position={[2.0, -1.1, 0.3]}
          color="#f59e0b"
          type="sphere"
          scale={0.65}
          rotationSpeed={0.8}
        />
      </group>

      {/* Interactive Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}
