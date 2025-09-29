import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

const Planet = ({ size, distance, speed, color }) => {
  const planetRef = useRef()
  const orbitRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const x = distance * Math.cos(t * speed)
    const z = distance * Math.sin(t * speed)
    planetRef.current.position.set(x, 0, z)
    orbitRef.current.rotation.y = t * speed
  })

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>

      
      <mesh rotation={[Math.PI / 2, 0, 0]} ref={orbitRef}>
        <ringGeometry args={[distance - 0.01, distance + 0.01, 64]} />
        <meshBasicMaterial color="#444" side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

const SolarSystemScene = () => {
  return (
    <>
      
      <mesh>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={2} />
      </mesh>

      {/* Planets = data points */}
      <Planet size={0.15} distance={1.5} speed={0.5} color="#4fc3f7" />
      <Planet size={0.2} distance={2.5} speed={0.3} color="#ba68c8" />
      <Planet size={0.12} distance={3.5} speed={0.7} color="#81c784" />
      <Planet size={0.18} distance={4.5} speed={0.2} color="#f06292" />
    </>
  )
}

export default function DataSolarSystem() {
  return (
    <Canvas style={{ height: '350px', width: '100%' }} camera={{ position: [0, 3, 6], fov: 60 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      <Stars radius={20} depth={50} count={1000} factor={2} fade />
      <SolarSystemScene />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  )
}
