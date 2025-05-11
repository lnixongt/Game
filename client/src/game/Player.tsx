import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";

// Player physics and movement properties
const MOVE_SPEED = 5;
const JUMP_FORCE = 7;
const GRAVITY = 20;

interface PlayerProps {
  position: [number, number, number];
}

export function Player({ position }: PlayerProps) {
  const playerRef = useRef<THREE.Mesh>(null);
  
  // Player state
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(...position));
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  const [isJumping, setIsJumping] = useState(false);
  const [facingDirection, setFacingDirection] = useState(1); // 1 for right, -1 for left
  
  // Player dimensions for collision detection
  const playerWidth = 0.8;
  const playerHeight = 1;
  
  // Game controls and state
  const leftPressed = useKeyboardControls((state) => state.left);
  const rightPressed = useKeyboardControls((state) => state.right);
  const jumpPressed = useKeyboardControls((state) => state.jump);
  
  const gameState = useGameStore((state) => state.gameState);
  const loseLife = useGameStore((state) => state.loseLife);
  
  // Audio
  const { playHit } = useAudio();

  // Handle initial position
  useEffect(() => {
    setPlayerPosition(new THREE.Vector3(...position));
    setVelocity(new THREE.Vector3(0, 0, 0));
  }, [position]);

  // Expose player position and dimensions for collision detection
  useEffect(() => {
    if (playerRef.current) {
      // Make the player's position and dimensions available to the parent component
      playerRef.current.userData = {
        isPlayer: true,
        width: playerWidth,
        height: playerHeight,
        getPosition: () => playerPosition.clone(),
        takeDamage: () => {
          playHit();
          loseLife();
          // Bounce player up slightly when taking damage
          setVelocity(prev => new THREE.Vector3(prev.x, 5, prev.z));
        }
      };
    }
  }, [playerPosition, loseLife, playHit]);

  // Game logic on each frame
  useFrame((_, delta) => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    const newVelocity = velocity.clone();
    
    // Handle horizontal movement
    let horizontalMovement = 0;
    
    if (leftPressed) {
      horizontalMovement -= 1;
      setFacingDirection(-1);
    }
    
    if (rightPressed) {
      horizontalMovement += 1;
      setFacingDirection(1);
    }
    
    newVelocity.x = horizontalMovement * MOVE_SPEED;
    
    // Apply gravity
    newVelocity.y -= GRAVITY * delta;
    
    // Handle jump if on ground
    if (jumpPressed && !isJumping) {
      newVelocity.y = JUMP_FORCE;
      setIsJumping(true);
    }
    
    // Update position
    const newPosition = playerPosition.clone();
    newPosition.x += newVelocity.x * delta;
    newPosition.y += newVelocity.y * delta;
    
    // Floor collision (simple ground check)
    if (newPosition.y < 0) {
      newPosition.y = 0;
      newVelocity.y = 0;
      setIsJumping(false);
    }
    
    // Update state
    setPlayerPosition(newPosition);
    setVelocity(newVelocity);
    
    // Update mesh position
    playerRef.current.position.copy(newPosition);
  });

  return (
    <group>
      <mesh 
        ref={playerRef} 
        position={[playerPosition.x, playerPosition.y + playerHeight/2, playerPosition.z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[playerWidth, playerHeight, playerWidth]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Player eyes to show direction */}
      <mesh
        position={[
          playerPosition.x + (facingDirection * 0.25), 
          playerPosition.y + 0.6, 
          playerPosition.z - 0.2
        ]}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh
        position={[
          playerPosition.x + (facingDirection * 0.25), 
          playerPosition.y + 0.6, 
          playerPosition.z - 0.2
        ]}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
