// Initialize particles.js for the starfield effect
document.addEventListener('DOMContentLoaded', () => {
    // Particles initialization
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 150,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.3,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 100,
                    size: 6,
                    duration: 0.3
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Initialize all components
    initAudio();
    initCountdown();
    initMemories();
    initWishSystem();
    initGame();
});

// Audio Controller
class AudioController {
    constructor() {
        this.initialized = false;
        this.isMuted = localStorage.getItem('audioMuted') === 'true';
        this.audioElement = document.getElementById('bgMusic');
        this.toggleButton = document.getElementById('audioToggle');
        // Set default volume to 30%
        if (this.audioElement) {
            this.audioElement.volume = 0.4;
        }
    }

    init() {
        if (this.initialized) return;

        if (!this.audioElement || !this.toggleButton) {
            console.error('Audio elements not found');
            return;
        }

        // Set initial state based on stored preference
        this.updateToggleButton();
        this.setupEventListeners();
        
        // Initialize audio only after user interaction
        document.addEventListener('click', () => {
            if (!this.initialized && !this.isMuted) {
                this.playAudio();
                this.initialized = true;
            }
        }, { once: true });

        this.initialized = true;
    }

    updateToggleButton() {
        if (!this.toggleButton) return;
        this.toggleButton.querySelector('span').textContent = this.isMuted ? '🔇' : '🔊';
        localStorage.setItem('audioMuted', this.isMuted);
    }

    setupEventListeners() {
        if (!this.toggleButton) return;

        this.toggleButton.addEventListener('click', () => {
            this.toggleAudio();
        });
    }

    async playAudio() {
        if (!this.audioElement) return;
        this.isMuted = false;
        this.updateToggleButton();
        try {
            await this.audioElement.play();
        } catch (error) {
            console.log('Audio play failed:', error);
            // Optionally show a message to the user here
        }
    }

    toggleAudio() {
        if (!this.audioElement) return;
        if (this.isMuted) {
            this.isMuted = false;
            this.updateToggleButton();
            this.playAudio();
        } else {
            this.audioElement.pause();
            this.isMuted = true;
            this.updateToggleButton();
        }
    }
}

// Initialize audio controller
function initAudio() {
    const audioController = new AudioController();
    audioController.init();
    window.audioController = audioController; // Make it globally accessible
}

// Countdown Timer
function initCountdown() {
    const countdown = document.getElementById('countdown');
    const birthdayContent = document.getElementById('birthdayContent');
    
    // Get the birthday date - defaults to today if not set
    // For a real application, you would set this to the specific date
    // const birthdayDate = new Date('YYYY-MM-DDT00:00:00').getTime();
    
    // For demo purposes, let's set a short countdown (10 seconds from now)
    const birthdayDate = new Date("2025-07-05");
    birthdayDate.setSeconds(birthdayDate.getSeconds());
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = birthdayDate.getTime() - now;

        // Calculate time components
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the countdown display
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // If the countdown is over, show birthday content
        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdown && birthdayContent) {
                countdown.style.display = 'none';
                birthdayContent.classList.remove('hidden');
                setTimeout(() => birthdayContent.classList.add('visible'), 100);
                startBirthdayCelebration();
            }
        }
    }

    // Update the countdown every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Typing Animation
function typeMessage() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = "Happy Birthday! Nadia ❤️🎂✨";
    let index = 0;

    typingText.textContent = ''; // Clear any existing text
    
    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }

    type();
}

