// Simple platform game implementation for GitHub Pages
// This file contains all the game logic in a single file for easy hosting

// Game state and constants
const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

const COLORS = {
  SKY: '#87CEEB',
  GRASS: '#4CAF50',
  WOOD: '#8D6E63',
  SAND: '#FDD835',
  ASPHALT: '#607D8B',
  PLAYER: '#FF0000',
  ENEMY: '#800080',
  COIN: '#FFD700',
  FLAG: '#00FF00'
};

// Game class to handle the main game logic
class PlatformGame {
  constructor() {
    // Setup canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.getElementById('root').appendChild(this.canvas);
    
    // Game state
    this.gameState = GAME_STATE.MENU;
    this.currentLevel = 0;
    this.score = 0;
    this.lives = 3;
    this.timeRemaining = 120;
    this.collectiblesCollected = 0;
    this.enemiesDefeated = 0;
    this.levelCompleted = false;
    
    // Player properties
    this.player = {
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      velX: 0,
      velY: 0,
      speed: 5,
      jumping: false,
      facingDirection: 1 // 1 for right, -1 for left
    };
    
    // Input handling
    this.keys = {
      left: false,
      right: false,
      jump: false,
      restart: false
    };
    
    // Load game data
    this.loadLevels();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start the game loop
    this.lastTime = 0;
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  // Load level data
  loadLevels() {
    this.levels = [
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
  }
  
  // Setup all event listeners
  setupEventListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          this.keys.jump = true;
          if (this.gameState === GAME_STATE.MENU) {
            this.startGame();
          }
          break;
        case 'KeyR':
          this.keys.restart = true;
          if (this.gameState === GAME_STATE.GAME_OVER) {
            this.restartGame();
          }
          break;
        case 'Escape':
          if (this.gameState === GAME_STATE.PLAYING) {
            this.gameState = GAME_STATE.PAUSED;
          } else if (this.gameState === GAME_STATE.PAUSED) {
            this.gameState = GAME_STATE.PLAYING;
          }
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          this.keys.jump = false;
          break;
        case 'KeyR':
          this.keys.restart = false;
          break;
      }
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }
  
  // Main game loop
  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and render based on game state
    switch (this.gameState) {
      case GAME_STATE.MENU:
        this.renderMenu();
        break;
      case GAME_STATE.PLAYING:
        this.update(deltaTime);
        this.render();
        break;
      case GAME_STATE.PAUSED:
        this.render();
        this.renderPauseScreen();
        break;
      case GAME_STATE.GAME_OVER:
        this.renderGameOver();
        break;
    }
    
