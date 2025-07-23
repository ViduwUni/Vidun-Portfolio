import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import Idle from "./Idle";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Experience = () => {
  const CHARACTER_COUNT = 100;
  const idleRefs = useRef(Array(CHARACTER_COUNT).fill(null));
  const directionalLightRef = useRef();
  const { mouse, camera, size } = useThree();
  const [headBones, setHeadBones] = useState([]);
  const lightSpeed = 0.5;

  // Mouse tracking
  const mouseTarget = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Positions with more space between characters
  const characterPositions = useRef(
    Array.from({ length: CHARACTER_COUNT }, () => [
      (Math.random() - 0.5) * 40, // Wider spread on X axis
      0,
      (Math.random() - 0.5) * 40, // Wider spread on Z axis
    ])
  ).current;

  // Find head bones with retry logic
  useEffect(() => {
    const findBones = () => {
      const bones = [];
      idleRefs.current.forEach((ref) => {
        if (ref) {
          // Look for the exact Mixamo head bone
          const headBone = ref.getObjectByName("mixamorigHead");
          if (headBone) bones.push(headBone);
        }
      });
      return bones;
    };

    // Try immediately
    const bones = findBones();
    if (bones.length > 0) {
      setHeadBones(bones);
    } else {
      // Retry after a delay if models aren't loaded yet
      const timeout = setTimeout(() => {
        const retryBones = findBones();
        if (retryBones.length > 0) setHeadBones(retryBones);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  useFrame(({ clock }) => {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Light animation
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(time * lightSpeed) * 5;
      directionalLightRef.current.position.z = Math.cos(time * lightSpeed) * 5;
    }

    // Convert mouse to world coordinates
    raycaster.current.setFromCamera(
      new THREE.Vector2(mouse.x, mouse.y),
      camera
    );
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane.current, intersection);

    if (intersection) {
      mouseTarget.current.lerp(intersection, 0.1);
    }

    // Head tracking logic
    if (headBones.length === 0) return;

    console.log(headBones.position);

    const tempV = new THREE.Vector3();
    const tempQ = new THREE.Quaternion();
    const tempE = new THREE.Euler();

    headBones.forEach((headBone) => {
      // Get world position of the head
      headBone.getWorldPosition(tempV);

      // Calculate direction to mouse target
      const direction = new THREE.Vector3()
        .subVectors(mouseTarget.current, tempV)
        .normalize();

      // Calculate target rotation
      tempQ.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Forward direction
        direction
      );

      // Smooth rotation with damping
      headBone.quaternion.slerp(tempQ, 0.1 * (60 * delta));

      // Apply rotation limits
      tempE.setFromQuaternion(headBone.quaternion);
      tempE.x = THREE.MathUtils.clamp(tempE.x, -0.3, 0.3);
      tempE.y = THREE.MathUtils.clamp(tempE.y, -0.8, 0.8); // More natural neck rotation
      tempE.z = 0;
      headBone.quaternion.setFromEuler(tempE);
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
        <planeGeometry args={[80, 80]} /> {/* Larger ground plane */}
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
