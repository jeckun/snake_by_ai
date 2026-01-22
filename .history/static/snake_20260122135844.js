document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const speedInput = document.getElementById('speed');
    const applySpeedBtn = document.getElementById('apply-speed');
    
    // Game constants
    const GRID_SIZE = 100; // 100x100 grid (100x100 canvas)
    const INITIAL_SPEED = parseInt(speedInput.value);
    
    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameSpeed = INITIAL_SPEED;
    let score = 0;
    let gameStartTime;
    let gameLoop;
    let gameOver = false;
    
    // Initialize game
    function initGame() {
        // Clear existing game loop
        if (gameLoop) {
            cancelAnimationFrame(gameLoop);
        }
        
        // Reset game state
        snake = [];
        direction = getRandomDirection();
        nextDirection = direction;
        score = 0;
        scoreElement.textContent = score;
        gameOver = false;
        
        // Create initial snake (head + 2 body parts)
        const startX = Math.floor(Math.random() * (GRID_SIZE - 3)) + 1;
        const startY = Math.floor(Math.random() * GRID_SIZE);
        
        snake.push({x: startX, y: startY}); // Head
        snake.push({x: startX - 1, y: startY}); // Body part 1
        snake.push({x: startX - 2, y: startY}); // Body part 2
        
        // Create first food
        createFood();
        
        // Start game timer
        gameStartTime = Date.now();
        
        // Start game loop
        gameLoop = requestAnimationFrame(updateGame);
    }
    
    // Create food at random position
    function createFood() {
        let validPosition = false;
        
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            
            // Make sure food doesn't spawn on snake
            validPosition = !snake.some(segment => 
                segment.x === food.x && segment.y === food.y
            );
        }
    }
    
    // Get random initial direction
    function getRandomDirection() {
        const directions = ['up', 'right', 'down', 'left'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    
    // Update game state
    function updateGame() {
        if (gameOver) return;
        
        // Move snake
        moveSnake();
        
        // Check collisions
        if (checkCollisions()) {
            endGame();
            return;
        }
        
        // Check if snake ate food
        if (snake[0].x === food.x && snake[0].y === food.y) {
            // Don't remove tail (snake grows)
            createFood();
        } else {
            // Remove tail (snake moves)
            snake.pop();
        }
        
        // Update score (time survived in seconds)
        score = Math.floor((Date.now() - gameStartTime) / 1000);
        scoreElement.textContent = score;
        
        // Draw everything
        drawGame();
        
        // Set game speed (higher number = slower game)
        setTimeout(() => {
            gameLoop = requestAnimationFrame(updateGame);
        }, 1000 / gameSpeed);
    }
    
    // Move snake based on direction
    function moveSnake() {
        direction = nextDirection;
        
        // Create new head
        const head = {...snake[0]};
        
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
        }
        
        // Add new head
        snake.unshift(head);
    }
    
    // Check for collisions
    function checkCollisions() {
        const head = snake[0];
        
        // Wall collision
        if (
            head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE
        ) {
            return true;
        }
        
        // Self collision (skip head)
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#4CAF50' : '#8BC34A'; // Head is darker
            ctx.fillRect(
                segment.x * GRID_SIZE, 
                segment.y * GRID_SIZE, 
                GRID_SIZE, 
                GRID_SIZE
            );
            
            // Add border to segments
            ctx.strokeStyle = '#45a049';
            ctx.strokeRect(
                segment.x * GRID_SIZE, 
                segment.y * GRID_SIZE, 
                GRID_SIZE, 
                GRID_SIZE
            );
        });
        
        // Draw food
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(
            food.x * GRID_SIZE, 
            food.y * GRID_SIZE, 
            GRID_SIZE, 
            GRID_SIZE
        );
    }
    
    // End game and show results
    function endGame() {
        gameOver = true;
        
        // Redirect to results page with score
        window.location.href = `/results?score=${score}`;
    }
    
    // Keyboard controls
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
        }
    });
    
    // Speed control
    applySpeedBtn.addEventListener('click', () => {
        const newSpeed = parseInt(speedInput.value);
        
        if (newSpeed >= 1 && newSpeed <= 10) {
            gameSpeed = newSpeed;
            
            // Save speed preference to server
            fetch('/update_speed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ speed: newSpeed })
            });
            
            alert(`速度已设置为 ${newSpeed}. 新游戏将使用此速度.`);
        }
    });
    
    // 等待玩家按键或鼠标点击后开始游戏
    document.addEventListener('keydown', startGameOnInput, { once: true });
    document.addEventListener('mousedown', startGameOnInput, { once: true });

    function startGameOnInput() {
        initGame();
    }
});
