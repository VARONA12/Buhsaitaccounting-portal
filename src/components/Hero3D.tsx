"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        <meshPhysicalMaterial
          color="#FFC107"
          roughness={isLight ? 0.4 : 0.2}
          metalness={isLight ? 0.6 : 0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={isLight ? "#000000" : "#332200"}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-[300px] md:h-[500px] relative pointer-events-none md:pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={isLight ? 1 : 0.5} />
        <directionalLight position={[10, 10, 5]} intensity={isLight ? 2 : 1.5} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={1} color="#FFC107" />
        <pointLight position={[0, -10, 0]} intensity={isLight ? 0.5 : 1} color="#FFC107" />
        <AnimatedShape />
      </Canvas>
    </div>
  );
}
