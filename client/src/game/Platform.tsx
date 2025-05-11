import { useRef, useEffect, useMemo } from "react";
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
  
  // Create a stable key for texture loading based on texture type
  const textureKey = useMemo(() => {
    return `/textures/${texture}.${texture === 'grass' || texture === 'asphalt' ? 'png' : 'jpg'}`;
  }, [texture]);
  
  // Load texture if specified
  let textureMap;
  try {
    textureMap = texture ? useTexture(textureKey) : null;
  } catch (err) {
    console.warn(`Texture ${texture} could not be loaded, falling back to color`);
    textureMap = null;
  }
  
  // Apply texture settings when available
  useEffect(() => {
    if (textureMap) {
      textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
      textureMap.repeat.set(size[0], size[2]);
    }
  }, [textureMap, size]);

  // Register this platform for collision detection with a stable reference
  useEffect(() => {
    if (meshRef.current) {
      const platformPosition = new THREE.Vector3(...position);
      
      meshRef.current.userData = {
        isPlatform: true,
        width: size[0],
        height: size[1],
        depth: size[2],
        getPosition: () => platformPosition,
      };
    }
  }, []);

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
