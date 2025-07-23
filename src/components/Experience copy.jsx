import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import Idle from "./Idle";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Experience = () => {
  const idleRef = useRef();
  const directionalLightRef = useRef();
  const { mouse } = useThree();
  const [target] = useState(() => new THREE.Vector3());

  const lightSpeed = 0.5;

  useFrame(({ clock }) => {
    if (!idleRef.current) return;

    // Find the head bone in the armature
    const headBone = idleRef.current.getObjectByName("mixamorigHead");
    if (!headBone) return;

    // Calculate target position based on mouse coordinates
    target.set(mouse.x * 5, mouse.y * 3, 2);

    // Store original rotation for reference
    const originalRotation = headBone.rotation.clone();

    // Make the head look at the target
    headBone.lookAt(target);

    // Clamp the rotations to natural-looking limits
    headBone.rotation.x = THREE.MathUtils.clamp(headBone.rotation.x, -0.3, 0.3);
    headBone.rotation.y = THREE.MathUtils.clamp(headBone.rotation.y, -0.5, 0.5);
    headBone.rotation.z = 0;

    // Smooth the rotation changes
    headBone.rotation.x = THREE.MathUtils.lerp(
      originalRotation.x,
      headBone.rotation.x,
      0.1
    );
    headBone.rotation.y = THREE.MathUtils.lerp(
      originalRotation.y,
      headBone.rotation.y,
      0.1
    );

    // Make the light circle around (added this part)
    if (directionalLightRef.current) {
      const time = clock.getElapsedTime();
      directionalLightRef.current.position.x = Math.sin(time * lightSpeed) * 5;
      directionalLightRef.current.position.z = Math.cos(time * lightSpeed) * 5;
    }
  }, 1); // Run after all other useFrames

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

      {/* Regular scene rendering */}
      <group position={[0, -1, 0]}>
        <Idle ref={idleRef} scale={0.02} />
      </group>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      {/* Post-processing for outline */}
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={[idleRef]}
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
