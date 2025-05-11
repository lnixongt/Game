import { useRef, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  texture?: "grass" | "wood" | "sand" | "asphalt";
  color?: string;
}

export function Platform({ position, size, texture = "grass", color = "green" }: PlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture if specified
  let textureMap;
  try {
    textureMap = texture ? useTexture(`/textures/${texture}.${texture === 'grass' || texture === 'asphalt' ? 'png' : 'jpg'}`) : null;
    if (textureMap) {
      textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
      textureMap.repeat.set(size[0], size[2]);
    }
  } catch (err) {
    console.warn(`Texture ${texture} could not be loaded, falling back to color`);
    textureMap = null;
  }

  // Register this platform for collision detection
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = {
        isPlatform: true,
        width: size[0],
        height: size[1],
        depth: size[2],
        getPosition: () => new THREE.Vector3(...position),
      };
    }
  }, [position, size]);

  return (
    <mesh 
      ref={meshRef}
      position={position}
      receiveShadow
      castShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={textureMap ? "#ffffff" : color} 
        map={textureMap} 
      />
    </mesh>
  );
}