    // Continue the game loop
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  // Update game state
  update(deltaTime) {
    // Update timer
    if (!this.levelCompleted) {
      this.timeRemaining -= deltaTime;
      if (this.timeRemaining <= 0) {
        this.gameOver();
        return;
      }
    }
    
    // Convert 3D coordinates to 2D for rendering
    const scale = 50; // Scale factor for 3D to 2D conversion
    const currentLevel = this.levels[this.currentLevel];
    
    // Update player position based on input
    const GRAVITY = 20;
    const JUMP_FORCE = 7;
    
    if (this.keys.left) {
      this.player.velX = -this.player.speed;
      this.player.facingDirection = -1;
    } else if (this.keys.right) {
      this.player.velX = this.player.speed;
      this.player.facingDirection = 1;
    } else {
      this.player.velX = 0;
    }
    
    // Apply gravity
    this.player.velY -= GRAVITY * deltaTime;
    
    // Handle jump
    if (this.keys.jump && !this.player.jumping) {
      this.player.velY = JUMP_FORCE;
      this.player.jumping = true;
    }
    
    // Update position
    this.player.x += this.player.velX * deltaTime;
    this.player.y += this.player.velY * deltaTime;
    
    // Floor collision check
    if (this.player.y < 0) {
      this.player.y = 0;
      this.player.velY = 0;
      this.player.jumping = false;
    }
    
    // Check if player fell off the level
    if (this.player.y < -5) {
      this.loseLife();
      return;
    }
    
    // Convert 3D coordinates to 2D for rendering
    const playerX = (this.player.x + 10) * scale + this.canvas.width / 2;
    const playerY = this.canvas.height - (this.player.y + 1) * scale;
    
    // Platform collision
    for (const platform of currentLevel.platforms) {
      const platformX = (platform.position[0] + 10) * scale + this.canvas.width / 2;
      const platformY = this.canvas.height - (platform.position[1] + 1) * scale;
      const platformWidth = platform.size[0] * scale;
      const platformHeight = platform.size[1] * scale;
      
      // Check collision
      if (
        playerX + this.player.width > platformX &&
        playerX < platformX + platformWidth &&
        playerY + this.player.height > platformY &&
        playerY + this.player.height < platformY + platformHeight &&
        this.player.velY < 0
      ) {
        this.player.y = (platform.position[1] + platform.size[1]) * 1;
        this.player.velY = 0;
        this.player.jumping = false;
      }
    }
    
    // Enemy collision and update
    for (let i = 0; i < currentLevel.enemies.length; i++) {
      const enemy = currentLevel.enemies[i];
      
      // Skip if enemy is defeated
      if (enemy.defeated) continue;
      
      // Update enemy position
      if (!enemy.direction) enemy.direction = 1;
      
      enemy.position[0] += enemy.direction * enemy.speed * deltaTime;
      
      // Check patrol boundaries
      if (enemy.position[0] > enemy.patrolEnd) {
        enemy.position[0] = enemy.patrolEnd;
        enemy.direction = -1;
      } else if (enemy.position[0] < enemy.patrolStart) {
        enemy.position[0] = enemy.patrolStart;
        enemy.direction = 1;
      }
      
      // Convert enemy position to 2D
      const enemyX = (enemy.position[0] + 10) * scale + this.canvas.width / 2;
      const enemyY = this.canvas.height - (enemy.position[1] + 1) * scale;
      const enemyWidth = 30;
      const enemyHeight = 30;
      
      // Check for collision with player
      const dx = (playerX + this.player.width / 2) - (enemyX + enemyWidth / 2);
      const dy = (playerY + this.player.height / 2) - (enemyY + enemyHeight / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (this.player.width + enemyWidth) / 2) {
        // Player jumped on enemy
        if (this.player.velY < 0 && playerY < enemyY) {
          enemy.defeated = true;
          this.score += 100;
          this.enemiesDefeated++;
          this.player.velY = 5; // Bounce up a bit
        } else {
          // Player hit by enemy
          this.loseLife();
          return;
        }
      }
    }
    
    // Collectible collection
    for (let i = 0; i < currentLevel.collectibles.length; i++) {
      const collectible = currentLevel.collectibles[i];
      
      // Skip if already collected
      if (collectible.collected) continue;
      
      // Convert collectible position to 2D
      const collectibleX = (collectible.position[0] + 10) * scale + this.canvas.width / 2;
      const collectibleY = this.canvas.height - (collectible.position[1] + 1) * scale;
      const collectibleSize = 15;
      
      // Check for collision with player
      const dx = (playerX + this.player.width / 2) - (collectibleX + collectibleSize / 2);
      const dy = (playerY + this.player.height / 2) - (collectibleY + collectibleSize / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (this.player.width + collectibleSize) / 2) {
        collectible.collected = true;
        this.score += collectible.points;
        this.collectiblesCollected++;
        // Play sound (would be added here)
      }
    }
    
    // Check if player reached the level end
    const levelEnd = currentLevel.levelEnd;
    const endX = (levelEnd.position[0] + 10) * scale + this.canvas.width / 2;
    const endY = this.canvas.height - (levelEnd.position[1] + 1) * scale;
    const endWidth = levelEnd.size[0] * scale;
    const endHeight = levelEnd.size[1] * scale;
    
    if (
      playerX + this.player.width > endX &&
      playerX < endX + endWidth &&
      playerY + this.player.height > endY &&
      playerY < endY + endHeight &&
      !this.levelCompleted
    ) {
      this.levelCompleted = true;
      
      // Move to next level after delay
      setTimeout(() => {
        this.nextLevel();
      }, 1500);
    }
  }
  
