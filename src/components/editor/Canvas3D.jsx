import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Plane } from '@react-three/drei';

const Floor = () => {
  return (
    <Plane args={[50, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#2d3748" />
    </Plane>
  );
};

const Room = () => {
  return (
    <group>
      {/* Floor */}
      <Floor />
      
      {/* Sample furniture */}
      <Box position={[-5, 0.5, -3]} args={[2, 1, 1]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Box>
      
      <Box position={[5, 0.25, -3]} args={[1, 0.5, 1]}>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
      
      <Box position={[0, 1, 5]} args={[4, 2, 0.5]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
    </group>
  );
};

const Canvas3D = ({ canvasData }) => {
  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <Room />
          <Grid args={[50, 50]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;