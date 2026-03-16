"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

const AnimatedDocumentScene = dynamic(
  () => import("./AnimatedDocumentScene"),
  { ssr: false }
);

export default function AnimatedDocumentWrapper() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none sm:pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <AnimatedDocumentScene />
        </Suspense>
      </Canvas>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[120px] opacity-10 -z-10 animate-pulse transition-opacity duration-1000"></div>
    </div>
  );
}
