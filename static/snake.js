document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const speedInput = document.getElementById('speed');
    const speedValueElement = document.getElementById('speed-value');
    
    // Game constants
    const GRID_SIZE = 30; // 30x30 grid (600x600 canvas) - 每个格子20x20像素
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
    let gameJustStarted = false; // 新增：标记游戏是否刚刚开始
    
    // Generate a safe starting position for the snake (at least 2 cells from all boundaries)
    function generateSafeStartPosition() {
        // Snake is 3 cells long, need at least 2 cells from each boundary
        // For horizontal movement (left/right): need startX between 2 and GRID_SIZE-3
        // For vertical movement (up/down): need startY between 2 and GRID_SIZE-2
        const minX = 2;
        const maxX = GRID_SIZE - 3; // Because snake extends left from head
        const minY = 2;
        const maxY = GRID_SIZE - 2;
        
        const startX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const startY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        
        return { startX, startY };
    }
    
    // Initialize static snake and food for display (before game starts)
    function initStaticDisplay() {
        // Clear snake array to start fresh (important when page reloads or returning from game over)
        snake = [];
        
        // Generate random direction for initial display
        direction = getRandomDirection();
        nextDirection = direction;
        
        // Generate safe starting position (at least 2 cells from all boundaries)
        const { startX, startY } = generateSafeStartPosition();
        
        // Create initial snake (head + 2 body parts) based on direction
        snake.push({x: startX, y: startY}); // Head
        
        // Add body parts based on direction
        switch (direction) {
            case 'right':
                // Head faces right, body extends to the left
                snake.push({x: startX - 1, y: startY}); // Body part 1
                snake.push({x: startX - 2, y: startY}); // Body part 2
                break;
            case 'left':
                // Head faces left, body extends to the right
                snake.push({x: startX + 1, y: startY}); // Body part 1
                snake.push({x: startX + 2, y: startY}); // Body part 2
                break;
            case 'up':
                // Head faces up, body extends downward
                snake.push({x: startX, y: startY + 1}); // Body part 1
                snake.push({x: startX, y: startY + 2}); // Body part 2
                break;
            case 'down':
                // Head faces down, body extends upward
                snake.push({x: startX, y: startY - 1}); // Body part 1
                snake.push({x: startX, y: startY - 2}); // Body part 2
                break;
        }
        
        // Create first food at a safe position
        createFood();
        
        // Draw the static display
        drawGame();
    }
    
    // Initialize game (when user starts playing)
    function initGame() {
        // Clear existing game loop
        if (gameLoop) {
            cancelAnimationFrame(gameLoop);
        }
        
        // Reset game state (but keep the snake position from static display)
        // Don't reset snake array - keep the position from initStaticDisplay
        // Don't reset direction - keep the current direction so player's first key press is respected
        // The keyboard event listener has already set nextDirection based on user input
        score = 0;
        scoreElement.textContent = score;
        gameOver = false;
        gameJustStarted = true; // 游戏刚刚开始
        
        // Create new food (in case the old food was eaten in static display)
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
        
        // 第一帧之后，重置gameJustStarted标志
        if (gameJustStarted) {
            gameJustStarted = false;
        }
        
        // Check if snake ate food
        if (snake[0].x === food.x && snake[0].y === food.y) {
            // Snake ate food - create new food
            createFood();
            // Snake grows by not removing tail
            // Note: moveSnake() already added new head, so we keep the tail
        } else {
            // Remove tail (snake moves without growing)
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
        // 如果游戏刚刚开始，忽略第一帧的自碰撞检测
        // 这可以防止玩家按下反方向键时立即游戏结束
        if (!gameJustStarted) {
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate cell size based on canvas width and grid size
        const cellSize = canvas.width / GRID_SIZE;
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is red with dark red border, body is green with dark green border
            if (index === 0) {
                // Draw head
                ctx.fillStyle = '#FF0000'; // Head: red
                ctx.fillRect(
                    segment.x * cellSize, 
                    segment.y * cellSize, 
                    cellSize, 
                    cellSize
                );
                // Add dark red border instead of white to avoid visual size illusion
                ctx.strokeStyle = '#CC0000'; // Dark red border
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    segment.x * cellSize, 
                    segment.y * cellSize, 
                    cellSize, 
                    cellSize
                );
            } else {
                // Draw body
                ctx.fillStyle = '#4CAF50'; // Body: green
                ctx.fillRect(
                    segment.x * cellSize, 
                    segment.y * cellSize, 
                    cellSize, 
                    cellSize
                );
                // Add dark green border
                ctx.strokeStyle = '#2E7D32';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    segment.x * cellSize, 
                    segment.y * cellSize, 
                    cellSize, 
                    cellSize
                );
            }
        });
        
        // Draw food with border
        ctx.fillStyle = '#FF9800'; // Orange food
        ctx.fillRect(
            food.x * cellSize, 
            food.y * cellSize, 
            cellSize, 
            cellSize
        );
        
        // Add border to food
        ctx.strokeStyle = '#FF5722'; // Darker orange border
        ctx.lineWidth = 2;
        ctx.strokeRect(
            food.x * cellSize, 
            food.y * cellSize, 
            cellSize, 
            cellSize
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
        // Prevent reverse direction at any time (including game start)
        // This prevents the snake from immediately colliding with itself
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
    
    // Real-time speed control
    function updateSpeed(newSpeed) {
        if (newSpeed >= 1 && newSpeed <= 10) {
            gameSpeed = newSpeed;
            speedValueElement.textContent = newSpeed;
            
            // Save speed preference to server
            fetch('/update_speed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ speed: newSpeed })
            });
        }
    }
    
    // Update speed when slider value changes (real-time)
    speedInput.addEventListener('input', () => {
        const newSpeed = parseInt(speedInput.value);
        updateSpeed(newSpeed);
    });
    
    // When slider is released (mouse up), focus on canvas
    speedInput.addEventListener('change', () => {
        canvas.focus();
    });
    
    // Set canvas tabindex to make it focusable
    canvas.setAttribute('tabindex', '0');
    canvas.style.outline = 'none'; // Remove default focus outline
    
    // 等待玩家按键或鼠标点击后开始游戏
    document.addEventListener('keydown', startGameOnInput, { once: true });
    // 只有点击canvas区域才触发游戏开始，避免点击其他UI元素（如速度调整按钮）误触发
    canvas.addEventListener('mousedown', startGameOnInput, { once: true });

    function startGameOnInput(e) {
        // 如果是键盘事件，先处理方向设置
        if (e && e.type === 'keydown') {
            // 使用与主键盘控制监听器相同的逻辑，防止反方向移动
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
        }
        
        // 然后开始游戏
        initGame();
    }
    
    // Initialize static display when page loads
    initStaticDisplay();
});
