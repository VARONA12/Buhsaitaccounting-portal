"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Global state for external control (from page.tsx)
export const pencilState = {
  x: 0,
  y: 0,
  isActive: false,
  isWriting: false,
  update: (x: number, y: number, isActive: boolean, isWriting: boolean) => {
    pencilState.x = x;
    pencilState.y = y;
    pencilState.isActive = isActive;
    pencilState.isWriting = isWriting;
  }
};

function PencilMesh() {
  const { viewport, size } = useThree();
  const meshRef = useRef<THREE.Group>(null);
  
  // Base rotation for natural look
  const baseRotationX = -Math.PI / 3;
  const baseRotationZ = Math.PI / 10;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Convert screen px (pencilState.x, y) to Viewport coordinates
    // screen x/y [0, size.width/height] -> viewport x/y [-vw/half, vw/half]
    const targetX = (pencilState.x / size.width) * viewport.width - viewport.width / 2;
    const targetY = -(pencilState.y / size.height) * viewport.height + viewport.height / 2;

    // Smooth movement
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.2);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.2);
    
    // Visibility
    meshRef.current.visible = pencilState.isActive;

    // Writing wiggle/rotation
    if (pencilState.isWriting) {
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, baseRotationZ + Math.sin(state.clock.elapsedTime * 20) * 0.1, 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotationX + 0.2, 0.1);
        meshRef.current.position.z = 0.5; // Slightly closer to "page"
    } else {
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, baseRotationZ, 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotationX, 0.1);
        meshRef.current.position.z = 1; // Hovering
    }
  });

  return (
    <group ref={meshRef}>
      {/* Pencil Body */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 6]} />
        <meshPhysicalMaterial color="#FFC107" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Wood Tip */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshPhysicalMaterial color="#e0c090" />
      </mesh>
      {/* Lead */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.015, 0.05, 6]} />
        <meshPhysicalMaterial color="#222222" />
      </mesh>
      {/* Metal part */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.2, 8]} />
        <meshPhysicalMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Eraser */}
      <mesh position={[0, 2.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshPhysicalMaterial color="#ffaaaa" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      <Canvas 
        orthographic 
        camera={{ zoom: 100, position: [0, 0, 10] }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -10]} intensity={1} color="#FFC107" />
        <PencilMesh />
      </Canvas>
    </div>
  );
}
