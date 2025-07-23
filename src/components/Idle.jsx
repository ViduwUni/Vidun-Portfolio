import React, { useEffect } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const Idle = React.forwardRef(({ props, scale, position }, ref) => {
  const group = React.useRef();
  const { scene, animations } = useGLTF("/models/idle.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions, names } = useAnimations(animations, group);

  const toonMaterial = React.useMemo(() => {
    const material = new THREE.MeshToonMaterial();
    // Create gradient texture
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
      actions[names[0]]
        .reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.5)
        .play();
    }
  }, []);

  return (
    <group ref={ref} {...props} dispose={null} scale={scale} position={position}>
      <group name="Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="f6d60e107990463ba4ecd7a6d400ba37fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="RootNode1">
              <group name="mesh" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
            </group>
          </group>
        </group>
        {/* Add outline effect using a custom approach */}
        <group name="OutlineGroup">
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
              name="mesh_Mat_0"
              geometry={nodes.mesh_Mat_0.geometry}
              material={toonMaterial}
              skeleton={nodes.mesh_Mat_0.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
});

export default Idle;

useGLTF.preload("/models/idle.glb");
