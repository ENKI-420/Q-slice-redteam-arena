"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sparkles, MeshTransmissionMaterial } from "@react-three/drei"
import type * as THREE from "three"

function DNAHelix(props: any) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={group} {...props}>
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={i} position={[0, (i - 10) * 0.4, 0]} rotation={[0, i * 0.5, 0]}>
          <mesh position={[1, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-1, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
            <meshStandardMaterial color="white" opacity={0.3} transparent />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function QSliceOrb(props: any) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <mesh ref={mesh} {...props}>
      <torusKnotGeometry args={[1.8, 0.5, 128, 32]} />
      <MeshTransmissionMaterial
        backside
        backsideThickness={5}
        thickness={2}
        chromaticAberration={1}
        anisotropy={1}
        distortion={1}
        distortionScale={1}
        temporalDistortion={0.2}
        color="#00f0ff"
      />
    </mesh>
  )
}

export function QuantumLogo3D() {
  return (
    <div className="w-full h-[400px] lg:h-[600px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8a2be2" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group>
            <QSliceOrb />
            <DNAHelix />
          </group>
        </Float>

        <Sparkles count={500} scale={10} size={2} speed={0.4} opacity={0.5} color="#00f0ff" />
      </Canvas>
    </div>
  )
}
