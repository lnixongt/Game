import { create } from "zustand";

export type GameState = "menu" | "playing" | "paused" | "gameOver";

export interface Character {
  lives: number;
  score: number;
}

interface GameStore {
  // Game State
  gameState: GameState;
  currentLevel: number;
  character: Character;
  totalLevels: number;
  timeRemaining: number;
  
  // Stats
  collectiblesCollected: number;
  enemiesDefeated: number;
  
  // Win Condition
  levelCompleted: boolean;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  
  // Level management
  nextLevel: () => void;
  setCurrentLevel: (level: number) => void;
  
  // Character actions
  loseLife: () => void;
  addScore: (points: number) => void;
  
  // Collectible tracking
  addCollectible: () => void;
  
  // Enemy tracking
  addDefeatedEnemy: () => void;
  
  // Time management
  setTimeRemaining: (time: number) => void;
  decreaseTime: () => void;
  
  // Level completion
  completedLevel: () => void;
  resetLevelCompletion: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  gameState: "menu",
  currentLevel: 0,
  character: {
    lives: 3,
    score: 0,
  },
  totalLevels: 3,
  timeRemaining: 120,
  collectiblesCollected: 0,
  enemiesDefeated: 0,
  levelCompleted: false,
  
  // Game state actions
  startGame: () => set({ 
    gameState: "playing",
    currentLevel: 0,
    character: { lives: 3, score: 0 },
    collectiblesCollected: 0,
    enemiesDefeated: 0,
    timeRemaining: 120,
    levelCompleted: false,
  }),
  
  restartGame: () => set({ 
    gameState: "playing", 
    character: { lives: 3, score: 0 },
    collectiblesCollected: 0,
    enemiesDefeated: 0,
    currentLevel: 0,
    timeRemaining: 120,
    levelCompleted: false,
  }),
  
  pauseGame: () => set({ gameState: "paused" }),
  
  resumeGame: () => set({ gameState: "playing" }),
  
  gameOver: () => set({ gameState: "gameOver" }),
  
  // Level management
  nextLevel: () => set((state) => {
    const nextLevel = state.currentLevel + 1;
    
    if (nextLevel >= state.totalLevels) {
      // Game completed - go to game over with success
      return { 
        gameState: "gameOver",
        levelCompleted: true
      };
    }
    
    return { 
      currentLevel: nextLevel,
      timeRemaining: 120,
      levelCompleted: false
    };
  }),
  
  setCurrentLevel: (level) => set({ 
    currentLevel: level,
    timeRemaining: 120,
    levelCompleted: false
  }),
  
  // Character actions
  loseLife: () => set((state) => {
    const newLives = state.character.lives - 1;
    
    if (newLives <= 0) {
      return {
        character: { ...state.character, lives: 0 },
        gameState: "gameOver",
      };
    }
    
    return {
      character: { ...state.character, lives: newLives },
    };
  }),
  
  addScore: (points) => set((state) => ({
    character: { ...state.character, score: state.character.score + points },
  })),
  
  // Collectible and enemy tracking
  addCollectible: () => set((state) => ({
    collectiblesCollected: state.collectiblesCollected + 1,
  })),
  
  addDefeatedEnemy: () => set((state) => ({
    enemiesDefeated: state.enemiesDefeated + 1,
  })),
  
  // Time management
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  decreaseTime: () => set((state) => {
    const newTime = state.timeRemaining - 1;
    
    if (newTime <= 0 && state.gameState === "playing") {
      return {
        timeRemaining: 0,
        gameState: "gameOver",
      };
    }
    
    return { timeRemaining: newTime };
  }),
  
  // Level completion
  completedLevel: () => set({ levelCompleted: true }),
  resetLevelCompletion: () => set({ levelCompleted: false }),
}));
