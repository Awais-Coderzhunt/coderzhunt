"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Laptop() {
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
      <group rotation={[-0.08, 0.35, 0]}>
        <RoundedBox
          args={[3, 0.12, 2]}
          radius={0.04}
          position={[0, -0.55, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.4} />
        </RoundedBox>

        <group position={[0, 0.05, -0.95]} rotation={[-0.34, 0, 0]}>
          <RoundedBox
            args={[3, 1.85, 0.08]}
            radius={0.04}
            position={[0, 0.92, 0]}
          >
            <meshStandardMaterial color="#1f1f1f" metalness={0.3} roughness={0.35} />
          </RoundedBox>

          <mesh position={[0, 0.92, 0.05]}>
            <planeGeometry args={[2.8, 1.65]} />
            <meshStandardMaterial
              color="#fff7f0"
              emissive="#ff6b1a"
              emissiveIntensity={0.18}
            />
          </mesh>

          {Array.from({ length: 7 }).map((_, i) => {
            const widths = [0.9, 1.4, 0.6, 1.1, 0.8, 1.3, 0.7];
            const isAccent = i % 3 === 0;
            return (
              <mesh
                key={i}
                position={[-0.6 + (i % 2) * 0.2, 1.6 - i * 0.16, 0.06]}
              >
                <planeGeometry args={[widths[i], 0.045]} />
                <meshBasicMaterial color={isAccent ? "#ff6b1a" : "#9a9a9a"} />
              </mesh>
            );
          })}
        </group>
      </group>
    </Float>
  );
}

function FloatingPanel({
  position,
  rotation,
  color,
  emissive = 0.12,
  size = [1.1, 0.75] as [number, number],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  emissive?: number;
  size?: [number, number];
}) {
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.9}>
      <RoundedBox
        args={[size[0], size[1], 0.06]}
        radius={0.05}
        position={position}
        rotation={rotation}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive}
          metalness={0.15}
          roughness={0.4}
        />
      </RoundedBox>
    </Float>
  );
}

function Particle({
  position,
  color,
  size = 0.06,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  return (
    <Float speed={2.2} floatIntensity={2.5} rotationIntensity={0.4}>
      <mesh position={position}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const targetY = state.mouse.x * 0.28;
    const targetX = -state.mouse.y * 0.18;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05;
  });

  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 6, 5]} intensity={1.1} />
        <pointLight
          position={[-3, 2.5, 3]}
          color="#ff6b1a"
          intensity={4}
          distance={12}
        />
        <pointLight
          position={[4, -2, 2]}
          color="#ffa366"
          intensity={2.2}
          distance={12}
        />

        <ParallaxRig>
          <Laptop />

          <FloatingPanel
            position={[-2.7, 1.4, 1]}
            rotation={[0.1, 0.25, 0.08]}
            color="#ff6b1a"
            emissive={0.25}
          />
          <FloatingPanel
            position={[2.7, -0.6, 1.3]}
            rotation={[-0.1, -0.22, -0.05]}
            color="#ffffff"
            emissive={0.05}
          />
          <FloatingPanel
            position={[2.9, 1.5, 0.4]}
            rotation={[0.15, -0.32, 0.1]}
            color="#ffa366"
            emissive={0.2}
            size={[0.9, 0.6]}
          />

          <Particle position={[-3.4, -1.6, 1]} color="#ff6b1a" />
          <Particle position={[3.5, 0.9, 0.4]} color="#ff6b1a" size={0.05} />
          <Particle position={[-2.4, 2.1, 0.2]} color="#ffa366" size={0.05} />
          <Particle position={[2.9, -2, 1.5]} color="#ff6b1a" size={0.07} />
          <Particle position={[0, 2.4, 1]} color="#ffa366" size={0.045} />
        </ParallaxRig>
      </Suspense>
    </Canvas>
  );
}
