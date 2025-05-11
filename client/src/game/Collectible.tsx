import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";

interface CollectibleProps {
  position: [number, number, number];
  points?: number;
}

export function Collectible({ position, points = 10 }: CollectibleProps) {
  const collectibleRef = useRef<THREE.Mesh>(null);
  const [collectiblePosition] = useState(new THREE.Vector3(...position));
  const [isCollected, setIsCollected] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [floatOffset, setFloatOffset] = useState(0);
  
  // Game state and actions
  const gameState = useGameStore((state) => state.gameState);
  const addScore = useGameStore((state) => state.addScore);
  const addCollectible = useGameStore((state) => state.addCollectible);
  
  // Audio
  const { playSuccess } = useAudio();

  // Expose collectible position and dimensions for collision detection
  useEffect(() => {
    if (collectibleRef.current) {
      collectibleRef.current.userData = {
        isCollectible: true,
        getPosition: () => collectiblePosition.clone(),
        collect: () => {
          if (!isCollected) {
            setIsCollected(true);
            playSuccess();
            addScore(points);
            addCollectible();
          }
        }
      };
    }
  }, [collectiblePosition, isCollected, points, addScore, addCollectible, playSuccess]);

  // Animation for the collectible
  useFrame((_, delta) => {
    if (gameState !== "playing" || isCollected || !collectibleRef.current) return;
    
    // Rotate the collectible
    setRotationY((prev) => prev + delta * 2);
    
    // Make the collectible float up and down
    setFloatOffset((prev) => {
      const newOffset = prev + delta;
      return newOffset > Math.PI * 2 ? 0 : newOffset;
    });
    
    // Apply animations
    collectibleRef.current.rotation.y = rotationY;
    collectibleRef.current.position.y = collectiblePosition.y + Math.sin(floatOffset) * 0.2;
  });

  if (isCollected) {
    return null;
  }

  return (
    <mesh 
      ref={collectibleRef} 
      position={collectiblePosition}
      castShadow
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="gold" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}
