'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingProductProps {
  position?: [number, number, number];
  color?: string;
  type?: 'box' | 'sphere' | 'cylinder' | 'ring';
  scale?: number;
  rotationSpeed?: number;
}

export function FloatingProduct({
  position = [0, 0, 0],
  color = '#3b82f6',
  type = 'box',
  scale = 1,
  rotationSpeed = 0.5,
}: FloatingProductProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.5;
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      position={position}
    >
      <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
        {type === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        {type === 'sphere' && <sphereGeometry args={[0.9, 32, 32]} />}
        {type === 'cylinder' && <cylinderGeometry args={[0.7, 0.7, 1.4, 32]} />}
        {type === 'ring' && <torusGeometry args={[0.9, 0.25, 16, 64]} />}

        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.7}
          wireframe={type === 'ring'}
        />
      </mesh>
    </Float>
  );
}