// Memories
function initMemories() {
    const memories = [
        "Can’t wait to make more memories—with you, in person soon 💫",
        "When your voice made everything feel okay, even from afar 🎧❤️",
        "Our first movie together 🍿",
        "Love you! ❤️",
    ];

    const bubbleContainer = document.querySelector('.memory-bubbles');
    if (!bubbleContainer) return;

    // Clear any existing bubbles
    bubbleContainer.innerHTML = '';

    // Calculate optimal positions for the bubbles (single orbit, evenly spaced, no overlap)
    const memoryOrbit = document.querySelector('.memory-orbit');
    let containerW = 300, containerH = 300;
    if (memoryOrbit) {
        containerW = memoryOrbit.offsetWidth;
        containerH = memoryOrbit.offsetHeight;
    }
    // For wide screens, use width for radius and a larger orbit factor
    let orbitFactor = 0.45;
    let radius;
    if (containerW > containerH) {
        orbitFactor = 0.6; // increase for wide screens
        radius = containerH * orbitFactor;
    } else {
        radius = containerW * orbitFactor;
    }
    const minAngle = (2 * Math.PI) / memories.length;

    memories.forEach((memory, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'memory-bubble';
        bubble.textContent = memory;

        // Evenly distribute bubbles around the orbit
        const angle = index * minAngle;

        // Position relative to container center
        bubble.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
        bubble.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;

        // Add a small random rotation to each bubble for a natural look
        const rotation = Math.random() * 10 - 5; // Random rotation between -5 and 5 degrees
        bubble.style.transform = `rotate(${rotation}deg)`;

        bubbleContainer.appendChild(bubble);
    });
    
    // Add window resize listener to reposition bubbles when window size changes
    window.addEventListener('resize', debounce(() => {
        // Rerun the initialization to reposition bubbles
        initMemories();
    }, 250));
}

// Debounce function to prevent excessive function calls during resize
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Wish System
function initWishSystem() {
    const wishInput = document.getElementById('wishInput');
    const makeWishBtn = document.getElementById('makeWish');

    if (wishInput && makeWishBtn) {
        makeWishBtn.addEventListener('click', () => {
            if (wishInput.value.trim() !== '') {
                launchWish(wishInput.value);
                wishInput.value = '';
            }
        });

        // Also allow Enter key to submit
        wishInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && wishInput.value.trim() !== '') {
                launchWish(wishInput.value);
                wishInput.value = '';
            }
        });
    }
}

function launchWish(wish) {
    // Create a star element
    const wishStar = document.createElement('div');
    wishStar.className = 'wish-star';
    wishStar.textContent = '⭐';
    wishStar.style.position = 'fixed';
    wishStar.style.left = Math.random() * 80 + 10 + '%';
    wishStar.style.bottom = '0';
    wishStar.style.fontSize = '2rem';
    wishStar.style.zIndex = '100';
    wishStar.style.color = 'gold';
    wishStar.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    document.body.appendChild(wishStar);

    // Animate it going up
    gsap.to(wishStar, {
        y: -window.innerHeight,
        duration: 4,
        ease: 'power1.out',
        onComplete: () => wishStar.remove()
    });
    
    // Show a confirmation message
    const wishConfirm = document.createElement('div');
    wishConfirm.textContent = 'Wish sent to the stars! ✨';
    wishConfirm.style.position = 'fixed';
    wishConfirm.style.bottom = '20px';
    wishConfirm.style.left = '50%';
    wishConfirm.style.transform = 'translateX(-50%)';
    wishConfirm.style.background = 'rgba(0, 0, 0, 0.7)';
    wishConfirm.style.color = 'white';
    wishConfirm.style.padding = '10px 20px';
    wishConfirm.style.borderRadius = '20px';
    wishConfirm.style.zIndex = '1000';
    document.body.appendChild(wishConfirm);
    
    // Remove the confirmation after 3 seconds
    setTimeout(() => {
        gsap.to(wishConfirm, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => wishConfirm.remove()
        });
    }, 3000);
}

// Start birthday celebration effects
function startBirthdayCelebration() {
    typeMessage();
}

