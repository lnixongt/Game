import { useGameStore } from "../lib/stores/useGameStore";
import { cn } from "../lib/utils";

export function GameOver() {
  const { character, collectiblesCollected, enemiesDefeated, levelCompleted, restartGame } = useGameStore();
  const gameWon = character.lives > 0 && levelCompleted;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="max-w-2xl w-full p-8 bg-gray-800 rounded-lg text-center">
        <h1 className={cn(
          "text-5xl font-bold mb-6",
          gameWon ? "text-green-400" : "text-red-400"
        )}>
          {gameWon ? "Victory!" : "Game Over"}
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-300 text-xl">
            {gameWon 
              ? "Congratulations! You completed all levels!" 
              : "Don't give up! Try again and improve your skills."
            }
          </p>
        </div>
        
        <div className="bg-gray-700 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Stats:</h2>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="col-span-1">
              <p className="text-gray-300 text-lg">
                <span className="font-bold">Final Score:</span> {character.score}
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-bold">Coins Collected:</span> {collectiblesCollected}
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-300 text-lg">
                <span className="font-bold">Enemies Defeated:</span> {enemiesDefeated}
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-bold">Lives Remaining:</span> {character.lives}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <button 
            className={cn(
              "px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
              "text-xl font-bold transition transform hover:scale-105"
            )}
            onClick={restartGame}
          >
            Play Again
          </button>
          <p className="mt-4 text-gray-400">
            Press R to restart
          </p>
        </div>
      </div>
    </div>
  );
}
