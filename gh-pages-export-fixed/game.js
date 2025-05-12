// Improved platform game implementation for GitHub Pages
// Fixed version to address screen movement and glitching issues

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
    this.canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth;
    this.canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight;
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
    
    // Camera
    this.camera = {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      followSpeed: 0.1
    };
    
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
      facingDirection: 1, // 1 for right, -1 for left
      onGround: false
    };
    
    // Physics
    this.gravity = 0.5;
    this.friction = 0.8;
    this.jumpForce = 12;
    
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
    this.fixedDeltaTime = 1/60; // Fixed time step for physics
    this.accumulator = 0;
    
    // Create a loading screen
    this.showLoadingScreen();
    
    // Start after a short delay to let everything initialize
    setTimeout(() => {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }, 500);
  }
  
  // Show loading screen
  showLoadingScreen() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Loading Game...', this.canvas.width / 2, this.canvas.height / 2);
  }
  
  // Load level data
  loadLevels() {
    this.levels = [
      // Level 1: Introduction - Simple platforms, few enemies
      {
        name: "Level 1: The Beginning",
        playerStart: [50, 100], // Changed to 2D coordinates
        platforms: [
          // Starting platform
          { x: 0, y: 200, width: 250, height: 50, color: COLORS.GRASS },
          
          // Gap
          
          // Main path
          { x: 300, y: 200, width: 300, height: 50, color: COLORS.GRASS },
          { x: 650, y: 200, width: 300, height: 50, color: COLORS.GRASS },
          { x: 1000, y: 200, width: 300, height: 50, color: COLORS.GRASS },
          
          // Higher platform
          { x: 1350, y: 150, width: 150, height: 50, color: COLORS.WOOD },
          
          // End platform
          { x: 1550, y: 200, width: 200, height: 50, color: COLORS.GRASS },
        ],
        enemies: [
          { x: 400, y: 170, width: 30, height: 30, patrolStart: 320, patrolEnd: 550, speed: 2 },
          { x: 800, y: 170, width: 30, height: 30, patrolStart: 700, patrolEnd: 950, speed: 3 },
        ],
        collectibles: [
          { x: 100, y: 150, radius: 15, points: 10, collected: false },
          { x: 200, y: 150, radius: 15, points: 10, collected: false },
          { x: 350, y: 150, radius: 15, points: 10, collected: false },
          { x: 500, y: 150, radius: 15, points: 10, collected: false },
          { x: 750, y: 150, radius: 15, points: 20, collected: false },
          { x: 1100, y: 150, radius: 15, points: 20, collected: false },
          { x: 1400, y: 100, radius: 15, points: 50, collected: false },
        ],
        levelEnd: {
          x: 1650,
          y: 100,
          width: 50,
          height: 100,
        },
      },
      
      // Level 2: Increased difficulty - More gaps, moving platforms
      {
        name: "Level 2: The Challenge",
        playerStart: [50, 100],
        platforms: [
          // Starting platform
          { x: 0, y: 200, width: 200, height: 50, color: COLORS.GRASS },
          
          // Jumping challenge
          { x: 250, y: 200, width: 100, height: 50, color: COLORS.WOOD },
          { x: 400, y: 180, width: 100, height: 50, color: COLORS.WOOD },
          { x: 550, y: 160, width: 100, height: 50, color: COLORS.WOOD },
          { x: 700, y: 140, width: 100, height: 50, color: COLORS.WOOD },
          
          // Middle section
          { x: 850, y: 200, width: 200, height: 50, color: COLORS.GRASS },
          { x: 1100, y: 200, width: 200, height: 50, color: COLORS.SAND },
          
          // Elevated section
          { x: 1350, y: 180, width: 150, height: 50, color: COLORS.WOOD },
          { x: 1550, y: 160, width: 150, height: 50, color: COLORS.WOOD },
          { x: 1750, y: 140, width: 150, height: 50, color: COLORS.WOOD },
          
          // Final platform
          { x: 1950, y: 200, width: 200, height: 50, color: COLORS.GRASS },
        ],
        enemies: [
          { x: 150, y: 170, width: 30, height: 30, patrolStart: 50, patrolEnd: 180, speed: 2 },
          { x: 950, y: 170, width: 30, height: 30, patrolStart: 850, patrolEnd: 1000, speed: 3 },
          { x: 1200, y: 170, width: 30, height: 30, patrolStart: 1100, patrolEnd: 1250, speed: 2.5 },
          { x: 1400, y: 150, width: 30, height: 30, patrolStart: 1350, patrolEnd: 1500, speed: 2 },
          { x: 1800, y: 110, width: 30, height: 30, patrolStart: 1750, patrolEnd: 1850, speed: 3 },
        ],
        collectibles: [
          { x: 100, y: 150, radius: 15, points: 10, collected: false },
          { x: 300, y: 150, radius: 15, points: 10, collected: false },
          { x: 450, y: 130, radius: 15, points: 20, collected: false },
          { x: 600, y: 110, radius: 15, points: 20, collected: false },
          { x: 750, y: 90, radius: 15, points: 30, collected: false },
          { x: 950, y: 150, radius: 15, points: 20, collected: false },
          { x: 1250, y: 150, radius: 15, points: 30, collected: false },
          { x: 1450, y: 130, radius: 15, points: 30, collected: false },
          { x: 1650, y: 110, radius: 15, points: 40, collected: false },
          { x: 1850, y: 90, radius: 15, points: 50, collected: false },
        ],
        levelEnd: {
          x: 2050,
          y: 100,
          width: 50,
          height: 100,
        },
      },
      
      // Level 3: Advanced - Complex layout, more enemies, special areas
      {
        name: "Level 3: The Finale",
        playerStart: [50, 100],
        platforms: [
          // Starting area
          { x: 0, y: 200, width: 300, height: 50, color: COLORS.GRASS },
          
          // First section - stairs up
          { x: 350, y: 180, width: 150, height: 50, color: COLORS.WOOD },
          { x: 550, y: 160, width: 150, height: 50, color: COLORS.WOOD },
          { x: 750, y: 140, width: 150, height: 50, color: COLORS.WOOD },
          
          // Upper path
          { x: 950, y: 140, width: 200, height: 50, color: COLORS.GRASS },
          { x: 1200, y: 140, width: 200, height: 50, color: COLORS.GRASS },
          
          // Drop down
          { x: 1450, y: 200, width: 100, height: 50, color: COLORS.SAND },
          
          // Lower path
          { x: 1600, y: 200, width: 300, height: 50, color: COLORS.SAND },
          { x: 1950, y: 200, width: 300, height: 50, color: COLORS.SAND },
          
          // Climb back up
          { x: 2300, y: 180, width: 100, height: 50, color: COLORS.WOOD },
          { x: 2450, y: 160, width: 100, height: 50, color: COLORS.WOOD },
          { x: 2600, y: 140, width: 100, height: 50, color: COLORS.WOOD },
          
          // Final platform
          { x: 2750, y: 140, width: 300, height: 50, color: COLORS.GRASS },
        ],
        enemies: [
          { x: 200, y: 170, width: 30, height: 30, patrolStart: 50, patrolEnd: 250, speed: 2 },
          { x: 450, y: 150, width: 30, height: 30, patrolStart: 350, patrolEnd: 500, speed: 2.5 },
          { x: 650, y: 130, width: 30, height: 30, patrolStart: 550, patrolEnd: 700, speed: 3 },
          { x: 1050, y: 110, width: 30, height: 30, patrolStart: 950, patrolEnd: 1150, speed: 3.5 },
          { x: 1750, y: 170, width: 30, height: 30, patrolStart: 1600, patrolEnd: 1850, speed: 4 },
          { x: 2100, y: 170, width: 30, height: 30, patrolStart: 1950, patrolEnd: 2200, speed: 4 },
          { x: 2900, y: 110, width: 30, height: 30, patrolStart: 2750, patrolEnd: 3000, speed: 3 },
        ],
        collectibles: [
          { x: 100, y: 150, radius: 15, points: 10, collected: false },
          { x: 250, y: 150, radius: 15, points: 10, collected: false },
          { x: 400, y: 130, radius: 15, points: 20, collected: false },
          { x: 600, y: 110, radius: 15, points: 20, collected: false },
          { x: 800, y: 90, radius: 15, points: 30, collected: false },
          { x: 1000, y: 90, radius: 15, points: 30, collected: false },
          { x: 1300, y: 90, radius: 15, points: 30, collected: false },
          { x: 1500, y: 150, radius: 15, points: 50, collected: false },
          { x: 1750, y: 150, radius: 15, points: 30, collected: false },
          { x: 2100, y: 150, radius: 15, points: 30, collected: false },
          { x: 2350, y: 130, radius: 15, points: 40, collected: false },
          { x: 2500, y: 110, radius: 15, points: 40, collected: false },
          { x: 2650, y: 90, radius: 15, points: 50, collected: false },
          { x: 2900, y: 90, radius: 15, points: 100, collected: false },
        ],
        levelEnd: {
          x: 3000,
          y: 40,
          width: 50,
          height: 100,
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
      // Keep a fixed size to avoid layout shifts
      const newWidth = window.innerWidth > 800 ? 800 : window.innerWidth;
      const newHeight = window.innerHeight > 600 ? 600 : window.innerHeight;
      
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      
      this.camera.width = newWidth;
      this.camera.height = newHeight;
    });
    
    // Add touch controls for mobile
    this.setupTouchControls();
  }
  
  // Setup touch controls for mobile devices
  setupTouchControls() {
    // Create touch controls container
    const touchControls = document.createElement('div');
    touchControls.style.position = 'absolute';
    touchControls.style.bottom = '20px';
    touchControls.style.left = '0';
    touchControls.style.width = '100%';
    touchControls.style.display = 'flex';
    touchControls.style.justifyContent = 'space-between';
    touchControls.style.padding = '0 20px';
    touchControls.style.boxSizing = 'border-box';
    touchControls.style.pointerEvents = 'none';
    document.getElementById('root').appendChild(touchControls);
    
    // Create left button
    const leftBtn = document.createElement('button');
    leftBtn.innerText = '←';
    leftBtn.style.width = '60px';
    leftBtn.style.height = '60px';
    leftBtn.style.fontSize = '24px';
    leftBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    leftBtn.style.color = 'white';
    leftBtn.style.border = 'none';
    leftBtn.style.borderRadius = '50%';
    leftBtn.style.pointerEvents = 'auto';
    touchControls.appendChild(leftBtn);
    
    // Create jump button
    const jumpBtn = document.createElement('button');
    jumpBtn.innerText = '↑';
    jumpBtn.style.width = '60px';
    jumpBtn.style.height = '60px';
    jumpBtn.style.fontSize = '24px';
    jumpBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    jumpBtn.style.color = 'white';
    jumpBtn.style.border = 'none';
    jumpBtn.style.borderRadius = '50%';
    jumpBtn.style.pointerEvents = 'auto';
    touchControls.appendChild(jumpBtn);
    
    // Create right button
    const rightBtn = document.createElement('button');
    rightBtn.innerText = '→';
    rightBtn.style.width = '60px';
    rightBtn.style.height = '60px';
    rightBtn.style.fontSize = '24px';
    rightBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    rightBtn.style.color = 'white';
    rightBtn.style.border = 'none';
    rightBtn.style.borderRadius = '50%';
    rightBtn.style.pointerEvents = 'auto';
    touchControls.appendChild(rightBtn);
    
    // Add event listeners for touch buttons
    leftBtn.addEventListener('touchstart', () => this.keys.left = true);
    leftBtn.addEventListener('touchend', () => this.keys.left = false);
    
    jumpBtn.addEventListener('touchstart', () => {
      this.keys.jump = true;
      if (this.gameState === GAME_STATE.MENU) {
        this.startGame();
      }
    });
    jumpBtn.addEventListener('touchend', () => this.keys.jump = false);
    
    rightBtn.addEventListener('touchstart', () => this.keys.right = true);
    rightBtn.addEventListener('touchend', () => this.keys.right = false);
  }
  
  // Main game loop
  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    // Limit delta time to prevent large jumps
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    
    // Accumulate time for fixed time step
    this.accumulator += cappedDeltaTime;
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and render based on game state
    switch (this.gameState) {
      case GAME_STATE.MENU:
        this.renderMenu();
        break;
      
      case GAME_STATE.PLAYING:
        // Use fixed time step for physics
        while (this.accumulator >= this.fixedDeltaTime) {
          this.update(this.fixedDeltaTime);
          this.accumulator -= this.fixedDeltaTime;
        }
        
        // Decrease time
        if (!this.levelCompleted) {
          this.timeRemaining -= cappedDeltaTime;
          if (this.timeRemaining <= 0) {
            this.gameOver();
          }
        }
        
        this.render(cappedDeltaTime);
        break;
      
      case GAME_STATE.PAUSED:
        this.render(0);
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
    // Get current level
    const currentLevel = this.levels[this.currentLevel];
    
    // Skip if level is completed
    if (this.levelCompleted) return;
    
    // Update player position based on input
    if (this.keys.left) {
      this.player.velX = -this.player.speed;
      this.player.facingDirection = -1;
    } else if (this.keys.right) {
      this.player.velX = this.player.speed;
      this.player.facingDirection = 1;
    } else {
      // Apply friction to slow down player when not pressing movement keys
      this.player.velX *= this.friction;
    }
    
    // Limit horizontal velocity to prevent excessive speed
    if (this.player.velX > 10) this.player.velX = 10;
    if (this.player.velX < -10) this.player.velX = -10;
    
    // Apply gravity
    this.player.velY += this.gravity;
    
    // Handle jump
    if (this.keys.jump && this.player.onGround) {
      this.player.velY = -this.jumpForce;
      this.player.onGround = false;
      this.player.jumping = true;
    }
    
    // Update position
    this.player.x += this.player.velX;
    this.player.y += this.player.velY;
    
    // Initial assumption
    this.player.onGround = false;
    
    // Check if player fell off the bottom of the screen
    if (this.player.y > this.canvas.height + 200) {
      this.loseLife();
      return;
    }
    
    // Platform collision
    for (const platform of currentLevel.platforms) {
      // Check if player is on this platform
      if (
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x + platform.width &&
        this.player.y + this.player.height > platform.y &&
        this.player.y + this.player.height < platform.y + platform.height / 2 &&
        this.player.velY >= 0
      ) {
        // Landing on platform
        this.player.y = platform.y - this.player.height;
        this.player.velY = 0;
        this.player.onGround = true;
        this.player.jumping = false;
      }
      
      // Head collision (if jumping up into a platform)
      else if (
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x + platform.width &&
        this.player.y < platform.y + platform.height &&
        this.player.y > platform.y + platform.height / 2 &&
        this.player.velY < 0
      ) {
        this.player.y = platform.y + platform.height;
        this.player.velY = 0;
      }
      
      // Side collision (left)
      else if (
        this.player.x < platform.x + platform.width &&
        this.player.x + this.player.width > platform.x + platform.width &&
        this.player.y + this.player.height > platform.y &&
        this.player.y < platform.y + platform.height &&
        this.player.velX < 0
      ) {
        this.player.x = platform.x + platform.width;
        this.player.velX = 0;
      }
      
      // Side collision (right)
      else if (
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x &&
        this.player.y + this.player.height > platform.y &&
        this.player.y < platform.y + platform.height &&
        this.player.velX > 0
      ) {
        this.player.x = platform.x - this.player.width;
        this.player.velX = 0;
      }
    }
    
    // Enemy collision and update
    for (let i = 0; i < currentLevel.enemies.length; i++) {
      const enemy = currentLevel.enemies[i];
      
      // Skip if enemy is defeated
      if (enemy.defeated) continue;
      
      // Update enemy position
      if (!enemy.direction) enemy.direction = 1;
      
      enemy.x += enemy.direction * enemy.speed;
      
      // Check patrol boundaries
      if (enemy.x > enemy.patrolEnd) {
        enemy.x = enemy.patrolEnd;
        enemy.direction = -1;
      } else if (enemy.x < enemy.patrolStart) {
        enemy.x = enemy.patrolStart;
        enemy.direction = 1;
      }
      
      // Check for collision with player
      if (
        this.player.x + this.player.width > enemy.x &&
        this.player.x < enemy.x + enemy.width &&
        this.player.y + this.player.height > enemy.y &&
        this.player.y < enemy.y + enemy.height
      ) {
        // Player jumped on enemy from above
        if (this.player.velY > 0 && this.player.y < enemy.y) {
          enemy.defeated = true;
          this.score += 100;
          this.enemiesDefeated++;
          this.player.velY = -8; // Bounce up after defeating enemy
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
      
      // Check for collision with player (circle-rectangle collision)
      const distX = Math.abs(collectible.x - (this.player.x + this.player.width/2));
      const distY = Math.abs(collectible.y - (this.player.y + this.player.height/2));
      
      if (
        distX <= (this.player.width/2 + collectible.radius) &&
        distY <= (this.player.height/2 + collectible.radius)
      ) {
        collectible.collected = true;
        this.score += collectible.points;
        this.collectiblesCollected++;
      }
    }
    
    // Check if player reached the level end
    const levelEnd = currentLevel.levelEnd;
    
    if (
      this.player.x + this.player.width > levelEnd.x &&
      this.player.x < levelEnd.x + levelEnd.width &&
      this.player.y + this.player.height > levelEnd.y &&
      this.player.y < levelEnd.y + levelEnd.height &&
      !this.levelCompleted
    ) {
      this.levelCompleted = true;
      
      // Move to next level after delay
      setTimeout(() => {
        this.nextLevel();
      }, 1500);
    }
    
    // Update camera position to follow player
    this.updateCamera();
  }
  
  // Update camera position to follow player
  updateCamera() {
    // Target position is centered on player
    const targetX = this.player.x - this.camera.width / 2 + this.player.width / 2;
    
    // Smoothly move camera toward target
    this.camera.x += (targetX - this.camera.x) * this.camera.followSpeed;
    
    // Clamp camera to level bounds
    if (this.camera.x < 0) {
      this.camera.x = 0;
    }
  }
  
  // Render the game
  render(deltaTime) {
    const currentLevel = this.levels[this.currentLevel];
    
    // Draw sky background
    this.ctx.fillStyle = COLORS.SKY;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Save context to apply camera transform
    this.ctx.save();
    
    // Apply camera translation
    this.ctx.translate(-this.camera.x, 0);
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
      // Skip if platform is far outside the camera view
      if (
        platform.x + platform.width < this.camera.x ||
        platform.x > this.camera.x + this.camera.width
      ) {
        continue;
      }
      
      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw enemies
    for (const enemy of currentLevel.enemies) {
      if (enemy.defeated) continue;
      
      // Skip if enemy is far outside the camera view
      if (
        enemy.x + enemy.width < this.camera.x ||
        enemy.x > this.camera.x + this.camera.width
      ) {
        continue;
      }
      
      // Draw enemy body
      this.ctx.fillStyle = COLORS.ENEMY;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Draw enemy eyes
      this.ctx.fillStyle = 'white';
      const direction = enemy.direction || 1;
      
      // Right eye
      this.ctx.beginPath();
      this.ctx.arc(
        enemy.x + enemy.width/2 + (direction * 5),
        enemy.y + enemy.height/3,
        5,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      
      // Pupil
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.arc(
        enemy.x + enemy.width/2 + (direction * 6),
        enemy.y + enemy.height/3,
        2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    
    // Draw collectibles
    for (const collectible of currentLevel.collectibles) {
      if (collectible.collected) continue;
      
      // Skip if collectible is far outside the camera view
      if (
        collectible.x + collectible.radius < this.camera.x ||
        collectible.x - collectible.radius > this.camera.x + this.camera.width
      ) {
        continue;
      }
      
      // Draw spinning coin effect
      const coinWidth = Math.abs(Math.sin(Date.now() / 200)) * collectible.radius * 2;
      
      // Gold gradient
      const gradient = this.ctx.createRadialGradient(
        collectible.x, collectible.y, 0,
        collectible.x, collectible.y, collectible.radius
      );
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(1, '#FFA500');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.ellipse(
        collectible.x,
        collectible.y,
        coinWidth,
        collectible.radius,
        0,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      
      // Shine effect
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.beginPath();
      this.ctx.ellipse(
        collectible.x - collectible.radius/3,
        collectible.y - collectible.radius/3,
        coinWidth/4,
        collectible.radius/4,
        0,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    
    // Draw level end flag
    const levelEnd = currentLevel.levelEnd;
    
    // Flag pole
    this.ctx.fillStyle = '#888888';
    this.ctx.fillRect(levelEnd.x, levelEnd.y, 5, 100);
    
    // Flag
    this.ctx.fillStyle = COLORS.FLAG;
    this.ctx.beginPath();
    this.ctx.moveTo(levelEnd.x + 5, levelEnd.y);
    this.ctx.lineTo(levelEnd.x + 35, levelEnd.y + 15);
    this.ctx.lineTo(levelEnd.x + 5, levelEnd.y + 30);
    this.ctx.fill();
    
    // Draw player
    this.ctx.fillStyle = COLORS.PLAYER;
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );
    
    // Draw player eyes
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.x + this.player.width/2 + (this.player.facingDirection * 5),
      this.player.y + this.player.height/3,
      5,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.x + this.player.width/2 + (this.player.facingDirection * 6),
      this.player.y + this.player.height/3,
      2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Restore context for fixed UI elements
    this.ctx.restore();
    
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
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
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
    
    // Collectibles and enemies - show in a separate box
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 60, 180, 70);
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`Coins: ${this.collectiblesCollected}`, 20, 85);
    this.ctx.fillText(`Enemies Defeated: ${this.enemiesDefeated}`, 20, 115);
    
    // Controls help
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
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
    this.ctx.font = 'bold 40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Platform Adventure', this.canvas.width / 2, 120);
    
    // Instructions
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Jump on enemies, collect coins, and reach the flag!', this.canvas.width / 2, 170);
    
    // How to play
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(this.canvas.width / 2 - 180, 200, 360, 160);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillText('How to Play:', this.canvas.width / 2, 230);
    
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'left';
    const controlsX = this.canvas.width / 2 - 150;
    this.ctx.fillText('• Move: Arrow Keys or A/D', controlsX, 260);
    this.ctx.fillText('• Jump: Space, W, or Up Arrow', controlsX, 290);
    this.ctx.fillText('• Defeat Enemies: Jump on their heads', controlsX, 320);
    this.ctx.fillText('• Goal: Reach the flag at the end of each level', controlsX, 350);
    
    // Start prompt
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = COLORS.GRASS;
    this.ctx.fillRect(this.canvas.width / 2 - 100, 400, 200, 60);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillText('Start Game', this.canvas.width / 2, 440);
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Press SPACE to start', this.canvas.width / 2, 480);
    
    // Animated player character in menu
    const time = Date.now() / 1000;
    const playerX = this.canvas.width / 2 - 15 + Math.sin(time) * 30; // Oscillate left/right
    const playerY = 520 + Math.abs(Math.sin(time * 2)) * 20; // Bounce up/down
    
    this.ctx.fillStyle = COLORS.PLAYER;
    this.ctx.fillRect(playerX, playerY, 30, 30);
    
    // Player eyes
    const facingDirection = Math.sin(time) > 0 ? 1 : -1;
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(playerX + 15 + (facingDirection * 5), playerY + 10, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(playerX + 15 + (facingDirection * 6), playerY + 10, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  // Render pause screen
  renderPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Paused', this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }
  
  // Render game over screen
  renderGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const gameWon = this.lives > 0 && this.currentLevel >= this.levels.length;
    
    // Title
    this.ctx.fillStyle = gameWon ? COLORS.GRASS : '#FF4444';
    this.ctx.font = 'bold 50px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(gameWon ? 'Victory!' : 'Game Over', this.canvas.width / 2, 130);
    
    // Message
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(
      gameWon ? 'Congratulations! You completed all levels!' : 'Better luck next time!',
      this.canvas.width / 2, 180
    );
    
    // Stats
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(this.canvas.width / 2 - 150, 210, 300, 180);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillText('Your Stats:', this.canvas.width / 2, 240);
    
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    const statsX = this.canvas.width / 2 - 130;
    this.ctx.fillText(`Final Score: ${this.score}`, statsX, 280);
    this.ctx.fillText(`Coins Collected: ${this.collectiblesCollected}`, statsX, 310);
    this.ctx.fillText(`Enemies Defeated: ${this.enemiesDefeated}`, statsX, 340);
    this.ctx.fillText(`Lives Remaining: ${this.lives}`, statsX, 370);
    
    // Restart prompt
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#4488FF';
    this.ctx.fillRect(this.canvas.width / 2 - 100, 420, 200, 60);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 26px Arial';
    this.ctx.fillText('Play Again', this.canvas.width / 2, 460);
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Press R to restart', this.canvas.width / 2, 500);
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
    
    // Reset player
    this.player.x = currentLevel.playerStart[0];
    this.player.y = currentLevel.playerStart[1];
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.jumping = false;
    this.player.onGround = false;
    
    // Reset camera
    this.camera.x = Math.max(0, this.player.x - this.canvas.width / 2);
    
    // Reset enemies
    for (const enemy of currentLevel.enemies) {
      enemy.defeated = false;
      enemy.x = enemy.patrolStart;
      enemy.direction = 1;
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
      // Game completed - success!
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
  // Add custom styling to make the game look centered and visually appealing
  const rootElement = document.getElementById('root');
  rootElement.style.display = 'flex';
  rootElement.style.justifyContent = 'center';
  rootElement.style.alignItems = 'center';
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
  rootElement.style.backgroundColor = '#333';
  rootElement.style.position = 'relative';
  
  // Initialize the game
  new PlatformGame();
});