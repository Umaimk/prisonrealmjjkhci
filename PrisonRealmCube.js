// src/PrismRealmCube.js
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { a, useSprings, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useGLTF, TransformControls } from "@react-three/drei";

import eyeImage from "./assets/eye.png";
import gojoModel from "./assets/gojo.glb";

const FACE_SIZE = 4;
const CUBE_Y = 0;
const GOJO_START_Y = CUBE_Y + 0.5;
const GOJO_END_Y = CUBE_Y + FACE_SIZE + 15;
const GOJO_RADIUS = 4;

const faces = [
  { position: [0, 0, FACE_SIZE / 2], rotation: [0, 0, 0] },
  { position: [0, 0, -FACE_SIZE / 2], rotation: [0, Math.PI, 0] },
  { position: [FACE_SIZE / 2, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [-FACE_SIZE / 2, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [0, FACE_SIZE / 2, 0], rotation: [-Math.PI / 2, 0, 0] },
  { position: [0, -FACE_SIZE / 2, 0], rotation: [Math.PI / 2, 0, 0] },
];

export default function PrismRealmCube() {
  const cubeRef = useRef();
  const gojoRef = useRef();

  const [open, setOpen] = useState(false);
  const [cubeScale, setCubeScale] = useState(1);
  const [gojoScale, setGojoScale] = useState(1);

  const eyeTexture = useLoader(THREE.TextureLoader, eyeImage);
  const { scene: gojo } = useGLTF(gojoModel);

  const [springs, api] = useSprings(faces.length, () => ({
    offset: 0,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  const gojoSpring = useSpring({
    gojoY: open ? GOJO_END_Y : GOJO_START_Y,
    gojoScale: open ? gojoScale : 0,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const SAFE_OFFSET = FACE_SIZE / 2 + GOJO_RADIUS + 3;

  useEffect(() => {
    api.start({ offset: open ? SAFE_OFFSET : 0 });
  }, [open, api]);

  useFrame(() => {
    if (cubeRef.current) cubeRef.current.rotation.y += 0.01;
  });

  // Cube zoom
  const handleCubeWheel = (e) => {
    e.stopPropagation();
    let newScale = cubeScale - e.deltaY * 0.001;
    setCubeScale(Math.min(Math.max(newScale, 0.5), 5));
  };

  // Gojo zoom
  const handleGojoWheel = (e) => {
    e.stopPropagation();
    if (!open) return; // only zoom when open
    let newScale = gojoScale - e.deltaY * 0.001;
    setGojoScale(Math.min(Math.max(newScale, 0.5), 10));
  };

  return (
    <>
      {/* Cube at bottom */}
      <a.group
        ref={cubeRef}
        position={[0, CUBE_Y, 0]}
        scale={cubeScale}
        onClick={() => setOpen(!open)}
        onWheel={handleCubeWheel}
      >
        {faces.map(({ position, rotation }, i) => (
          <a.mesh
            key={i}
            position={springs[i].offset.to((o) => [
              position[0] + (position[0] === 0 ? 0 : Math.sign(position[0]) * o),
              position[1] + (position[1] === 0 ? 0 : Math.sign(position[1]) * o),
              position[2] + (position[2] === 0 ? 0 : Math.sign(position[2]) * o),
            ])}
            rotation={rotation}
          >
            <planeGeometry args={[FACE_SIZE, FACE_SIZE]} />
            <meshBasicMaterial map={eyeTexture} transparent side={THREE.DoubleSide} />
          </a.mesh>
        ))}
      </a.group>

      {/* Only show TransformControls when cube is opened */}
      {open && (
        <TransformControls object={gojoRef} mode="scale">
          <a.group
            ref={gojoRef}
            position-y={gojoSpring.gojoY}
            scale={gojoSpring.gojoScale.to((s) => s)}
            onWheel={handleGojoWheel}
          >
            <primitive object={gojo} scale={6} rotation={[0, Math.PI, 0]} />
          </a.group>
        </TransformControls>
      )}
    </>
  );
}

useGLTF.preload(gojoModel);