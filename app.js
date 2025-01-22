const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardHeight = 300
const boardWidth = 560
let timerId

let xDirection = -2;
let yDirection = 2;
let score = 0

const userStart = [230,10]
let currentPosition = userStart
const ballStart = [270,40]
let ballCurrentPosition = ballStart

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis,yAxis]
        this.bottomRight = [xAxis+blockWidth,yAxis]
        this.topRight = [xAxis+blockWidth, yAxis+blockHeight]
        this.topLeft = [xAxis, yAxis+blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

function addBlocks() {
    for (let i=0; i<blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0]+'px';
        block.style.bottom = blocks[i].bottomLeft[1]+'px';
        grid.appendChild(block)
    }
}

addBlocks()

const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball)
drawBall()

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if(currentPosition[0]>0) {
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0]<(boardWidth-blockWidth)) {
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)

function drawUser() { 
    user.style.left = currentPosition[0]+'px'
    user.style.bottom = currentPosition[1]+'px'
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0]+'px';
    ball.style.bottom = ballCurrentPosition[1]+'px';
}




function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

timerId = setInterval(moveBall, 30)

function checkForCollisions() {
    // Check for block collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            ballCurrentPosition[0] + ballDiameter > blocks[i].bottomLeft[0] &&
            ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1]
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            grid.removeChild(allBlocks[i]);
            blocks.splice(i, 1); 
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    // Wall collisions
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[0] <= 0) {
        xDirection *= -1;
    }
    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
        yDirection *= -1;
    }

    // Paddle collision
    if (
        ballCurrentPosition[0] + ballDiameter > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] <= currentPosition[1] + blockHeight &&
        ballCurrentPosition[1] > currentPosition[1]
    ) {
        changeDirection();
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You lose';
        document.removeEventListener('keydown', moveUser);
    }
}


function changeDirection() {
    if (xDirection > 0 && yDirection > 0) {
        yDirection = -2; // Top-right
    } else if (xDirection > 0 && yDirection < 0) {
        xDirection = -2; // Bottom-right
    } else if (xDirection < 0 && yDirection < 0) {
        yDirection = 2; // Bottom-left
    } else if (xDirection < 0 && yDirection > 0) {
        xDirection = 2; // Top-left
    }
}