  // Render the game
  render() {
    // Draw sky background
    this.ctx.fillStyle = COLORS.SKY;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Get current level
    const currentLevel = this.levels[this.currentLevel];
    
    // Convert 3D coordinates to 2D for rendering
    const scale = 50; // Scale factor for 3D to 2D conversion
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
      const x = (platform.position[0] + 10) * scale + this.canvas.width / 2;
      const y = this.canvas.height - (platform.position[1] + 1) * scale;
      const width = platform.size[0] * scale;
      const height = platform.size[1] * scale;
      
      // Set color based on texture
      switch (platform.texture) {
        case 'grass':
          this.ctx.fillStyle = COLORS.GRASS;
          break;
        case 'wood':
          this.ctx.fillStyle = COLORS.WOOD;
          break;
        case 'sand':
          this.ctx.fillStyle = COLORS.SAND;
          break;
        case 'asphalt':
          this.ctx.fillStyle = COLORS.ASPHALT;
          break;
        default:
          this.ctx.fillStyle = COLORS.GRASS;
      }
      
      this.ctx.fillRect(x, y, width, height);
    }
    
    // Draw enemies
    for (const enemy of currentLevel.enemies) {
      if (enemy.defeated) continue;
      
      const x = (enemy.position[0] + 10) * scale + this.canvas.width / 2;
      const y = this.canvas.height - (enemy.position[1] + 1) * scale;
      
      // Draw enemy body
      this.ctx.fillStyle = COLORS.ENEMY;
      this.ctx.fillRect(x, y, 30, 30);
      
      // Draw enemy eyes
      this.ctx.fillStyle = 'white';
      const direction = enemy.direction || 1;
      this.ctx.beginPath();
      this.ctx.arc(x + 15 + (direction * 5), y + 10, 5, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.arc(x + 15 + (direction * 5), y + 10, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw collectibles
    for (const collectible of currentLevel.collectibles) {
      if (collectible.collected) continue;
      
      const x = (collectible.position[0] + 10) * scale + this.canvas.width / 2;
      const y = this.canvas.height - (collectible.position[1] + 1) * scale;
      
      this.ctx.fillStyle = COLORS.COIN;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 15, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw level end flag
    const levelEnd = currentLevel.levelEnd;
    const endX = (levelEnd.position[0] + 10) * scale + this.canvas.width / 2;
    const endY = this.canvas.height - (levelEnd.position[1] + 1) * scale;
    
    // Flag pole
    this.ctx.fillStyle = '#888888';
    this.ctx.fillRect(endX, endY - 100, 5, 100);
    
    // Flag
    this.ctx.fillStyle = COLORS.FLAG;
    this.ctx.beginPath();
    this.ctx.moveTo(endX + 5, endY - 100);
    this.ctx.lineTo(endX + 35, endY - 85);
    this.ctx.lineTo(endX + 5, endY - 70);
    this.ctx.fill();
    
    // Draw player
    const playerX = (this.player.x + 10) * scale + this.canvas.width / 2;
    const playerY = this.canvas.height - (this.player.y + 1) * scale;
    
    this.ctx.fillStyle = COLORS.PLAYER;
    this.ctx.fillRect(playerX, playerY, this.player.width, this.player.height);
    
    // Draw player eyes
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(playerX + 15 + (this.player.facingDirection * 5), playerY + 10, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(playerX + 15 + (this.player.facingDirection * 5), playerY + 10, 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw HUD
    this.renderHUD();
    
    // Draw level completed message
    if (this.levelCompleted) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Level Complete!', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Loading next level...', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
  }
  
  // Render the HUD (Heads Up Display)
  renderHUD() {
    // Background for HUD
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, 50);
    
    // Lives
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Lives: ${this.lives}`, 20, 30);
    
    // Score
    this.ctx.fillText(`Score: ${this.score}`, 150, 30);
    
    // Time
    this.ctx.fillText(`Time: ${Math.ceil(this.timeRemaining)}`, 280, 30);
    
    // Level
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Level: ${this.currentLevel + 1} - ${this.levels[this.currentLevel].name}`, this.canvas.width - 20, 30);
    
    // Collectibles and enemies
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Coins: ${this.collectiblesCollected}`, 20, 70);
    this.ctx.fillText(`Enemies Defeated: ${this.enemiesDefeated}`, 20, 100);
    
    // Controls help
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(10, this.canvas.height - 110, 200, 100);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Controls:', 20, this.canvas.height - 85);
    this.ctx.fillText('Move: Arrow Keys / A,D', 20, this.canvas.height - 65);
    this.ctx.fillText('Jump: Space / W / Up', 20, this.canvas.height - 45);
    this.ctx.fillText('Pause: ESC', 20, this.canvas.height - 25);
  }
  
  // Render menu screen
  renderMenu() {
    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Title
    this.ctx.fillStyle = 'white';
    this.ctx.font = '50px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Platform Adventure', this.canvas.width / 2, 150);
    
    // Instructions
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Embark on a journey through exciting platforming levels.', this.canvas.width / 2, 220);
    this.ctx.fillText('Jump on enemies, collect coins, and reach the flag to complete each level!', this.canvas.width / 2, 260);
    
    // How to play
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(this.canvas.width / 2 - 250, 300, 500, 200);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '28px Arial';
    this.ctx.fillText('How to Play:', this.canvas.width / 2, 340);
    
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('🎮 Move: Arrow Keys or A/D', this.canvas.width / 2 - 200, 380);
    this.ctx.fillText('🦘 Jump: Space, W, or Up Arrow', this.canvas.width / 2 - 200, 410);
    this.ctx.fillText('👾 Defeat Enemies: Jump on their heads!', this.canvas.width / 2 - 200, 440);
    this.ctx.fillText('🎯 Goal: Reach the flag at the end of each level', this.canvas.width / 2 - 200, 470);
    
    // Start prompt
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillRect(this.canvas.width / 2 - 100, 530, 200, 60);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.fillText('Start Game', this.canvas.width / 2, 570);
    
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Press SPACE to start', this.canvas.width / 2, 620);
  }
  
  // Render pause screen
  renderPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Paused', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
  }
  
  // Render game over screen
  renderGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const gameWon = this.lives > 0 && this.currentLevel >= this.levels.length;
    
    // Title
    this.ctx.fillStyle = gameWon ? '#4CAF50' : '#FF0000';
    this.ctx.font = '50px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(gameWon ? 'Victory!' : 'Game Over', this.canvas.width / 2, 150);
    
    // Message
    this.ctx.fillStyle = 'white';
    this.ctx.font = '28px Arial';
    this.ctx.fillText(
      gameWon ? 'Congratulations! You completed all levels!' : 'Don\'t give up! Try again and improve your skills.',
      this.canvas.width / 2, 220
    );
    
    // Stats
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(this.canvas.width / 2 - 200, 270, 400, 200);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '28px Arial';
    this.ctx.fillText('Your Stats:', this.canvas.width / 2, 310);
    
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2 - 150, 350);
    this.ctx.fillText(`Coins Collected: ${this.collectiblesCollected}`, this.canvas.width / 2 - 150, 380);
    this.ctx.fillText(`Enemies Defeated: ${this.enemiesDefeated}`, this.canvas.width / 2 - 150, 410);
    this.ctx.fillText(`Lives Remaining: ${this.lives}`, this.canvas.width / 2 - 150, 440);
    
    // Restart prompt
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillRect(this.canvas.width / 2 - 100, 500, 200, 60);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.fillText('Play Again', this.canvas.width / 2, 540);
    
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Press R to restart', this.canvas.width / 2, 580);
  }
  
  // Start the game
  startGame() {
    this.gameState = GAME_STATE.PLAYING;
    this.currentLevel = 0;
    this.score = 0;
    this.lives = 3;
    this.timeRemaining = 120;
    this.collectiblesCollected = 0;
    this.enemiesDefeated = 0;
    this.levelCompleted = false;
    
    this.resetLevel();
  }
  
  // Reset the current level
  resetLevel() {
    const currentLevel = this.levels[this.currentLevel];
    this.player.x = currentLevel.playerStart[0];
    this.player.y = currentLevel.playerStart[1];
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.jumping = false;
    
    // Reset enemies
    for (const enemy of currentLevel.enemies) {
      enemy.defeated = false;
      enemy.position[0] = enemy.patrolStart;
    }
    
    // Reset collectibles
    for (const collectible of currentLevel.collectibles) {
      collectible.collected = false;
    }
    
    this.levelCompleted = false;
    this.timeRemaining = 120;
  }
  
  // Move to the next level
  nextLevel() {
    this.currentLevel++;
    
    if (this.currentLevel >= this.levels.length) {
      // Game completed
      this.gameState = GAME_STATE.GAME_OVER;
    } else {
      this.resetLevel();
    }
  }
  
  // Lose a life
  loseLife() {
    this.lives--;
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.resetLevel();
    }
  }
  
  // Game over
  gameOver() {
    this.gameState = GAME_STATE.GAME_OVER;
  }
  
  // Restart the game
  restartGame() {
    this.startGame();
  }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
  new PlatformGame();
});