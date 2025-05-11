import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";

interface EnemyProps {
  position: [number, number, number];
  patrolStart: number;
  patrolEnd: number;
  speed?: number;
}

export function Enemy({ position, patrolStart, patrolEnd, speed = 2 }: EnemyProps) {
  const enemyRef = useRef<THREE.Mesh>(null);
  const [enemyPosition, setEnemyPosition] = useState(new THREE.Vector3(...position));
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isActive, setIsActive] = useState(true);
  
  // Enemy dimensions for collision detection
  const enemyWidth = 0.8;
  const enemyHeight = 0.8;
  
  // Game state and actions
  const gameState = useGameStore((state) => state.gameState);
  const addScore = useGameStore((state) => state.addScore);
  const addDefeatedEnemy = useGameStore((state) => state.addDefeatedEnemy);
  
  // Audio
  const { playHit } = useAudio();

  // Reset enemy when position changes (level restart)
  useEffect(() => {
    setEnemyPosition(new THREE.Vector3(...position));
    setDirection(1);
    setIsActive(true);
  }, [position]);

  // Expose enemy position and dimensions for collision detection
  useEffect(() => {
    if (enemyRef.current) {
      enemyRef.current.userData = {
        isEnemy: true,
        width: enemyWidth,
        height: enemyHeight,
        getPosition: () => enemyPosition.clone(),
        defeat: () => {
          if (isActive) {
            setIsActive(false);
            playHit();
            addScore(100);
            addDefeatedEnemy();
            
            // After a short delay, remove the enemy
            setTimeout(() => {
              setEnemyPosition(new THREE.Vector3(0, -10, 0)); // Move off screen
            }, 300);
          }
        }
      };
    }
  }, [enemyPosition, isActive, addScore, addDefeatedEnemy, playHit]);

  // Enemy patrol logic
  useFrame((_, delta) => {
    if (gameState !== "playing" || !isActive || !enemyRef.current) return;
    
    // Move enemy
    const newPosition = enemyPosition.clone();
    newPosition.x += direction * speed * delta;
    
    // Check if enemy has reached the end of patrol
    if (newPosition.x > patrolEnd) {
      newPosition.x = patrolEnd;
      setDirection(-1);
    } else if (newPosition.x < patrolStart) {
      newPosition.x = patrolStart;
      setDirection(1);
    }
    
    setEnemyPosition(newPosition);
    enemyRef.current.position.copy(newPosition);
  });

  if (!isActive) {
    return null;
  }

  return (
    <group>
      <mesh 
        ref={enemyRef} 
        position={[enemyPosition.x, enemyPosition.y + enemyHeight/2, enemyPosition.z]}
        castShadow
      >
        <boxGeometry args={[enemyWidth, enemyHeight, enemyWidth]} />
        <meshStandardMaterial color="purple" />
      </mesh>
      
      {/* Enemy eyes */}
      <mesh
        position={[
          enemyPosition.x + (direction * 0.2),
          enemyPosition.y + 0.5,
          enemyPosition.z - 0.2
        ]}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh
        position={[
          enemyPosition.x + (direction * 0.2),
          enemyPosition.y + 0.5,
          enemyPosition.z - 0.2
        ]}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
