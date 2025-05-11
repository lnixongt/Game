import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { levelData } from "./LevelData";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Collectible } from "./Collectible";
import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";

interface LevelProps {
  levelIndex: number;
}

export function Level({ levelIndex }: LevelProps) {
  const levelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const currentLevel = levelData[levelIndex] || levelData[0];
  const restartGame = useGameStore((state) => state.restartGame);
  const nextLevel = useGameStore((state) => state.nextLevel);
  const completedLevel = useGameStore((state) => state.completedLevel);
  const levelCompleted = useGameStore((state) => state.levelCompleted);
  const { playHit, playSuccess } = useAudio();
  
  // Set camera position to follow player
  useEffect(() => {
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
  }, [camera, levelIndex]);

  // Create a flag endpoint mesh
  const goalRef = useRef<THREE.Mesh>(null);
  
  // Handle collision detection
  useFrame(() => {
    if (!levelRef.current) return;
    
    // Find player
    let player: any = null;
    let playerPosition: THREE.Vector3 | null = null;
    
    // Find all entities for collision checks
    levelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isPlayer) {
        player = child;
        playerPosition = child.userData.getPosition();
      }
    });
    
    // Check if player exists
    if (!player || !playerPosition) return;
    
    // Check if player fell off the level
    if (playerPosition.y < -5) {
      playHit();
      restartGame();
      return;
    }
    
    // Check player collisions with platforms (basic collision for ground support)
    levelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isPlatform) {
        const platformPosition = child.userData.getPosition();
        const platformWidth = child.userData.width;
        const platformHeight = child.userData.height;
        
        // Simple AABB collision check
        const playerBottom = playerPosition.y;
        const platformTop = platformPosition.y + platformHeight / 2;
        
        const playerLeft = playerPosition.x - player.userData.width / 2;
        const playerRight = playerPosition.x + player.userData.width / 2;
        
        const platformLeft = platformPosition.x - platformWidth / 2;
        const platformRight = platformPosition.x + platformWidth / 2;
        
        // Check if player is above and falling onto platform
        if (playerBottom <= platformTop + 0.1 && 
            playerBottom >= platformTop - 0.2 && 
            playerRight > platformLeft && 
            playerLeft < platformRight) {
          // Player is on platform
        }
      }
    });
    
    // Check player collisions with enemies
    levelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isEnemy) {
        const enemyPosition = child.userData.getPosition();
        
        // Calculate distances for collision
        const dx = playerPosition.x - enemyPosition.x;
        const dy = playerPosition.y - enemyPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if player jumped on top of enemy
        if (distance < 1.2 && dy > 0.3) {
          // Player jumped on enemy
          child.userData.defeat();
        }
        // Check if enemy hit player
        else if (distance < 1 && dy <= 0.3) {
          // Enemy hit player
          player.userData.takeDamage();
        }
      }
    });
    
    // Check player collisions with collectibles
    levelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isCollectible) {
        const collectiblePosition = child.userData.getPosition();
        
        // Calculate distance for collection
        const dx = playerPosition.x - collectiblePosition.x;
        const dy = playerPosition.y - collectiblePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if player collected the item
        if (distance < 1) {
          child.userData.collect();
        }
      }
    });
    
    // Check if player reached the level end
    if (goalRef.current) {
      const goalPosition = new THREE.Vector3();
      goalRef.current.getWorldPosition(goalPosition);
      
      const endPosition = currentLevel.levelEnd.position;
      const dx = playerPosition.x - endPosition[0];
      const dy = playerPosition.y - endPosition[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2 && !levelCompleted) {
        // Level completed
        playSuccess();
        completedLevel();
        
        // Progress to next level after a short delay
        setTimeout(() => {
          nextLevel();
        }, 1500);
      }
    }
    
    // Update camera to follow player
    if (player) {
      camera.position.x = playerPosition.x;
      camera.position.y = playerPosition.y + 5;
      camera.lookAt(playerPosition.x, playerPosition.y, 0);
    }
  });

  return (
    <group ref={levelRef}>
      {/* Sky background */}
      <mesh position={[0, 10, -20]} rotation={[0, 0, 0]}>
        <planeGeometry args={[200, 100]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Ground base (fallback if player falls through other platforms) */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 100]} />
        <meshStandardMaterial color="#553300" />
      </mesh>
      
      {/* Render platforms */}
      {currentLevel.platforms.map((platform, index) => (
        <Platform 
          key={`platform-${index}`}
          position={platform.position}
          size={platform.size}
          texture={platform.texture}
        />
      ))}
      
      {/* Render enemies */}
      {currentLevel.enemies.map((enemy, index) => (
        <Enemy 
          key={`enemy-${index}`}
          position={enemy.position}
          patrolStart={enemy.patrolStart}
          patrolEnd={enemy.patrolEnd}
          speed={enemy.speed}
        />
      ))}
      
      {/* Render collectibles */}
      {currentLevel.collectibles.map((collectible, index) => (
        <Collectible 
          key={`collectible-${index}`}
          position={collectible.position}
          points={collectible.points}
        />
      ))}
      
      {/* Level end flag */}
      <group position={currentLevel.levelEnd.position}>
        <mesh 
          ref={goalRef}
          position={[0, 0, 0]}
        >
          <boxGeometry args={currentLevel.levelEnd.size} />
          <meshStandardMaterial color="green" />
        </mesh>
        
        {/* Flag pole */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
        
        {/* Flag */}
        <mesh position={[0.5, 3, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1, 0.8]} />
          <meshStandardMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Player character */}
      <Player position={currentLevel.playerStart} />
    </group>
  );
}
