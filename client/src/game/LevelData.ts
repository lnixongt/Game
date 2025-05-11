export interface LevelPlatform {
  position: [number, number, number];
  size: [number, number, number];
  texture?: "grass" | "wood" | "sand" | "asphalt";
}

export interface LevelEnemy {
  position: [number, number, number];
  patrolStart: number;
  patrolEnd: number;
  speed?: number;
}

export interface LevelCollectible {
  position: [number, number, number];
  points: number;
}

export interface LevelData {
  name: string;
  platforms: LevelPlatform[];
  enemies: LevelEnemy[];
  collectibles: LevelCollectible[];
  playerStart: [number, number, number];
  levelEnd: {
    position: [number, number, number];
    size: [number, number, number];
  };
}

export const levelData: LevelData[] = [
  // Level 1: Introduction - Simple platforms, few enemies
  {
    name: "Level 1: The Beginning",
    playerStart: [-10, 1, 0],
    platforms: [
      // Starting platform
      { position: [-10, -0.5, 0], size: [5, 1, 3], texture: "grass" },
      
      // Gap
      { position: [-4, -0.5, 0], size: [2, 1, 3], texture: "grass" },
      
      // Main path
      { position: [0, -0.5, 0], size: [6, 1, 3], texture: "grass" },
      { position: [8, -0.5, 0], size: [6, 1, 3], texture: "grass" },
      { position: [16, -0.5, 0], size: [6, 1, 3], texture: "grass" },
      
      // Higher platform
      { position: [23, 1, 0], size: [3, 1, 3], texture: "wood" },
      
      // End platform
      { position: [28, -0.5, 0], size: [4, 1, 3], texture: "grass" },
    ],
    enemies: [
      { position: [3, 0, 0], patrolStart: 1, patrolEnd: 5, speed: 1.5 },
      { position: [12, 0, 0], patrolStart: 9, patrolEnd: 15, speed: 2 },
    ],
    collectibles: [
      { position: [-7, 1, 0], points: 10 },
      { position: [-2, 1, 0], points: 10 },
      { position: [2, 1, 0], points: 10 },
      { position: [5, 1, 0], points: 10 },
      { position: [10, 1, 0], points: 20 },
      { position: [15, 1, 0], points: 20 },
      { position: [23, 2.5, 0], points: 50 },
    ],
    levelEnd: {
      position: [30, 1, 0],
      size: [1, 2, 3],
    },
  },
  
  // Level 2: Increased difficulty - More gaps, moving platforms
  {
    name: "Level 2: The Challenge",
    playerStart: [-10, 1, 0],
    platforms: [
      // Starting platform
      { position: [-10, -0.5, 0], size: [4, 1, 3], texture: "grass" },
      
      // Jumping challenge
      { position: [-4, -0.5, 0], size: [2, 1, 3], texture: "wood" },
      { position: [0, 0, 0], size: [2, 1, 3], texture: "wood" },
      { position: [4, 0.5, 0], size: [2, 1, 3], texture: "wood" },
      { position: [8, 1, 0], size: [2, 1, 3], texture: "wood" },
      
      // Middle section
      { position: [12, -0.5, 0], size: [4, 1, 3], texture: "grass" },
      { position: [18, -0.5, 0], size: [4, 1, 3], texture: "sand" },
      
      // Elevated section
      { position: [24, 0, 0], size: [3, 1, 3], texture: "wood" },
      { position: [29, 0.5, 0], size: [3, 1, 3], texture: "wood" },
      { position: [34, 1, 0], size: [3, 1, 3], texture: "wood" },
      
      // Final platform
      { position: [39, -0.5, 0], size: [4, 1, 3], texture: "grass" },
    ],
    enemies: [
      { position: [-2, 0, 0], patrolStart: -3, patrolEnd: -1, speed: 2 },
      { position: [14, 0, 0], patrolStart: 10, patrolEnd: 16, speed: 3 },
      { position: [20, 0, 0], patrolStart: 16, patrolEnd: 20, speed: 2.5 },
      { position: [24, 1.5, 0], patrolStart: 22.5, patrolEnd: 25.5, speed: 1.5 },
      { position: [34, 2.5, 0], patrolStart: 32.5, patrolEnd: 35.5, speed: 2 },
    ],
    collectibles: [
      { position: [-8, 1, 0], points: 10 },
      { position: [-2, 1, 0], points: 10 },
      { position: [2, 1.5, 0], points: 20 },
      { position: [6, 2, 0], points: 20 },
      { position: [10, 2.5, 0], points: 30 },
      { position: [15, 1, 0], points: 20 },
      { position: [22, 1.5, 0], points: 30 },
      { position: [27, 2, 0], points: 30 },
      { position: [32, 2.5, 0], points: 40 },
      { position: [37, 3, 0], points: 50 },
    ],
    levelEnd: {
      position: [41, 1, 0],
      size: [1, 2, 3],
    },
  },
  
  // Level 3: Advanced - Complex layout, more enemies, special areas
  {
    name: "Level 3: The Finale",
    playerStart: [-12, 1, 0],
    platforms: [
      // Starting area
      { position: [-12, -0.5, 0], size: [6, 1, 3], texture: "grass" },
      
      // First section - stairs up
      { position: [-4, 0, 0], size: [3, 1, 3], texture: "wood" },
      { position: [0, 1, 0], size: [3, 1, 3], texture: "wood" },
      { position: [4, 2, 0], size: [3, 1, 3], texture: "wood" },
      
      // Upper path
      { position: [9, 2, 0], size: [4, 1, 3], texture: "grass" },
      { position: [15, 2, 0], size: [4, 1, 3], texture: "grass" },
      
      // Drop down
      { position: [20, 0, 0], size: [2, 1, 3], texture: "sand" },
      
      // Lower path
      { position: [24, 0, 0], size: [6, 1, 3], texture: "sand" },
      { position: [32, 0, 0], size: [6, 1, 3], texture: "sand" },
      
      // Climb back up
      { position: [38, 1, 0], size: [2, 1, 3], texture: "wood" },
      { position: [41, 2, 0], size: [2, 1, 3], texture: "wood" },
      { position: [44, 3, 0], size: [2, 1, 3], texture: "wood" },
      
      // Final platform
      { position: [48, 3, 0], size: [6, 1, 3], texture: "grass" },
    ],
    enemies: [
      { position: [-8, 0, 0], patrolStart: -11, patrolEnd: -7, speed: 2 },
      { position: [-2, 1, 0], patrolStart: -4, patrolEnd: -1, speed: 2.5 },
      { position: [2, 2, 0], patrolStart: 0, patrolEnd: 3, speed: 3 },
      { position: [12, 3, 0], patrolStart: 9, patrolEnd: 13, speed: 3.5 },
      { position: [28, 1, 0], patrolStart: 24, patrolEnd: 30, speed: 4 },
      { position: [35, 1, 0], patrolStart: 32, patrolEnd: 37, speed: 4 },
      { position: [50, 4, 0], patrolStart: 47, patrolEnd: 51, speed: 2 },
    ],
    collectibles: [
      { position: [-10, 1, 0], points: 10 },
      { position: [-6, 1, 0], points: 10 },
      { position: [-2, 2, 0], points: 20 },
      { position: [2, 3, 0], points: 20 },
      { position: [6, 3, 0], points: 30 },
      { position: [11, 3.5, 0], points: 30 },
      { position: [15, 3.5, 0], points: 30 },
      { position: [20, 1.5, 0], points: 50 },
      { position: [27, 1.5, 0], points: 30 },
      { position: [33, 1.5, 0], points: 30 },
      { position: [39, 2.5, 0], points: 40 },
      { position: [42, 3.5, 0], points: 40 },
      { position: [45, 4.5, 0], points: 50 },
      { position: [51, 4.5, 0], points: 100 },
    ],
    levelEnd: {
      position: [53, 4, 0],
      size: [1, 2, 3],
    },
  }
];
