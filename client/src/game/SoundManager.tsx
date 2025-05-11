import { useEffect } from "react";
import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";

export function SoundManager() {
  const gameState = useGameStore((state) => state.gameState);
  const { 
    backgroundMusic,
    toggleMute,
    isMuted
  } = useAudio();

  // Handle background music based on game state
  useEffect(() => {
    if (!backgroundMusic) return;
    
    // Try to play background music when game is playing
    if (gameState === "playing") {
      if (!isMuted) {
        // Use a timeout to ensure browser interaction requirement is met
        setTimeout(() => {
          backgroundMusic.play().catch(error => {
            console.log("Background music play prevented:", error);
          });
        }, 500);
      }
    } else {
      // Pause when not playing
      backgroundMusic.pause();
    }
    
    // Clean up
    return () => {
      backgroundMusic.pause();
    };
  }, [gameState, backgroundMusic, isMuted]);

  return (
    <div className="absolute bottom-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded-full">
      <button
        className="w-10 h-10 flex items-center justify-center text-white"
        onClick={toggleMute}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
