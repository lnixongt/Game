import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStore } from "../lib/stores/useGameStore";
import { cn } from "../lib/utils";

export function Menu() {
  const startGame = useGameStore((state) => state.startGame);
  const jumpPressed = useKeyboardControls(state => state.jump);
  
  // Start game when pressing jump on the main menu
  useEffect(() => {
    if (jumpPressed) {
      startGame();
    }
  }, [jumpPressed, startGame]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="max-w-2xl w-full p-8 bg-gray-800 rounded-lg text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Platform Adventure</h1>
        
        <div className="mb-8">
          <p className="text-gray-300 text-lg">
            Embark on a journey through exciting platforming levels. 
            Jump on enemies, collect coins, and reach the flag to complete each level!
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-2">How to Play:</h2>
          <ul className="text-gray-300 text-left space-y-2">
            <li>🎮 <span className="font-bold">Move:</span> Arrow Keys or A/D</li>
            <li>🦘 <span className="font-bold">Jump:</span> Space, W, or Up Arrow</li>
            <li>👾 <span className="font-bold">Defeat Enemies:</span> Jump on their heads!</li>
            <li>🎯 <span className="font-bold">Goal:</span> Reach the flag at the end of each level</li>
            <li>⏱️ <span className="font-bold">Complete:</span> 3 challenging levels before time runs out</li>
          </ul>
        </div>
        
        <div className="flex flex-col items-center">
          <button 
            className={cn(
              "px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg",
              "text-xl font-bold transition transform hover:scale-105"
            )}
            onClick={startGame}
          >
            Start Game
          </button>
          <p className="mt-4 text-gray-400">
            Press SPACE to start
          </p>
        </div>
      </div>
    </div>
  );
}
