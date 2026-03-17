"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";

function Pencil({ progress }: { progress: number }) {
  const pencilRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!pencilRef.current) return;
    
    // Pencil movement: moves from right to left while writing
    // Progress 0-1 matches writing (crossing out)
    // We'll map progress to position and rotation
    const baseRotationX = -Math.PI / 4;
    const baseRotationZ = Math.PI / 8;
    
    pencilRef.current.position.x = -1.5 + progress * 3;
    pencilRef.current.position.y = 0.5 + Math.sin(progress * 20) * 0.05;
    pencilRef.current.rotation.z = baseRotationZ + Math.sin(progress * 10) * 0.1;
    pencilRef.current.rotation.x = baseRotationX;
  });

  return (
    <group ref={pencilRef}>
      {/* Pencil Body */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshPhysicalMaterial color="#FFC107" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Pencil Tip (Wood part) */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshPhysicalMaterial color="#e0c090" />
      </mesh>
      {/* Lead */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.02, 0.05, 8]} />
        <meshPhysicalMaterial color="#333333" />
      </mesh>
      {/* Eraser holder (Metal part) */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.2, 8]} />
        <meshPhysicalMaterial color="#silver" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Eraser */}
      <mesh position={[0, 2.65, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 8]} />
        <meshPhysicalMaterial color="#ff9999" />
      </mesh>
    </group>
  );
}

function Paper({ progress }: { progress: number }) {
  // Line progress for "crossing out" or "writing"
  // We'll create multiple lines that appear based on progress
  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.5, 0]}>
      {/* Paper Sheet */}
      <mesh>
        <boxGeometry args={[4, 5, 0.02]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Text Lines */}
      <group position={[-1.5, 1.5, 0.02]}>
        <Text fontSize={0.2} color="#cccccc" anchorX="left">Бюджет: 1 000 000 ₽</Text>
        <Text fontSize={0.2} color="#cccccc" position={[0, -0.4, 0]} anchorX="left">Налоги в старой системе</Text>
        <Text fontSize={0.2} color="#cccccc" position={[0, -0.8, 0]} anchorX="left">Рутинные задачи</Text>
        <Text fontSize={0.2} color="#cccccc" position={[0, -1.2, 0]} anchorX="left">Риски и штрафы</Text>
      </group>

      {/* Crossing Out Lines (Yellow) */}
      <group position={[-1.6, 1.5, 0.03]}>
        {/* Progress 0 to 1 maps to these lines appearing */}
        <mesh position={[progress * 1.5, 0, 0]} scale={[progress * 3, 0.04, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#FFC107" />
        </mesh>
        {progress > 0.3 && (
            <mesh position={[(progress-0.3) * 1.5, -0.4, 0]} scale={[(progress-0.3) * 3, 0.04, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color="#FFC107" />
            </mesh>
        )}
        {progress > 0.6 && (
            <mesh position={[(progress-0.6) * 1.5, -0.8, 0]} scale={[(progress-0.6) * 3, 0.04, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color="#FFC107" />
            </mesh>
        )}
      </group>
    </group>
  );
}

export function ScribbleScene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor global scroll
  useFrame(() => {
    // We calculate progress based on window scroll
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const maxScroll = typeof window !== 'undefined' ? (document.documentElement.scrollHeight - window.innerHeight) : 1000;
    // We want the most action in the first part of scroll
    const progress = Math.min(scrollY / 800, 1);
    setScrollProgress(progress);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#FFC107" />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group rotation={[0, -Math.PI / 10, 0]}>
          <Paper progress={scrollProgress} />
          <Pencil progress={scrollProgress} />
        </group>
      </Float>
    </>
  );
}
