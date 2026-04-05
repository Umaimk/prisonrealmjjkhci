// src/App.js
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import PrismRealmCube from "./PrismRealmCube"; // ✅ do NOT add .js

function App() {
  return (
    <Canvas
  camera={{ position: [0, 5, 10], fov: 50 }}
  style={{ width: "100vw", height: "100vh", background: "#86909e" }}
>
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Stars />
      <PrismRealmCube />
      <OrbitControls />
    </Canvas>
  );
}

export default App;