import VirtualJoystick from "https://cdn.jsdelivr.net/gh/Joker-pyc/Virtual-Joystick@latest/src/virtual-joystick.min.js";

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

const gameContainer = document.querySelector('main');
document.body.appendChild(gameContainer);

const gameStarted = new Date();

const scoreElem = document.createElement('div');
scoreElem.style.position = 'absolute';
scoreElem.style.top = '20px';
scoreElem.style.left = '20px';
scoreElem.style.color = 'white';
scoreElem.style.fontSize = '24px';
scoreElem.textContent = 'Score: 0';
gameContainer.appendChild(scoreElem);

let score = 0;

const sprite = new Image();
sprite.src = 'https://img.icons8.com/3d-fluency/50/null/finger-pointing-right-2.png';
sprite.addEventListener('load', function() {
  sprite.style.width = '50px';
  sprite.style.height = '50px';
  sprite.style.position = 'absolute';
  spriteObj.x = GAME_WIDTH / 2 - sprite.width / 2;
  spriteObj.y = GAME_HEIGHT / 2 - sprite.height / 2;
  gameContainer.appendChild(sprite);
});

const ball = new Image();
const ballObj = {
  x: 0,
  y: 0,
  speed: 300,
};
function resetBall() {
  ballObj.x = Math.random() * (GAME_WIDTH - ball.width);
  ballObj.y = Math.random() * (GAME_HEIGHT - ball.height);
  ball.style.left = ballObj.x + 'px';
  ball.style.top = ballObj.y + 'px';
}
ball.src = 'https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/30/null/external-ball-health-vitaliy-gorbachev-flat-vitaly-gorbachev.png';
ball.addEventListener('load', function() {
  ball.style.width = '30px';
  ball.style.height = '30px';
  ball.style.position = 'absolute';
  resetBall();
  gameContainer.appendChild(ball);
});

let ballX = Math.floor(Math.random() * (GAME_WIDTH - ball.width));
let ballY = Math.floor(Math.random() * (GAME_HEIGHT - ball.height));

const joystickContainer = document.createElement('div');
joystickContainer.style.position = 'absolute';
joystickContainer.style.bottom = '20px';
joystickContainer.style.left = '20px';
gameContainer.appendChild(joystickContainer);
const joystick = new VirtualJoystick(joystickContainer);

const spriteObj = {
  x: 0,
  y: 0,
  speed: 0,         // Current speed (initially 0)
  maxSpeed: 500,    // Maximum speed
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

let lastTime = 0;
// Add this at the beginning of your JavaScript code to get a reference to the audio element
// Create an Audio object for background music
const backgroundMusic = new Audio('audio.mp3');
backgroundMusic.volume = 0; // Start with zero volume
backgroundMusic.loop = true; // Loop the music

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  const joystickMagnitude = Math.sqrt(joystick.delta.x ** 2 + joystick.delta.y ** 2);
  const lerpFactor = 1;
  spriteObj.speed = lerp(spriteObj.speed, spriteObj.maxSpeed * joystickMagnitude, lerpFactor);

  spriteObj.x += joystick.delta.x * spriteObj.speed * deltaTime;
  spriteObj.y += joystick.delta.y * spriteObj.speed * deltaTime;

  if (spriteObj.x < 0) spriteObj.x = 0;
  if (spriteObj.y < 0) spriteObj.y = 0;
  if (spriteObj.x + sprite.width > GAME_WIDTH) spriteObj.x = GAME_WIDTH - sprite.width;
  if (spriteObj.y + sprite.height > GAME_HEIGHT) spriteObj.y = GAME_HEIGHT - sprite.height;

  sprite.style.left = spriteObj.x + 'px';
  sprite.style.top = spriteObj.y + 'px';

  const angle = Math.atan2(joystick.delta.y, joystick.delta.x);
  const degree = Math.degrees(angle);
  sprite.style.transform = `rotate(${degree}deg)`;

  if (ballObj.x < 0 || ballObj.x + ball.width > GAME_WIDTH) {
    ballObj.x -= ballX;
  }
  if (ballObj.y < 0 || ballObj.y + ball.height > GAME_HEIGHT) {
    ballObj.y -= ballY;
  }

  ball.style.left = ballObj.x + 'px';
  ball.style.top = ballObj.y + 'px';
  
  
  // Play or pause the music based on joystick input
  if (joystickMagnitude > 0) {
    if (backgroundMusic.paused) {
      backgroundMusic.volume = 0;
      backgroundMusic.play();
      fadeInMusic(backgroundMusic);
    }
  } else {
    if (!backgroundMusic.paused) {
      fadeOutMusic(backgroundMusic);
    }
  }


  if (spriteObj.x < ballObj.x + ball.width &&
    spriteObj.x + sprite.width > ballObj.x &&
    spriteObj.y < ballObj.y + ball.height &&
    spriteObj.y + sprite.height > ballObj.y) {
    resetBall();
    score++;
    const timeElapsed = (new Date() - gameStarted) / 10000;
    scoreElem.textContent = `Score: ${score/timeElapsed}`;
  }

  requestAnimationFrame(gameLoop);
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

// Function to gradually fade in the music
function fadeInMusic(audioElement) {
  const fadeDuration = 1000; // Adjust the fade-in duration as needed
  const fadeStep = 0.05;
  let currentVolume = 0;

  const fadeInInterval = setInterval(() => {
    currentVolume += fadeStep;
    if (currentVolume >= 1) {
      clearInterval(fadeInInterval);
      audioElement.volume = 1;
    } else {
      audioElement.volume = currentVolume;
    }
  }, fadeDuration * fadeStep);
}

// Function to gradually fade out the music
function fadeOutMusic(audioElement) {
  const fadeDuration = 1000; // Adjust the fade-out duration as needed
  const fadeStep = 0.05;
  let currentVolume = audioElement.volume;

  const fadeOutInterval = setInterval(() => {
    currentVolume -= fadeStep;
    if (currentVolume <= 0) {
      clearInterval(fadeOutInterval);
      audioElement.pause();
      audioElement.volume = 1; // Reset volume for next play
    } else {
      audioElement.volume = currentVolume;
    }
  }, fadeDuration * fadeStep);
}

requestAnimationFrame(gameLoop);
