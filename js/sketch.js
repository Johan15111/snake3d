let snake;
let food;
let blockSize;
let planeSize;
let angle = 0;
let font;
let fontsize = 40;
let isGameOver = false;
let message;
let textColor1, textColor2, textColor3, textColor4;
let backgroundMusic;
let eatingEffect;
let rightEffect;
let leftEffect;
let upEffect;
let downEffect;
let isAudioPlaying = false;
let iconImage;
let score = -1;

function preload() {
  font = loadFont('font/Boba.ttf');
  backgroundMusic = loadSound('music/background.mp3');
  eatingEffect = loadSound('music/eating.wav');
  rightEffect = loadSound('music/right.mp3');
  leftEffect = loadSound('music/left.mp3');
  upEffect = loadSound('music/up.mp3');
  downEffect = loadSound('music/down.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  backgroundMusic.stop();

  textColor1 = color(255, 0, 0); // Rojo
  textColor2 = color(0, 0, 255); // Azul
  textColor3 = color(0, 0, 0); // Negro
  textColor4 = color(245, 130, 27) // Naranja

  blockSize = windowWidth * 0.04;
  planeSize = {
    width: windowWidth,
    height: windowHeight
  };

  restartGame();

  setAttributes('antialias', true);

  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  let hammer = new Hammer(document.body, {
    preventDefault: false
  });

  hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.on("swipe", keyPressed);

  let audioButton = createButton('');
  audioButton.position(20, 20); // Posición del botón en la ventana

  iconImage = createImg('music/HabilitarAudio.png'); // Ruta a tu imagen y una descripción opcional
  iconImage.size(24, 24); // Tamaño de la imagen
  audioButton.elt.appendChild(iconImage.elt); // Agrega la imagen al botón

  audioButton.mousePressed(toggleAudio); // Asigna la función toggleAudio() al evento de clic del botón
}

function restartGame() {
  isGameOver = false;
  score = -1;

  snake = new Snake(windowWidth / 2, windowHeight / 2, blockSize);
  food = createFood();
}

function draw() {
  background(138, 223, 253 );
  translate(-windowWidth / 2, -windowHeight / 2, 0);

  let angle = map(mouseY, 0, height, 0, max(windowWidth, windowHeight) * 0.7);
  camera(
    0,
    angle,
    min(windowWidth, windowHeight) * 0.8,
    0, 0, 0, 0, 1, 0);

  pointLight(250, 250, 250, 0, 1000, 0);

  // Draw Pane
  push()
  fill(190, 253, 138)
  translate(windowWidth / 2, windowHeight / 2, 0);
  plane(planeSize.width, planeSize.height);
  pop();

  fill(textColor4);
  translate(0, 0, 80);
  text(`Puntaje: ${score}`, width / 2, height - 600);

  snake.update();
  food.update();

  if (snake.isEating(food)) {
    snake.grow();
    food = createFood();
  }

  snake.render();
  food.render();

  checkGameOver();
}

function keyPressed(event) {
  console.log(event)
  if (keyCode === LEFT_ARROW || (event && event.direction == 2)) {
    snake.moveLeft();
    leftEffect.play();
  } else if (keyCode === RIGHT_ARROW || (event && event.direction == 4)) {
    snake.moveRight();
    rightEffect.play();
  } else if (keyCode === UP_ARROW || (event && event.direction == 8)) {
    snake.moveUp();
    upEffect.play();
  } else if (keyCode === DOWN_ARROW || (event && event.direction == 16)) {
    snake.moveDown();
    downEffect.play();
  }
}

function createFood() {
  let newFood = new Food(
    random(planeSize.width * 0.2, planeSize.width * 0.8),
    random(planeSize.height * 0.2, planeSize.height * 0.8),
    blockSize);

  eatingEffect.play();

  // Snap to grid
  newFood.x = round(newFood.x / (blockSize + snake.spacing)) * (blockSize + snake.spacing);
  newFood.y = round(newFood.y / (blockSize + snake.spacing)) * (blockSize + snake.spacing);

  score++;

  if (snake.isInBody(newFood.x, newFood.y, newFood.size)){
    return createFood();
  }
  else
    return newFood;
}

function checkGameOver() {
  let head = snake.getHead();

  if (head.x <= 0 + blockSize || head.x >= planeSize.width - blockSize
    || head.y <= 0 + blockSize || head.y >= planeSize.height - blockSize / 2
    || snake.isInBody(head.x, head.y, snake.size)) {

    isGameOver = true;
    snake.stop();
    backgroundMusic.stop();

    fill(10);
    push();
    translate(0, 0, 80);
    fill(textColor1);
    text(`Fin del Juego :(`, width / 2, height / 2);
    fill(textColor2);
    text(`Tu Puntaje: ${score} manzanas`, width / 2, height / 2 + 60);
    fill(textColor3);
    text(`Da clic para reiniciar el juego`, width / 2, height / 2 + 120);
    pop();
  }
}

function mousePressed() {
  if (isGameOver) {
    backgroundMusic.stop();
    isAudioPlaying = false;
    iconImage.attribute('src', 'music/HabilitarAudio.png');
    restartGame();
  }
}

function toggleAudio() {
  if (isAudioPlaying) {
    backgroundMusic.stop();
    isAudioPlaying = false;
    iconImage.attribute('src', 'music/HabilitarAudio.png');
  } else {
    backgroundMusic.play(); // Inicia la reproducción del audio
    isAudioPlaying = true;
    iconImage.attribute('src', 'music/SilenciarAudio.png');
  }
}

