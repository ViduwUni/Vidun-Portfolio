import React, { useEffect, useRef, useMemo } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const Idle = React.forwardRef(({ scale, position }, ref) => {
  const group = useRef();

  const { scene, animations } = useGLTF(
    "/models/idle-draco.glb",
    true,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions, names } = useAnimations(animations, group);

  const toonMaterial = useMemo(() => {
    const material = new THREE.MeshToonMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.5, 0.7),
    });

    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1, 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    material.gradientMap = texture;

    return material;
  }, []);

  useEffect(() => {
    if (actions[names[0]]) {
      const action = actions[names[0]];
      action
        .reset()
        .setEffectiveTimeScale(0.9 + Math.random() * 0.2)
        .setEffectiveWeight(1)
        .setLoop(THREE.LoopRepeat, Infinity)
        .play();
    }
    return () => {
      if (actions[names[0]]) {
        actions[names[0]].fadeOut(0.5);
      }
    };
  }, [actions, names]);

  return (
    <group ref={group} dispose={null} scale={scale} position={position}>
      <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          geometry={nodes.mesh_Mat_0.geometry}
          skeleton={nodes.mesh_Mat_0.skeleton}
          material={
            new THREE.MeshBasicMaterial({
              color: "black",
              side: THREE.BackSide,
              depthWrite: false,
            })
          }
        />
        <skinnedMesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_Mat_0.geometry}
          material={toonMaterial}
          skeleton={nodes.mesh_Mat_0.skeleton}
        />
      </group>
    </group>
  );
});

export default React.memo(Idle);

// Preload the model using the custom DRACO loader
useGLTF.preload("/models/idle-draco.glb", true, (loader) => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);
});
