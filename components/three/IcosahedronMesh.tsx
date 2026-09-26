"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_TILT_RADIANS = THREE.MathUtils.degToRad(12);
const SCROLL_EXTRA_ROTATION = THREE.MathUtils.degToRad(38); // ~30-45deg per spec
const AUTOROTATE_SECONDS_PER_REVOLUTION = 50; // ~1 revolution per 40-60s
const RESTING_ROTATION = { x: 0.3, y: 0.4 };
const LERP_FACTOR = 0.06;
const FADE_LERP_FACTOR = 0.08;

interface IcosahedronMeshProps {
  /** 0 (top of hero) -> 1 (scrolled a full hero-height past it). Read every frame, not via React state, to avoid re-renders on scroll. */
  scrollProgress: React.RefObject<number>;
  /** Touch/coarse-pointer devices get a slow constant autorotation instead of pointer tracking. */
  isCoarsePointer: boolean;
  accentColor: string;
}

/**
 * A single faceted icosahedron mesh — one geometry, one material, one draw
 * call, no shadow maps or ground plane — the "lighter alternative" the spec
 * prefers to start with. Geometry/material are declared as JSX (not built
 * with `new THREE.X()` in render) so React/Three own their lifecycle,
 * including disposal when this mesh unmounts.
 */
export default function IcosahedronMesh({
  scrollProgress,
  isCoarsePointer,
  accentColor,
}: IcosahedronMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const autoRotation = useRef(0);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const scroll = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
    const scrollRotation = scroll * SCROLL_EXTRA_ROTATION;
    const targetScale = THREE.MathUtils.lerp(1, 0.85, scroll);
    const targetOpacity = THREE.MathUtils.lerp(1, 0.4, scroll);

    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, FADE_LERP_FACTOR));
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, FADE_LERP_FACTOR);

    if (isCoarsePointer) {
      autoRotation.current += (delta * Math.PI * 2) / AUTOROTATE_SECONDS_PER_REVOLUTION;
      mesh.rotation.y = THREE.MathUtils.lerp(
        mesh.rotation.y,
        RESTING_ROTATION.y + autoRotation.current + scrollRotation,
        LERP_FACTOR,
      );
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, RESTING_ROTATION.x, LERP_FACTOR);
    } else {
      const targetY = RESTING_ROTATION.y + state.pointer.x * MAX_TILT_RADIANS + scrollRotation;
      const targetX = RESTING_ROTATION.x + state.pointer.y * -MAX_TILT_RADIANS;
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetY, LERP_FACTOR);
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, LERP_FACTOR);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        color={accentColor}
        flatShading
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={1}
      />
    </mesh>
  );
}
