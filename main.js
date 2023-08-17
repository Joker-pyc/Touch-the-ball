import VirtualJoystick from "https://github.com/Joker-pyc/Virtual-Joystick/blob/main/src/virtual-joystick.js";

// Define constants for the game
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

// Create the game container
const gameContainer = document.querySelector('main');

document.body.appendChild(gameContainer);

// Create a score element
const scoreElem = document.createElement('div');
scoreElem.style.position = 'absolute';
scoreElem.style.top = '20px';
scoreElem.style.left = '20px';
scoreElem.style.color = 'white';
scoreElem.style.fontSize = '24px';
scoreElem.textContent = 'Score: 0';

gameContainer.appendChild(scoreElem);

// Define the score variable
let score = 0;


// Load the sprite image
const sprite = new Image();
sprite.src = 'https://img.icons8.com/3d-fluency/50/null/finger-pointing-right-2.png';
sprite.addEventListener('load', function() {
  // Set the sprite's dimensions
  sprite.style.width = '50px';
  sprite.style.height = '50px';
  sprite.style.position = 'absolute';

  // Set the sprite's initial position
  spriteObj.x = GAME_WIDTH / 2 - sprite.width / 2;
  spriteObj.y = GAME_HEIGHT / 2 - sprite.height / 2;

  // Add the sprite to the game container
  gameContainer.appendChild(sprite);
});

const ball = new Image();
const ballObj = {
  x: 0,
  y: 0,
  speed: 300, // pixels per second
};

function resetBall() {
  ballObj.x = Math.random() * (GAME_WIDTH - ball.width);
  ballObj.y = Math.random() * (GAME_HEIGHT - ball.height);
  ball.style.left = ballObj.x + 'px';
  ball.style.top = ballObj.y + 'px';
}

ball.src = 'https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/30/null/external-ball-health-vitaliy-gorbachev-flat-vitaly-gorbachev.png';
ball.addEventListener('load', function() {
  // Set the ball's dimensions
  ball.style.width = '30px';
  ball.style.height = '30px';
  ball.style.position = 'absolute';
  // Set the ball's initial position
  resetBall();
  // Add the ball to the game container
  gameContainer.appendChild(ball);
});

// Define the initial position of the ball
let ballX = Math.floor(Math.random() * (GAME_WIDTH - ball.width));
let ballY = Math.floor(Math.random() * (GAME_HEIGHT - ball.height));


// Create a virtual joystick for controlling the sprite
const joystickContainer = document.createElement('div');
joystickContainer.style.position = 'absolute';
joystickContainer.style.bottom = '20px';
joystickContainer.style.left = '20px';
gameContainer.appendChild(joystickContainer);
const joystick = new VirtualJoystick(joystickContainer);

// Define the sprite object
const spriteObj = {
  x: 0,
  y: 0,
  speed: 500, // pixels per second
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// Define the game loop
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Move the sprite based on joystick input
  spriteObj.x += joystick.delta.x * spriteObj.speed * deltaTime;
  spriteObj.y += joystick.delta.y * spriteObj.speed * deltaTime;

  // Keep the sprite within the game bounds
  if (spriteObj.x < 0) spriteObj.x = 0;
  if (spriteObj.y < 0) spriteObj.y = 0;
  if (spriteObj.x + sprite.width > GAME_WIDTH) spriteObj.x = GAME_WIDTH - sprite.width;
  if (spriteObj.y + sprite.height > GAME_HEIGHT) spriteObj.y = GAME_HEIGHT - sprite.height;

  // Update the sprite position
  sprite.style.left = spriteObj.x + 'px';
  sprite.style.top = spriteObj.y + 'px';


  // Calculate the angle of the joystick

  const angle = Math.atan2(joystick.delta.y, joystick.delta.x);

  // Convert the angle from radians to degrees

  const degree = Math.degrees(angle);

  // Rotate the sprite

  sprite.style.transform = `rotate(${degree}deg)`;



  // Bounce the ball off the walls
  if (ballObj.x < 0 || ballObj.x + ball.width > GAME_WIDTH) {
    ballObj.x -= ballX;
  }
  if (ballObj.y < 0 || ballObj.y + ball.height > GAME_HEIGHT) {
    ballObj.y -= ballY;
  }

  // Update the ball position
  ball.style.left = ballObj.x + 'px';
  ball.style.top = ballObj.y + 'px';

  // Check for collisions with the ball
  if (spriteObj.x < ballObj.x + ball.width &&
    spriteObj.x + sprite.width > ballObj.x &&
    spriteObj.y < ballObj.y + ball.height &&
    spriteObj.y + sprite.height > ballObj.y) {
    // Reset the ball position and increase the score
    resetBall();
    score++;
    scoreElem.textContent = `Score: ${score}`;
  }


  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
