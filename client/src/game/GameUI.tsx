import { useEffect, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStore } from "../lib/stores/useGameStore";
import { levelData } from "./LevelData";
import { cn } from "../lib/utils";

export function GameUI() {
  const { 
    gameState, 
    character, 
    currentLevel, 
    timeRemaining, 
    collectiblesCollected,
    enemiesDefeated,
    levelCompleted,
    decreaseTime,
    pauseGame,
    resumeGame
  } = useGameStore();
  
  const [paused, setPaused] = useState(false);
  const restartPressed = useKeyboardControls(state => state.restart);
  
  const currentLevelData = levelData[currentLevel];
  
  // Timer effect for countdown
  useEffect(() => {
    if (gameState !== "playing" || levelCompleted) return;
    
    const timer = setInterval(() => {
      decreaseTime();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, levelCompleted, decreaseTime]);

  // Handle pause/resume with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameState === "playing") {
          pauseGame();
          setPaused(true);
        } else if (gameState === "paused") {
          resumeGame();
          setPaused(false);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, pauseGame, resumeGame]);

  // Handle restart key
  useEffect(() => {
    if (restartPressed) {
      // Reset pause state if game is restarted
      setPaused(false);
    }
  }, [restartPressed]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-50 text-white">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <span className="text-xl font-bold">Lives:</span>
            <div className="flex ml-2">
              {Array.from({ length: character.lives }).map((_, i) => (
                <div key={i} className="w-6 h-6 mx-1 bg-red-500 rounded-full"></div>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-xl font-bold">Score: {character.score}</span>
          </div>
          
          <div>
            <span className="text-xl font-bold">Time: {timeRemaining}</span>
          </div>
        </div>
        
        <div>
          <span className="text-xl font-bold">Level: {currentLevel + 1} - {currentLevelData?.name}</span>
        </div>
      </div>
      
      {/* Stats display */}
      <div className="absolute top-16 left-4 p-3 bg-black bg-opacity-50 text-white rounded">
        <div className="text-sm">Coins: {collectiblesCollected}</div>
        <div className="text-sm">Enemies Defeated: {enemiesDefeated}</div>
      </div>
      
      {/* Level completed message */}
      {levelCompleted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-700 bg-opacity-80 text-white px-8 py-6 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-4">Level Complete!</h2>
            <p className="text-xl">Loading next level...</p>
          </div>
        </div>
      )}
      
      {/* Pause menu */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto">
          <div className="bg-gray-800 text-white p-8 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-6">Game Paused</h2>
            <p className="text-xl mb-6">Press ESC to resume</p>
            <div className="flex flex-col space-y-4">
              <button 
                className={cn(
                  "px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 transition",
                  "pointer-events-auto"
                )}
                onClick={() => {
                  resumeGame();
                  setPaused(false);
                }}
              >
                Resume Game
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls help */}
      <div className="absolute bottom-4 left-4 p-3 bg-black bg-opacity-50 text-white rounded text-sm">
        <div>Move: Arrow Keys / A,D</div>
        <div>Jump: Space / W / Up</div>
        <div>Pause: ESC</div>
        <div>Restart: R</div>
      </div>
    </div>
  );
}
