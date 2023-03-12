import * as Engine from '/Engine.js'
backup

import VirtualJoystick from '/Joystick.js';

// Define constants for the game
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

// Create the game container
const gameContainer = document.createElement('div');
gameContainer.style.width = GAME_WIDTH + 'px';
gameContainer.style.height = GAME_HEIGHT + 'px';
gameContainer.style.backgroundColor = '#f5f5f5';
gameContainer.style.fontFamily = 'Arial, sans-serif';
gameContainer.style.userSelect = 'none';
gameContainer.style.webkitUserSelect = 'none';
gameContainer.style.mozUserSelect = 'none';
gameContainer.style.khtmlUserSelect = 'none';
gameContainer.style.msUserSelect = 'none';
document.body.appendChild(gameContainer);

// Load the sprite image
const sprite = new Image();
sprite.src = 'sprite.png';
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

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
