import { EffectComposer, Outline } from "@react-three/postprocessing";
import Idle from "./Idle";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Preload } from "@react-three/drei";

const CHARACTER_COUNT = 10;

const Particles = ({ count = 300, radius = 10 }) => {
  const mesh = useRef();
  const { mouse, camera } = useThree();
  const followPoint = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const tempVec = useRef(new THREE.Vector3());
  const dirVec = useRef(new THREE.Vector3());

  const particles = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      pos.push(
        r * Math.sin(phi) * Math.cos(angle),
        r * Math.sin(phi) * Math.sin(angle),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(pos);
  }, [count, radius]);

  const velocities = useMemo(() => {
    return Array.from(
      { length: count },
      () =>
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        )
    );
  }, [count]);

  const followTimers = useRef(new Array(count).fill(0));
  const mouseMoved = useRef(false);

  useEffect(() => {
    const handleMove = () => {
      mouseMoved.current = true;
      clearTimeout(window.mouseMoveTimeout);
      window.mouseMoveTimeout = setTimeout(() => {
        mouseMoved.current = false;
      }, 500);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    raycaster.current.setFromCamera(mouse, camera);
    raycaster.current.ray.intersectPlane(plane, followPoint.current);

    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = tempVec.current.set(
        pos.array[i3],
        pos.array[i3 + 1],
        pos.array[i3 + 2]
      );

      if (mouseMoved.current && Math.random() < 0.02) {
        followTimers.current[i] = Math.random() * 100;
      }

      if (followTimers.current[i] > 0) {
        dirVec.current
          .copy(followPoint.current)
          .sub(p)
          .normalize()
          .multiplyScalar(0.02);
        p.add(dirVec.current);
        followTimers.current[i] -= 1;
      } else {
        p.add(velocities[i]);
      }

      if (p.lengthSq() > radius * radius) {
        p.setLength(radius * Math.random());
      }

      pos.array[i3] = p.x;
      pos.array[i3 + 1] = p.y;
      pos.array[i3 + 2] = p.z;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="black" sizeAttenuation />
    </points>
  );
};

const Experience = () => {
  const idleRefs = useRef([]);
  const directionalLightRef = useRef();
  const lightSpeed = 0.5;

  const characterPositions = useMemo(
    () =>
      Array.from({ length: CHARACTER_COUNT }, () => [
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 20,
      ]),
    []
  );

  useEffect(() => {
    if (directionalLightRef.current) {
      const light = directionalLightRef.current;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 50;
      light.shadow.camera.left = -10;
      light.shadow.camera.right = 10;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.bias = -0.001;
    }
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(time * lightSpeed) * 5;
      directionalLightRef.current.position.z = Math.cos(time * lightSpeed) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={directionalLightRef}
        position={[-5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ff9999" />

      <group position={[0, -1, 0]}>
        {characterPositions.map((pos, i) => (
          <>
            <Suspense fallback={null}>
              <Idle
                key={`idle-${pos[0]}-${pos[1]}-${pos[2]}`}
                ref={(el) => (idleRefs.current[i] = el)}
                scale={0.02}
                position={pos}
                castShadow
                receiveShadow
              />
              <Preload all />
            </Suspense>
          </>
        ))}
      </group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>

      <Particles count={500} radius={10} />

      <EffectComposer multisampling={2} autoClear={false}>
        <Outline
          selection={idleRefs.current.filter(Boolean)}
          visible
          blur
          edgeStrength={1.5}
          width={600}
          height={600}
          kernelSize={1}
          xRay={false}
          color="black"
        />
      </EffectComposer>
    </>
  );
};

export default Experience;