// Birthday Game
function initGame() {
    let gameArea, startGameBtn;
    let score = 0;
    let level = 1;
    let gameTimer;
    let timeLeft = 30;
    let activeItems = [];
    let pointMultiplier = 1;
    let pointsForNextLevel = 100; // Initial points needed for level 2
    
    // Game initialization
    const gameInit = () => {
        gameArea = document.getElementById('gameArea');
        startGameBtn = document.getElementById('startGame');
        
        if (startGameBtn && gameArea) {
            startGameBtn.addEventListener('click', () => {
                gameArea.classList.remove('hidden');
                startGameBtn.classList.add('hidden');
                startNewGame();
            });
        }
    };
    
    // Initialize the game
    gameInit();
    
    // Game items configuration
    const cosmicItems = {
        star: { emoji: '⭐', points: 10, speed: 1 },
        heart: { emoji: '💖', points: 50, speed: 1.2 },
        gift: { emoji: '🎁', points: 30, speed: 0.8 },
        cake: { emoji: '🎂', points: 40, speed: 0.9 },
        balloon: { emoji: '🎈', points: 20, speed: 1.5 },
        shield: { emoji: '🛡️', points: 5, speed: 1, effect: 'shield' },
        clock: { emoji: '⏰', points: 5, speed: 1.8, effect: 'time' },
        multiplier: { emoji: '✖️', points: 5, speed: 1.5, effect: 'multiplier' }
    };
    
    // Start a new game
    function startNewGame() {
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 767;
        
        // Create game layout
        gameArea.innerHTML = `
            <div class="game-stats">
                <div><span class="stat-label">LEVEL</span> <span id="levelDisplay" class="stat-value">${level}</span></div>
                <div><span class="stat-label">SCORE</span> <span id="scoreDisplay" class="stat-value">${score}</span>/<span id="nextLevelPoints">${pointsForNextLevel}</span></div>
                <div><span class="stat-label">TIME</span> <span id="timeDisplay" class="stat-value">${timeLeft}</span>s</div>
            </div>
            <div class="level-progress">
                <div class="level-progress-bar">
                    <div class="level-progress-bar-fill" style="width: 0%"></div>
                </div>
            </div>
            ${isMobile ? '<button class="mobile-back-btn">✕</button>' : ''}
            <div class="game-play-area"></div>
        `;
        
        // Add back button functionality for mobile
        if (isMobile) {
            const backBtn = gameArea.querySelector('.mobile-back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    clearInterval(gameTimer);
                    gameArea.classList.add('hidden');
                    startGameBtn.classList.remove('hidden');
                });
            }
        }
        
        // Reset game state
        score = 0;
        timeLeft = 30;
        activeItems = [];
        pointMultiplier = 1;
        level = 1;
        pointsForNextLevel = 100;
        updateDisplay();
        
        // Add player character
        const player = document.createElement('div');
        player.id = 'player';
        player.innerHTML = '🚀';
        player.style.position = 'absolute';
        player.style.bottom = '20px';
        player.style.left = '50%';
        player.style.transform = 'translateX(-50%)';
        player.style.fontSize = isMobile ? '3rem' : '2.5rem';
        player.style.zIndex = '10';
        gameArea.querySelector('.game-play-area').appendChild(player);
        
        // Add player movement
        setupPlayerControls(player);
        
        // Start the game timer and spawn items
        startGameTimer();
        spawnCosmicItems();
    }
    
    // Set up player controls
    function setupPlayerControls(player) {
        let playerX = gameArea.offsetWidth / 2;
        const playerSpeed = 8;
        const keys = {};
        const isMobile = window.innerWidth <= 767;
        
        // Event listeners for keyboard controls
        window.addEventListener('keydown', e => {
            keys[e.key] = true;
        });
        
        window.addEventListener('keyup', e => {
            keys[e.key] = false;
        });
        
        // Mobile touch controls
        let touchStartX = 0;
        let isTouching = false;
        
        gameArea.addEventListener('touchstart', e => {
            if (e.target.classList.contains('mobile-back-btn')) return;
            
            isTouching = true;
            touchStartX = e.touches[0].clientX;
            e.preventDefault();
        }, { passive: false });
        
        gameArea.addEventListener('touchmove', e => {
            if (!isTouching) return;
            
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            playerX += diff * (isMobile ? 1.0 : 0.5);
            touchStartX = touchX;
            updatePlayerPosition();
            e.preventDefault();
        }, { passive: false });
        
        gameArea.addEventListener('touchend', () => {
            isTouching = false;
        });
        
        // Update player position
        function updatePlayerPosition() {
            playerX = Math.max(20, Math.min(playerX, gameArea.offsetWidth - 40));
            player.style.left = playerX + 'px';
            player.style.transform = 'translateX(-50%)';
        }
        
        // Animate player movement
        function movePlayer() {
            if (timeLeft <= 0) return;
            
            if (keys['ArrowLeft'] || keys['a']) {
                playerX -= playerSpeed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                playerX += playerSpeed;
            }
            
            updatePlayerPosition();
            requestAnimationFrame(movePlayer);
        }
        
        movePlayer();
    }
    
    // Spawn cosmic items
    function spawnCosmicItems() {
        // Regular items
        const spawnInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(spawnInterval);
                return;
            }
            // Sometimes spawn obstacles
            if (Math.random() < 0.2) {
                createObstacle();
            } else {
                // Select random item type (excluding powerups)
                const itemTypes = Object.keys(cosmicItems).filter(type => 
                    !['shield', 'clock', 'multiplier'].includes(type));
                const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                const item = cosmicItems[randomType];
                createCosmicItem(randomType, item);
            }
        }, 1800 / level); // Decreased density: increase interval
        
        // Power-ups
        const powerupInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(powerupInterval);
                return;
            }
            
            if (Math.random() < 0.3) {
                const powerups = ['shield', 'clock', 'multiplier'];
                const randomPowerup = powerups[Math.floor(Math.random() * powerups.length)];
                const item = cosmicItems[randomPowerup];
                createCosmicItem(randomPowerup, item);
            }
        }, 5000);
    }
    
    // Create a cosmic item
    function createCosmicItem(type, itemData) {
        const item = document.createElement('div');
        item.className = 'cosmic-item';
        item.innerHTML = itemData.emoji;
        item.dataset.type = type;
        
        if (itemData.effect) {
            item.dataset.effect = itemData.effect;
        }
        
        // Random starting position
        const startX = Math.random() * (gameArea.offsetWidth - 40);
        const startY = -50;
        
        item.style.left = startX + 'px';
        item.style.top = startY + 'px';
        
        gameArea.querySelector('.game-play-area').appendChild(item);
        
        const movement = {
            x: (Math.random() - 0.5) * 2 * itemData.speed,
            y: itemData.speed,
            rotation: (Math.random() - 0.5) * 4
        };
        
        activeItems.push({ 
            element: item, 
            movement, 
            type, 
            points: itemData.points, 
            effect: itemData.effect 
        });
        
        animateItem(item, movement);
    }
    
    // Create an obstacle
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.className = 'cosmic-obstacle';
        obstacle.innerHTML = '☄️';
        
        // Random starting position
        const startX = Math.random() * (gameArea.offsetWidth - 40);
        const startY = -50;
        
        obstacle.style.left = startX + 'px';
        obstacle.style.top = startY + 'px';
        
        gameArea.querySelector('.game-play-area').appendChild(obstacle);
        
        const movement = {
            x: (Math.random() - 0.5) * 3,
            y: 2 + (level * 0.3),
            rotation: (Math.random() - 0.5) * 8
        };
        
        animateObstacle(obstacle, movement);
    }
    
    // Animate an obstacle
    function animateObstacle(obstacle, movement) {
        let posX = parseFloat(obstacle.style.left);
        let posY = parseFloat(obstacle.style.top);
        let rotation = 0;
        
        function update() {
            if (timeLeft <= 0) {
                obstacle.remove();
                return;
            }
            
            posX += movement.x;
            posY += movement.y;
            rotation += movement.rotation;
            
            // Bounce off walls
            if (posX <= 0 || posX >= gameArea.offsetWidth - 40) {
                movement.x *= -1;
            }
            
            obstacle.style.left = posX + 'px';
            obstacle.style.top = posY + 'px';
            obstacle.style.transform = `rotate(${rotation}deg)`;
            
            // Check collision with player
            const player = document.getElementById('player');
            if (player && checkCollision(obstacle, player)) {
                if (!player.classList.contains('shielded')) {
                    // Player hit by obstacle
                    score = Math.max(0, score - 25);
                    timeLeft = Math.max(1, timeLeft - 3);
                    updateDisplay();
                    
                    showMessage('-3s! -25 points!', 'red');
                    
                    // Visual feedback
                    gsap.to(player, {
                        opacity: 0.5,
                        duration: 0.1,
                        repeat: 5,
                        yoyo: true
                    });
                } else {
                    // Shield blocks it
                    showMessage('Shield protected you!', 'blue');
                }
                
                obstacle.remove();
                return;
            }
            
            if (posY < gameArea.offsetHeight) {
                requestAnimationFrame(update);
            } else {
                obstacle.remove();
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Animate a cosmic item
    function animateItem(item, movement) {
        let posX = parseFloat(item.style.left);
        let posY = parseFloat(item.style.top);
        let rotation = 0;
        
        function update() {
            if (timeLeft <= 0) {
                item.remove();
                return;
            }
            
            posX += movement.x;
            posY += movement.y;
            rotation += movement.rotation;
            
            // Bounce off walls
            if (posX <= 0 || posX >= gameArea.offsetWidth - 40) {
                movement.x *= -1;
            }
            
            item.style.left = posX + 'px';
            item.style.top = posY + 'px';
            item.style.transform = `rotate(${rotation}deg)`;
            
            // Check collision with player
            const player = document.getElementById('player');
            if (player && checkCollision(item, player)) {
                const itemData = activeItems.find(active => active.element === item);
                if (itemData) {
                    collectItem(item, itemData.points, itemData.effect);
                }
                return;
            }
            
            if (posY < gameArea.offsetHeight) {
                requestAnimationFrame(update);
            } else {
                item.remove();
                activeItems = activeItems.filter(activeItem => activeItem.element !== item);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Check collision between two elements
    function checkCollision(item1, item2) {
        const rect1 = item1.getBoundingClientRect();
        const rect2 = item2.getBoundingClientRect();
        
        return !(
            rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom
        );
    }
    
    // Collect an item
    function collectItem(item, points, effect) {
        // Calculate points with multiplier and decrease as level increases
        let pointsEarned = points * level * pointMultiplier;
        // Decrease points by 10% per level after level 1, minimum 50% of original
        const reduction = Math.max(0.5, 1 - (level - 1) * 0.1);
        pointsEarned = Math.floor(pointsEarned * reduction);
        score += pointsEarned;
        
        // Apply effects if any
        if (effect) {
            switch(effect) {
                case 'shield':
                    activateShield();
                    break;
                case 'time':
                    timeLeft += 5;
                    showMessage('+5 seconds!', 'green');
                    break;
                case 'multiplier':
                    activatePointMultiplier();
                    break;
            }
        }
        
        createStarBurst(item);
        
        // Show points gained
        showPointsAnimation(item, pointsEarned);
        
        // Remove item
        activeItems = activeItems.filter(activeItem => activeItem.element !== item);
        item.remove();
        
        updateDisplay();
        
        // Level up when score reaches the requirement
        if (score >= pointsForNextLevel && timeLeft > 0) {
            levelUp();
        }
    }
    
    // Create a starburst effect
    function createStarBurst(item) {
        const burst = document.createElement('div');
        burst.className = 'star-burst';
        burst.style.left = item.style.left;
        burst.style.top = item.style.top;
        gameArea.appendChild(burst);
        
        gsap.to(burst, {
            scale: 3,
            opacity: 0,
            duration: 0.5,
            onComplete: () => burst.remove()
        });
    }
    
    // Activate shield
    function activateShield() {
        const player = document.getElementById('player');
        if (!player) return;
        
        player.classList.add('shielded');
        showMessage('Shield activated!', 'blue');
        
        setTimeout(() => {
            if (player) player.classList.remove('shielded');
        }, 10000); // 10-second shield
    }
    
    // Activate point multiplier
    function activatePointMultiplier() {
        pointMultiplier = 2;
        showMessage('2x Points!', 'gold');
        
        setTimeout(() => {
            pointMultiplier = 1;
        }, 8000); // 8-second multiplier
    }
    
    // Show game message
    function showMessage(text, color = 'white') {
        const msg = document.createElement('div');
        msg.className = 'game-message';
        msg.textContent = text;
        msg.style.color = color;
        gameArea.appendChild(msg);
        
        gsap.to(msg, {
            y: -50,
            opacity: 0,
            duration: 1.5,
            onComplete: () => msg.remove()
        });
    }
    
    // Show points animation
    function showPointsAnimation(item, points) {
        const pointsText = document.createElement('div');
        pointsText.className = 'points-text';
        pointsText.textContent = `+${points}`;
        pointsText.style.left = item.style.left;
        pointsText.style.top = item.style.top;
        gameArea.appendChild(pointsText);
        
        gsap.to(pointsText, {
            y: '-=50',
            opacity: 0,
            duration: 0.8,
            onComplete: () => pointsText.remove()
        });
    }
    
    // Level up
    function levelUp() {
        level++;
        timeLeft += 10; // Bonus time
        
        // Calculate new points requirement with progressive difficulty
        const previousRequirement = pointsForNextLevel;
        const additionalPoints = 50 * level; // More points needed as level increases
        pointsForNextLevel = previousRequirement + additionalPoints;
        
        // Update game stats
        updateDisplay();
        
        // Show level up animation
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'level-up-message';
        levelUpMsg.innerHTML = `
            Level ${level}! +10s<br>
            <span class="level-points-info">Next level: +${additionalPoints} points</span>
        `;
        gameArea.appendChild(levelUpMsg);
        
        gsap.to(levelUpMsg, {
            y: -100,
            opacity: 0,
            duration: 1,
            onComplete: () => levelUpMsg.remove()
        });
    }
    
    // Start game timer
    function startGameTimer() {
        gameTimer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                endGame();
            }
        }, 1000);
    }
    
    // Update game display
    function updateDisplay() {
        document.getElementById('scoreDisplay').textContent = score;
        document.getElementById('levelDisplay').textContent = level;
        document.getElementById('timeDisplay').textContent = timeLeft;
        document.getElementById('nextLevelPoints').textContent = pointsForNextLevel;
        
        // Update progress bar
        const progressBar = document.querySelector('.level-progress-bar-fill');
        if (progressBar) {
            const progressPercent = Math.min(100, (score / pointsForNextLevel) * 100);
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    // End game
    function endGame() {
        // Clear all active items
        activeItems.forEach(item => item.element.remove());
        activeItems = [];
        
        // Save high score
        const currentHigh = localStorage.getItem('birthdayGameHighScore') || 0;
        const isHighScore = score > currentHigh;
        if (isHighScore) {
            localStorage.setItem('birthdayGameHighScore', score);
        }
        
        // Show final score
        gameArea.innerHTML = `
            <div class="game-over">
                <h2>🎉 Game Over! 🎉</h2>
                <p class="final-score">Final Score: <span>${score}</span></p>
                <p>Levels Completed: <span>${level - 1}</span></p>
                <p class="high-score">High Score: <span>${isHighScore ? score : currentHigh}</span></p>
                ${isHighScore ? '<p>🏆 New High Score! 🏆</p>' : ''}
            </div>
        `;
        
        setTimeout(() => {
            gameArea.classList.add('hidden');
            startGameBtn.classList.remove('hidden');
            startGameBtn.textContent = 'Play Again 🌟';
            startGameBtn.classList.add('replay-btn');
        }, 4000);
    }
}
