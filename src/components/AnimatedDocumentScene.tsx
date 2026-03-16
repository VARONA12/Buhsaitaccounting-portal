"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

export default function AnimatedDocumentScene() {
  const documentGroup = useRef<THREE.Group>(null);
  const coinRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (documentGroup.current) {
      documentGroup.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      documentGroup.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.02;
      coinRef.current.rotation.z += 0.01;
    }
  });

  return (
    <PresentationControls
      global
      snap
      rotation={[0, -0.2, 0]}
      polar={[-0.2, 0.2]}
      azimuth={[-0.5, 0.5]}
    >
      <group ref={documentGroup}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          {/* Main Document Box */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 3.5, 0.2]} />
            <meshPhysicalMaterial 
              color="#FFC107" 
              transparent 
              opacity={0.3} 
              roughness={0.1} 
              transmission={0.9} 
              thickness={0.5} 
              emissive="#FFC107"
              emissiveIntensity={0.2}
            />
            {/* Lines on Document */}
            <mesh position={[0, 1, 0.12]}>
              <boxGeometry args={[1.5, 0.1, 0.02]} />
              <meshBasicMaterial color="#e5ff00" />
            </mesh>
            <mesh position={[0, 0.6, 0.12]}>
              <boxGeometry args={[1.8, 0.1, 0.02]} />
              <meshBasicMaterial color="#e5ff00" />
            </mesh>
            <mesh position={[0, 0.2, 0.12]}>
              <boxGeometry args={[1.6, 0.1, 0.02]} />
              <meshBasicMaterial color="#e5ff00" />
            </mesh>
            <mesh position={[0, -0.2, 0.12]}>
              <boxGeometry args={[1.4, 0.1, 0.02]} />
              <meshBasicMaterial color="#e5ff00" />
            </mesh>
          </mesh>
        </Float>
      </group>

      {/* Coin Element */}
      <group position={[1.2, -1, 0.5]}>
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <mesh ref={coinRef} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
            <meshPhysicalMaterial 
              color="#FFC107" 
              metalness={0.8} 
              roughness={0.2} 
              emissive="#FFC107"
              emissiveIntensity={0.4}
            />
            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.3, 32]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </mesh>
        </Float>
      </group>

      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.05 + 0.01, 8, 8]} />
          <meshBasicMaterial color="#FFC107" transparent opacity={0.6} />
        </mesh>
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#FFC107" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#ffffff" />
    </PresentationControls>
  );
}
