import { EffectComposer, Outline } from "@react-three/postprocessing";
import Idle from "./Idle";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CHARACTER_COUNT = 30;

const Particles = ({ count = 5000, radius = 1000 }) => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const mesh = useRef();
  const { mouse, camera } = useThree();
  const followPoint = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );

  const particles = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      const x = r * Math.sin(phi) * Math.cos(angle);
      const y = r * Math.sin(phi) * Math.sin(angle);
      const z = r * Math.cos(phi);
      pos.push(x, y, z);
    }
    return new Float32Array(pos);
  }, [count, radius]);

  const velocities = useMemo(() => {
    return new Array(count)
      .fill(0)
      .map(
        () =>
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005
          )
      );
  }, [count]);

  const followTimers = useRef(new Array(count).fill(0));

  useEffect(() => {
    const handleMove = () => {
      setMouseMoved(true);
      clearTimeout(window.mouseMoveTimeout);
      window.mouseMoveTimeout = setTimeout(() => setMouseMoved(false), 500);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    raycaster.current.setFromCamera(mouse, camera);
    const intersect = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersect);
    followPoint.current.copy(intersect);

    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let i3 = i * 3;
      const p = new THREE.Vector3(
        pos.array[i3],
        pos.array[i3 + 1],
        pos.array[i3 + 2]
      );

      if (mouseMoved && Math.random() < 0.02) {
        followTimers.current[i] = Math.random() * 100;
      }

      if (followTimers.current[i] > 0) {
        const dir = followPoint.current
          .clone()
          .sub(p)
          .normalize()
          .multiplyScalar(0.02);
        p.add(dir);
        followTimers.current[i] -= 1;
      } else {
        p.add(velocities[i]);
      }

      if (p.length() > radius) p.setLength(radius * Math.random());

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
  const idleRefs = useRef(Array(CHARACTER_COUNT).fill(null));
  const directionalLightRef = useRef();
  const [headBones, setHeadBones] = useState([]);
  const lightSpeed = 0.5;

  const characterPositions = useRef(
    Array.from({ length: CHARACTER_COUNT }, () => [
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20,
    ])
  ).current;

  useEffect(() => {
    if (directionalLightRef.current) {
      const light = directionalLightRef.current;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;
      light.shadow.camera.left = -20;
      light.shadow.camera.right = 20;
      light.shadow.camera.top = 20;
      light.shadow.camera.bottom = -20;
      light.shadow.bias = -0.0001;
    }
  }, []);

  useEffect(() => {
    const findBones = () => {
      const bones = [];
      idleRefs.current.forEach((ref) => {
        if (ref) {
          const headBone = ref.getObjectByName("mixamorigHead");
          if (headBone) bones.push(headBone);
        }
      });
      return bones;
    };

    const bones = findBones();
    if (bones.length > 0) {
      setHeadBones(bones);
    } else {
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

    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(time * lightSpeed) * 5;
      directionalLightRef.current.position.z = Math.cos(time * lightSpeed) * 5;
    }

    if (headBones.length === 0) return;

    const tempQ = new THREE.Quaternion();
    const tempE = new THREE.Euler();

    headBones.forEach((headBone) => {
      tempQ.identity();
      headBone.quaternion.slerp(tempQ, 0.1 * (60 * delta));
      tempE.setFromQuaternion(headBone.quaternion);
      tempE.x = 0;
      tempE.y = 0;
      tempE.z = 0;
      headBone.quaternion.setFromEuler(tempE);
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[-5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ff9999" />

      <group position={[0, -1, 0]}>
        {characterPositions.map((pos, i) => (
          <Idle
            key={i}
            ref={(el) => (idleRefs.current[i] = el)}
            scale={0.02}
            position={pos}
            castShadow
            receiveShadow
          />
        ))}
      </group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>

      <Particles count={500} radius={10} />

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
