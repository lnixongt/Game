import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Menu } from "./game/Menu";
import { GameOver } from "./game/GameOver";
import { Level } from "./game/Level";
import { SoundManager } from "./game/SoundManager";
import { GameUI } from "./game/GameUI";
import { useGameStore } from "./lib/stores/useGameStore";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space", "KeyW", "ArrowUp"] },
  { name: "restart", keys: ["KeyR"] },
];

// Main App component
function App() {
  const { gameState, currentLevel } = useGameStore();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gameState === 'menu' && <Menu />}

          {(gameState === 'playing' || gameState === 'paused') && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 5, 12],
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />
                
                {/* Lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize-width={2048} 
                  shadow-mapSize-height={2048}
                />
                
                <Suspense fallback={null}>
                  <Level levelIndex={currentLevel} />
                </Suspense>
              </Canvas>
              <GameUI />
            </>
          )}

          {gameState === 'gameOver' && <GameOver />}

          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
