import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import Idle from "./Idle";
import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Experience = () => {
  const idleRefs = useRef(Array(10).fill(null));
  const directionalLightRef = useRef();
  const { mouse } = useThree();
  const target = useRef(new THREE.Vector3());
  const [headBones, setHeadBones] = useState([]);
  const lightSpeed = 0.5;

  // Memoized position generation
  const characterPositions = useRef(
    Array.from({ length: 10 }, () => [
      (Math.random() - 0.5) * 10,
      0,
      (Math.random() - 0.5) * 10,
    ])
  ).current;

  // Optimized bone finding
  const findHeadBones = useCallback(() => {
    const bones = [];
    idleRefs.current.forEach((ref) => {
      ref?.traverse((child) => {
        if (child.isBone && child.name.includes("Head")) {
          bones.push(child);
        }
      });
    });
    return bones;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const bones = findHeadBones();
      if (bones.length > 0) {
        setHeadBones(bones);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [findHeadBones]);

  // Optimized frame loop
  useFrame(({ clock }) => {
    // Light rotation
    const time = clock.getElapsedTime();
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(time * lightSpeed) * 5;
      directionalLightRef.current.position.z = Math.cos(time * lightSpeed) * 5;
    }

    // Head tracking
    if (headBones.length === 0) return;

    target.current.set(mouse.x * 5, mouse.y * 3, 2);

    const tempRotation = new THREE.Euler();
    headBones.forEach((headBone) => {
      headBone.lookAt(target.current);

      tempRotation.setFromQuaternion(headBone.quaternion);
      tempRotation.x = THREE.MathUtils.clamp(tempRotation.x, -0.3, 0.3);
      tempRotation.y = THREE.MathUtils.clamp(tempRotation.y, -0.5, 0.5);
      tempRotation.z = 0;

      headBone.quaternion.setFromEuler(tempRotation);
    });
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[-5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ff9999" />

      <group position={[0, -1, 0]}>
        {characterPositions.map((pos, i) => (
          <Idle
            key={i}
            ref={(el) => (idleRefs.current[i] = el)}
            scale={0.02}
            position={pos}
          />
        ))}
      </group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={idleRefs.current.filter(Boolean)}
          visible
          blur
          edgeStrength={3}
          width={1000}
          height={1000}
          kernelSize={1}
          xRay={false}
          color="black"
        />
      </EffectComposer>
    </>
  );
};

export default Experience;
