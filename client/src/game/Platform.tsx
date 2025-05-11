import { useRef, useEffect } from "react";
import * as THREE from "three";

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  texture?: "grass" | "wood" | "sand" | "asphalt";
  color?: string;
}

// Get color based on texture type for better visuals without textures
const getColorForTexture = (textureName: string): string => {
  switch (textureName) {
    case 'grass': return '#4CAF50'; // Green
    case 'wood': return '#8D6E63';  // Brown
    case 'sand': return '#FDD835';  // Yellow
    case 'asphalt': return '#607D8B'; // Gray-blue
    default: return '#4CAF50';
  }
};

export function Platform({ position, size, texture = "grass", color }: PlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Set up platform data for collision detection
  useEffect(() => {
    if (meshRef.current) {
      // Create a stable position vector to avoid recreating the function
      const posVector = new THREE.Vector3(...position);
      
      meshRef.current.userData = {
        isPlatform: true,
        width: size[0],
        height: size[1],
        depth: size[2],
        getPosition: () => posVector,
      };
    }
  // We use an empty dependency array to set this up once on component mount
  // The position and size in userData are captured in the closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use color based on texture type or provided color
  const platformColor = color || getColorForTexture(texture);

  return (
    <mesh 
      ref={meshRef}
      position={position}
      receiveShadow
      castShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={platformColor} />
    </mesh>
  );
}
