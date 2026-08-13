import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";

const FACE_SIZE = 2;

const faces = [
  { position: [0, 0, FACE_SIZE / 2], rotation: [0, 0, 0] },
  { position: [0, 0, -FACE_SIZE / 2], rotation: [0, Math.PI, 0] },
  { position: [FACE_SIZE / 2, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [-FACE_SIZE / 2, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [0, FACE_SIZE / 2, 0], rotation: [-Math.PI / 2, 0, 0] },
  { position: [0, -FACE_SIZE / 2, 0], rotation: [Math.PI / 2, 0, 0] },
];

export default function PrismRealmCube() {
  const groupRef = useRef();
  const [open, setOpen] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={groupRef} onClick={() => setOpen(!open)}>
      {faces.map(({ position, rotation }, i) => {
        const { offset } = useSpring({
          offset: open ? 1.5 : 0,
          config: { mass: 1, tension: 170, friction: 26 },
        });

        return (
          <a.mesh
            key={i}
            position={offset.to(o => [
              position[0] + (position[0] === 0 ? 0 : Math.sign(position[0]) * o),
              position[1] + (position[1] === 0 ? 0 : Math.sign(position[1]) * o),
              position[2] + (position[2] === 0 ? 0 : Math.sign(position[2]) * o),
            ])}
            rotation={rotation}
          >
            <planeGeometry args={[FACE_SIZE, FACE_SIZE]} />
            <meshStandardMaterial color="#6699cc" opacity={0.8} transparent side={2} />
          </a.mesh>
        );
      })}

      {open && (
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
          outlineWidth={0.02}
          outlineColor="black"
        >
          Eid Mubarak
        </Text>
      )}
    </group>
  );
}