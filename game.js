const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game variables
const paddleWidth = 15, paddleHeight = 100;
const ballSize = 15;
const paddleSpeed = 6;
const ballSpeed = 6;

// Player paddle
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#4CAF50"
};

// AI paddle
const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#F44336"
};

// Ball
const ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speedX: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    speedY: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    color: "#fff"
};

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener("mousemove", function (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;

    // Clamp paddle inside canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Draw paddles, ball, and scores
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player paddle
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw AI paddle
    ctx.fillStyle = ai.color;
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw net
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 20);
        ctx.stroke();
    }

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
}

// Ball movement and collision
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top/bottom wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.speedY *= -1;
    }

    // Paddle collision
    // Player paddle
    if (
        ball.x <= player.x + player.width &&
        ball.y + ball.size > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.x = player.x + player.width;
        ball.speedX *= -1;
        // Add a bit of randomness
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // AI paddle
    if (
        ball.x + ball.size >= ai.x &&
        ball.y + ball.size > ai.y &&
        ball.y < ai.y + ai.height
    ) {
        ball.x = ai.x - ball.size;
        ball.speedX *= -1;
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // Scoring
    if (ball.x < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall(1);
    }
}

// Reset ball after score
function resetBall(direction) {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    ball.speedX = ballSpeed * direction;
    ball.speedY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// Basic AI movement
function updateAI() {
    let center = ai.y + ai.height / 2;
    if (center < ball.y + ball.size / 2 - 10) {
        ai.y += paddleSpeed;
    } else if (center > ball.y + ball.size / 2 + 10) {
        ai.y -= paddleSpeed;
    }
    // Clamp AI paddle inside canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Main game loop
function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
