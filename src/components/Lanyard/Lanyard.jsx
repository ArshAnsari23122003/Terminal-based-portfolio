'use client';

import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text, Environment, Lightformer, ContactShadows, Float, Stars } from '@react-three/drei';
import { Physics, RigidBody, useRopeJoint, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard() {
  return (
    <div className="w-full h-screen bg-[#000000] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,#151515_0%,#000000_100%)]" />
      
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 25 }} 
        shadows 
        className="z-10"
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1500} castShadow />
        
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1.5} />

        <Physics gravity={[0, -35, 0]} interpolate>
          <InteractiveCard />
        </Physics>

        <Environment blur={0.8}>
          <Lightformer intensity={10} color="white" position={[0, 5, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="#00ff00" position={[-5, -1, -1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="#00ff00" position={[5, -1, -1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        </Environment>

        <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
      </Canvas>
    </div>
  );
}

function InteractiveCard() {
  const card = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), band = useRef();
  const [dragged, drag] = useState(false);
  const vec = new THREE.Vector3();
  
  const segmentProps = { 
    type: 'dynamic', 
    canSleep: false, 
    colliders: false, 
    angularDamping: 6, 
    linearDamping: 3 
  };

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]), []);

  // Secure Rope/Spherical Joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.1, 0]]);

  useFrame((state) => {
    // Parallax Effect: Camera reacts to mouse
    state.camera.position.lerp(vec.set(state.pointer.x * 2.5, state.pointer.y * 1.5, 12), 0.05);
    state.camera.lookAt(0, 0, 0);

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      const dir = vec.clone().sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      [card, j1, j2, j3].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ 
        x: vec.x - dragged.x, 
        y: vec.y - dragged.y, 
        z: vec.z - dragged.z 
      });
    }

    if (fixed.current && card.current && band.current) {
      const vel = card.current.linvel();
      const currentRot = card.current.rotation();
      
      // Aerodynamic stabilization
      card.current.setAngvel({ 
        x: (vel.y * 0.1), 
        y: (vel.x * 0.5) - (currentRot.y * 2.5), 
        z: -currentRot.z * 2.5 
      }, true);

      // Ribbon Animation
      band.current.material.dashOffset -= 0.005;
      curve.points[0].copy(fixed.current.translation());
      curve.points[1].copy(j1.current.translation());
      curve.points[2].copy(j2.current.translation());
      curve.points[3].copy(j3.current.translation());
      curve.points[4].copy(card.current.translation()).add(new THREE.Vector3(0, 0.9, 0));
      band.current.geometry.setPoints(curve.getPoints(40));
    }
  });

  // Feature: Flip the card on click
  const handleFlip = () => {
    if (card.current && !dragged) {
      card.current.applyImpulse({ x: 0, y: 0, z: 0 }, true);
      card.current.setAngvel({ x: 0, y: 40, z: 0 }, true); // Rapid Y-axis spin
    }
  };

  return (
    <>
      <RigidBody ref={fixed} type="fixed" position={[0, 4.5, 0]} />
      <RigidBody ref={j1} {...segmentProps} position={[0.5, 3.5, 0]}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody ref={j2} {...segmentProps} position={[1, 2.5, 0]}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody ref={j3} {...segmentProps} position={[1.5, 1.5, 0]}><BallCollider args={[0.1]} /></RigidBody>
      
      <RigidBody 
        ref={card} 
        {...segmentProps} 
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        onPointerDown={(e) => {
          if(card.current) {
            e.stopPropagation();
            drag(new THREE.Vector3().copy(e.point).sub(card.current.translation()));
          }
        }}
        onPointerUp={() => drag(false)}
        onClick={handleFlip} // Trigger Flip
        colliders={false}
      >
        <CuboidCollider args={[0.8, 1.2, 0.1]} />
        
        <group scale={0.65}>
          {/* Obsidian Glass Body */}
          <mesh castShadow>
            <boxGeometry args={[2.5, 3.8, 0.12]} />
            <meshPhysicalMaterial 
              color="#050505" 
              metalness={0.8} 
              roughness={0.05} 
              transmission={0.9} 
              thickness={1.5} 
              clearcoat={1}
              ior={1.6}
            />
          </mesh>

          {/* Neon Glimmer Frame */}
          <mesh>
            <boxGeometry args={[2.55, 3.85, 0.03]} />
            <meshBasicMaterial color="#00ff00" wireframe />
          </mesh>

          {/* Front Content */}
          <group position={[0, 0, 0.08]}>
             <mesh position={[0, 1.5, 0]}>
                <planeGeometry args={[2, 0.35]} />
                <meshBasicMaterial color="#00ff00" />
                <Text position={[0, 0, 0.01]} fontSize={0.12} color="black" fontWeight="bold">
                  ARSH ANSARI // 2026
                </Text>
             </mesh>

            <Text position={[-1, 0.8, 0]} fontSize={0.28} color="white" anchorX="left" fontWeight="bold">
              ARSH ANSARI
            </Text>
            <Text position={[-1, 0.5, 0]} fontSize={0.12} color="#00ff00" anchorX="left">
              NIT WARANGAL
            </Text>

            <group position={[-1, -0.6, 0]}>
                <Text fontSize={0.14} color="#888" anchorX="left">COMPETITIVE PROGRESS</Text>
                <Text position={[0, -0.25, 0]} fontSize={0.18} color="white" anchorX="left" fontWeight="bold">LEETCODE: KNIGHT</Text>
                <Text position={[0, -0.5, 0]} fontSize={0.18} color="white" anchorX="left" fontWeight="bold">CODECHEF: 4-STAR</Text>
            </group>

            <mesh position={[0.7, -1.3, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="#00ff00" opacity={0.6} transparent />
                <Text position={[0,0,0.01]} fontSize={0.1} color="black" fontWeight="bold">VIP</Text>
            </mesh>
          </group>

          {/* Back Content */}
          <mesh position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[2.5, 3.8, 0.01]} />
            <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
            <Text position={[0, 0, 0.01]} fontSize={2.4} color="#00ff00" fillOpacity={0.08} fontWeight="bold">A</Text>
            <Text position={[0, -1.5, 0.01]} fontSize={0.1} color="#00ff00">ACCESS GRANTED</Text>
          </mesh>
        </group>
      </RigidBody>

      {/* STRAP - Premium scrolling name texture */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial 
          transparent 
          color="#00ff00" 
          lineWidth={0.28} 
          dashArray={0.15} 
          dashRatio={0.6}
          dashOffset={0}
          opacity={0.8}
        />
      </mesh>

      {/* Hero Text */}
      <Float speed={5} rotationIntensity={0.2} floatIntensity={1.5}>
        <Text 
           position={[0, 6, -1]} 
           fontSize={0.6} 
           color="#00ff00" 
           fillOpacity={0.03}
           strokeWidth={0.008}
           strokeColor="#00ff00"
        >
          ARSH ANSARI
        </Text>
      </Float>
    </>
  );
}