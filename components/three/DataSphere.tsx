'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function DataSphere({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.3;
      outerRef.current.rotation.z += delta * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5} position={position}>
      <group scale={scale}>
        {/* Outer Wireframe Sphere */}
        <mesh ref={outerRef}>
          <sphereGeometry args={[1.5, 24, 24]} />
          <meshBasicMaterial color="#0284c7" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>
    </Float>
  );
}
