const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const speedSelect = document.getElementById("speed");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let direction = "RIGHT";
let score = 0;
let game;
let gameSpeed = 200;

document.addEventListener("keydown", event => {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
});

function startGame() {
    clearInterval(game);
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    scoreElement.textContent = score;
    gameSpeed = parseInt(speedSelect.value);
    game = setInterval(draw, gameSpeed);
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function drawGrass() {
    const grassColor1 = "#006400";
    const grassColor2 = "#008000";
    for (let i = 0; i < canvas.width; i += box) {
        for (let j = 0; j < canvas.height; j += box) {
            ctx.fillStyle = (i / box + j / box) % 2 === 0 ? grassColor1 : grassColor2;
            ctx.fillRect(i, j, box, box);
        }
    }
}

function drawTriangle(x, y, direction) {
    ctx.fillStyle = "#00FF00";
    ctx.strokeStyle = "#004d00";
    ctx.beginPath();
    if (direction === "LEFT") {
        ctx.moveTo(x + box, y);
        ctx.lineTo(x + box, y + box);
        ctx.lineTo(x, y + box / 2);
    } else if (direction === "UP") {
        ctx.moveTo(x, y + box);
        ctx.lineTo(x + box, y + box);
        ctx.lineTo(x + box / 2, y);
    } else if (direction === "RIGHT") {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + box);
        ctx.lineTo(x + box, y + box / 2);
    } else if (direction === "DOWN") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + box, y);
        ctx.lineTo(x + box / 2, y + box);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw eyes
    ctx.fillStyle = "#000";
    if (direction === "LEFT" || direction === "RIGHT") {
        ctx.beginPath();
        ctx.arc(x + box / 4, y + box / 3, box / 10, 0, 2 * Math.PI);
        ctx.arc(x + box / 4, y + 2 * box / 3, box / 10, 0, 2 * Math.PI);
        ctx.fill();
    } else if (direction === "UP" || direction === "DOWN") {
        ctx.beginPath();
        ctx.arc(x + box / 3, y + box / 4, box / 10, 0, 2 * Math.PI);
        ctx.arc(x + 2 * box / 3, y + box / 4, box / 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw tongue
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (direction === "LEFT") {
        ctx.moveTo(x, y + box / 2);
        ctx.lineTo(x - box / 4, y + box / 2);
        ctx.moveTo(x - box / 4, y + box / 2);
        ctx.lineTo(x - box / 4, y + box / 2 - box / 10);
        ctx.moveTo(x - box / 4, y + box / 2);
        ctx.lineTo(x - box / 4, y + box / 2 + box / 10);
    } else if (direction === "UP") {
        ctx.moveTo(x + box / 2, y);
        ctx.lineTo(x + box / 2, y - box / 4);
        ctx.moveTo(x + box / 2, y - box / 4);
        ctx.lineTo(x + box / 2 - box / 10, y - box / 4);
        ctx.moveTo(x + box / 2, y - box / 4);
        ctx.lineTo(x + box / 2 + box / 10, y - box / 4);
    } else if (direction === "RIGHT") {
        ctx.moveTo(x + box, y + box / 2);
        ctx.lineTo(x + box + box / 4, y + box / 2);
        ctx.moveTo(x + box + box / 4, y + box / 2);
        ctx.lineTo(x + box + box / 4, y + box / 2 - box / 10);
        ctx.moveTo(x + box + box / 4, y + box / 2);
        ctx.lineTo(x + box + box / 4, y + box / 2 + box / 10);
    } else if (direction === "DOWN") {
        ctx.moveTo(x + box / 2, y + box);
        ctx.lineTo(x + box / 2, y + box + box / 4);
        ctx.moveTo(x + box / 2, y + box + box / 4);
        ctx.lineTo(x + box / 2 - box / 10, y + box + box / 4);
        ctx.moveTo(x + box / 2, y + box + box / 4);
        ctx.lineTo(x + box / 2 + box / 10, y + box + box / 4);
    }
    ctx.stroke();
    ctx.lineWidth = 1; // Reset line width
}

function draw() {
    drawGrass();
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawTriangle(snake[i].x, snake[i].y, direction);
        } else {
            ctx.fillStyle = "#00FF00";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#004d00";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
    }

    const appleImg = new Image();
    appleImg.src = 'https://img.icons8.com/color/48/000000/apple.png';
    ctx.drawImage(appleImg, food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert(`Game Over! Your score: ${score}`);
        return;
    }

    snake.unshift(newHead);
}
