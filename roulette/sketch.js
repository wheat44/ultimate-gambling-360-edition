// Grid Based Game - Roulette
// Tj Ham
// 4/15/2026
//
// Extra for Experts:
// My project is a grid based roulette game. It uses a 2d grid array to handle the betting. This takes inputs from mouse clicks to determine where bets are being placed.
//The game also features a 2d roulette wheel that spins and a ball that has seperate animation, this animation is something that is not featured in class lessons and goes above and beyond the 
//project requirments. The game also features sound effects and many other features that were present in my last project. Overall The game has a lot of features. Its a complex game in a early state and has 
///lots of room for growth/ improvement. The primary logic is is rather simple, but making it work with smooth animations and grid betting systems was a challenge. 


///designate gamestate
let state = 'start';

///game variables
let playerMoney = 1000;
let placedBets = [];


///establish constants for dozens
const FIRSTDOZEN = [1,4,7,10,13,16,19,22,25,28,31,34];
const SECONDDOZEN = [2,5,8,11,14,17,20,23,26,29,32,35];
const THIRDDOZEN = [3,6,9,12,15,18,21,24,27,30,33,36];
const REDNUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACKNUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

///constanst for numbars on the wheel
const WHEELNUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34,
  6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18,
  29, 7, 28, 12, 35, 3, 26
];

///assign game betting grid
let bettingGrid = [];
const ROWS = 12;
const COLS = 3;

///constant variables
const EXTRASPINS = 5;
const SPINSTEP = 0.2; ///basically speed of wheel spining


///initialize screen based dimensional variables 
let betX;
let betY;
let cellX;
let cellY;
let colour;
let betTextX;
let betTextY;
let wheelX;
let wheelY;
let imgWidth;
let imgHeight;
let angle;

/// wheel variables
let wheelAngle = 0;
let spinSpeed = 0.1;

/// ball variables
let ballAngle = 0;
let ballSpeed = 0;
let ballTargetAngle = 0;
let ballRadius;
let ballSize;

/// variables for determining answer then animating to it after.
let winningNumber;
let targetAngle = 0;
let currentAngle = 0;
let spinStartAngle = 0;
let spinProgress = 0;
let isSpinning = false;

/// positive is ball will land that many steps clockwise of 12 oclick position. 
let whiteBallLanding;

function preload() {
  ///load background and meny images
  startIMG = loadImage("roulette/Assets/BG/Start.png");
  mainIMG = loadImage('roulette/Assets/BG/main.png');
  instructionsIMG = loadImage('roulette/Assets/BG/instructions.png');
  rouletteIMG = loadImage('roulette/Assets/IMG/pictures/r88_Casino_pictures/roulette/roulette_wheel.png');
  rouletteBaseIMG = loadImage('roulette/Assets/IMG/pictures/r88_Casino_pictures/roulette/roulette_base.png');
  whiteBall = loadImage('roulette/Assets/IMG/pictures/r88_Casino_pictures/roulette/roulette_pill2.png');
  chipImage = loadImage('roulette/Assets/IMG/pictures/r88_Casino_pictures/chips/chipStack1.png');
  win = loadSound('roulette/Assets/audio/se/r88_Casino_se/win.mp3');
  lose = loadSound('roulette/Assets/audio/se/r88_Casino_se/lose.mp3');
  spin = loadSound('roulette/Assets/audio/se/r88_Casino_se/roulette_spin.ogg');
  stop = loadSound('roulette/Assets/audio/se/r88_Casino_se/roulette_stop.ogg');
}

function setup() {
  ///redefine screen base dimensional variables after screenwidth and height was created
  createCanvas(windowWidth, windowHeight);
  betX = windowWidth/2;
  betY = windowHeight/2.2;
  cellX = windowWidth/30;
  cellY = windowHeight/9;
  wheelX = windowWidth/4;
  wheelY =  windowHeight/1.5;
  imgWidth = windowWidth/3.5;
  imgHeight = windowHeight/2;
  ballRadius = imgWidth * 0.37;
  ballSize = imgWidth/16;

  ///create the grid
  createGrid();

}

function draw() {
  ///draw loop
  displayBG();
  drawGrid();
  drawPlacedBets();
  displayMoney();

  ///animations for wheel and ball
  animateWheel();
  animateBall();

  /// static drawing of wheel and ball
  drawWheel();
  drawBall();
}

function createGrid(){
  ///creates the grid based on grid height/ width
  let index = 1;
  for (let y = 0; y < ROWS; y++) {
    bettingGrid.push([]);
    for (let x = 0; x < COLS; x++) {
      bettingGrid[y].push(index);
      index ++;
    }
  }
}

function drawGrid() {
  if (state === 'main' || state === 'spin') {

    // draw main 12 x 3 number grid
    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {

        let boxX = x * cellX + betX;
        let boxY = y * cellY + betY;

        betTextX = boxX + cellX / 2;
        betTextY = boxY + cellY / 2;

        /// alternate colours based on box for roulette pattern
        let currentNumber = bettingGrid[x][y];

        if (REDNUMBERS.includes(currentNumber)) {
          colour = 'red';
        }
        else if (BLACKNUMBERS.includes(currentNumber)) {
          colour = 'black';
        }


        ///draw each square
        fill(colour);
        rect(boxX, boxY, cellX, cellY);

        ///number each box
        fill('white');
        textSize(20);
        textAlign(CENTER, CENTER);
        text(bettingGrid[x][y], betTextX, betTextY);
      }
    }

    // draw right-side dozens column
    let rightX = betX + ROWS * cellX;

    for (let y = 0; y < COLS; y++) {
      let sideY = betY + y * cellY;

      fill(40);
      rect(rightX, sideY, cellX * 1.4, cellY);

      fill('white');
      textSize(18);
      textAlign(CENTER, CENTER);

      if (y === 0) {
        text("1st 12", rightX + cellX * 1.4 / 2, sideY + cellY / 2);
      }
      else if (y === 1) {
        text("2nd 12", rightX + cellX * 1.4 / 2, sideY + cellY / 2);
      }
      else if (y === 2) {
        text("3rd 12", rightX + cellX * 1.4 / 2, sideY + cellY / 2);
      }
    }

    // draw bottom row for red/black/odd/even
    let bottomY = betY + COLS * cellY;
    let bottomBoxW = ROWS * cellX / 4;

    // RED
    fill('red');
    rect(betX, bottomY, bottomBoxW, cellY * 0.9);
    fill('white');
    text("RED", betX + bottomBoxW / 2, bottomY + cellY * 0.9 / 2);

    // black
    fill('black');
    rect(betX + bottomBoxW, bottomY, bottomBoxW, cellY * 0.9);
    fill('white');
    text("BLACK", betX + bottomBoxW + bottomBoxW / 2, bottomY + cellY * 0.9 / 2);

    // Odd
    fill(40);
    rect(betX + bottomBoxW * 2, bottomY, bottomBoxW, cellY * 0.9);
    fill('white');
    text("19 to 36 ODD", betX + bottomBoxW * 2 + bottomBoxW / 2, bottomY + cellY * 0.9 / 2);

    // even
    fill(70);
    rect(betX + bottomBoxW * 3, bottomY, bottomBoxW, cellY * 0.9);
    fill('white');
    text("1 to 18 EVEN", betX + bottomBoxW * 3 + bottomBoxW / 2, bottomY + cellY * 0.9 / 2);
  }
}

function displayBG(){
  ///display background based on game state
  imageMode(CORNER);
  if (state === 'start'){
    image(startIMG, 0,0, windowWidth, windowHeight);
  }
  else if (state === 'main' || state === 'spin'){
    image(mainIMG, 0,0, windowWidth, windowHeight);
  }
  else if (state === 'instructions') {
    image(instructionsIMG, 0,0, windowWidth, windowHeight);
  }
}

function keyPressed(){
  ///space to change menu
  if (key === " ") {
    if (state === "start") {
      state = "instructions";
    } 
    else if (state === "instructions") {
      state = "main";
    }
  }
  /// s to spin the wheel 
  if (key === "s" && !isSpinning && state === "main") {
    startSpin();
  }
  
  /// r to reset
  if (key === "r") {
    state = "start";
    playerMoney = 1000;
    placedBets = [];
    win.stop();
    lose.stop();
    spin.stop();
  }
}

function windowResized() {
  /// redefine variables when window is resized.
  resizeCanvas(windowWidth, windowHeight);
  betX = windowWidth/2;
  betY = windowHeight/2.2;
  cellX = windowWidth/30;
  cellY = windowHeight/9;
  wheelX = windowWidth/4;
  wheelY =  windowHeight/1.5;
  imgWidth = windowWidth/3.5;
  imgHeight = windowHeight/2;
  ballRadius = imgWidth * 0.37;
  ballSize = imgWidth/16;
}



function drawWheel() {
  if (state === 'main' || state === 'spin') {
    imageMode(CENTER);

    ///draw wheel based on the last rotation so angle stay the same. 
    push();
    translate(wheelX, wheelY);
    rotate(currentAngle);
    image(rouletteIMG, 0, 0, imgWidth, imgWidth);
    pop();

    ///draw base of wheel but it doesnt spin
    image(rouletteBaseIMG, wheelX, wheelY, imgWidth + imgWidth/3, imgWidth + imgWidth/3);
  }
}

function animateWheel() {
  ///change the angle that the wheel should be drawn at while its spinnng
  if (state === 'spin' && isSpinning) {

    imageMode(CENTER);
    ///define distance left to travel
    let distanceLeft = targetAngle - currentAngle;

    // start with normal speed
    let step = SPINSTEP;

    // if close to the end slow down
    if (distanceLeft < 4) {
      step = 0.16;
    }
    if (distanceLeft < 2) {
      step = 0.10;
    }
    if (distanceLeft < 0.3) {
      step = 0.06;
      spin.stop();
      stop.play();
    }

    ///if distance left, change angle
    if (currentAngle < targetAngle - step) {
      currentAngle += step;
    }
    else {
      // when close finish the spin and snap to final angle to avoid overshooting
      currentAngle = targetAngle % (2 * Math.PI);

      ///ensure not negative angle
      if (currentAngle < 0) {
        currentAngle += 2 * Math.PI;
      }

      ///snap ball angle to final angle
      ballAngle = ballTargetAngle % (2 * Math.PI);

      ///ensure not negative angle
      if (ballAngle < 0) {
        ballAngle += 2 * Math.PI;
      }

      isSpinning = false;
      calcWinner();
      state = 'main';
    }
  }
}

function startSpin(){
  // function that when state is spin, calculates the winning result and determines the angles
  ///choose a random number that the wheel will land on.
  winningNumber = floor(random(WHEELNUMBERS));
  whiteBallLanding = floor(random(WHEELNUMBERS.length));

  //play sound effect
  spin.play();
      
  ///assign values to the slot index
  let slotIndex = WHEELNUMBERS.indexOf(winningNumber);
  //seperate slots into angles 
  let slotAngle = 2 * Math.PI / WHEELNUMBERS.length;

  ///add extra rotations
  let extraRotations = 2* Math.PI * EXTRASPINS;

  ///determine target angle
  targetAngle = extraRotations - slotIndex * slotAngle;

  ///create pointer offset to make the pointer land in different places.
  let pointerOffset = whiteBallLanding * slotAngle;

  let finalAngle = pointerOffset - slotIndex * slotAngle;


  //set starting angle based on previous angle for a good looking animation
  spinStartAngle = currentAngle;
  targetAngle = finalAngle + 2 * Math.PI * EXTRASPINS;

  ///spin only one direction towards the target angle.
  while (targetAngle <= spinStartAngle) {
    targetAngle += 2 * Math.PI;
  }

  /// handle ball spinning variables.
  ballAngle = 0;
  ballSpeed = -0.25;

  // 0 = 12 o'clock, 1 = one slot clockwise, etc.
  ballTargetAngle = 2 * Math.PI + whiteBallLanding * slotAngle;

  ///isspinning set true to start animation and reset spin progress
  spinProgress = 0;
  isSpinning = true;
  state = 'spin';
}

function animateBall() {
  if (state === 'spin' && isSpinning) {
    // slowly increase speed every frame
    ballSpeed += 0.003;

    // move the ball
    ballAngle += ballSpeed;

    // when ball is close to final slot and moving forward, stop it
    if (ballSpeed > 0 && ballAngle >= ballTargetAngle - 0.05) {
      ballAngle = ballTargetAngle;
    }
  }
}

function drawBall() {
  ///draw the ball based on its animation
  if (state === 'main' || state === 'spin') {
    imageMode(CENTER);
    push();
    translate(wheelX, wheelY);
    rotate(ballAngle);
    image(whiteBall, 0, -ballRadius, ballSize, ballSize);
    pop();
  }
}

function mousePressed() {
  ///mousepressed betting logic
  if (state === 'main') {

    // check if click is inside grid bounds
    let gridWidth = ROWS * cellX;
    let gridHeight = COLS * cellY;


    /// main grid betting
    if (
      mouseX >= betX &&
      mouseX <= betX + gridWidth &&
      mouseY >= betY &&
      mouseY <= betY + gridHeight
    ) {

      // convert mouse position to grid indices
      let gridX = floor((mouseX - betX) / cellX);
      let gridY = floor((mouseY - betY) / cellY);


      // get the number from the grid
      let clickedNumber = bettingGrid[gridX][gridY];
      ///check if bet has already been placed on that number and if player has enough money
      // all .some checks check if there is already a bet on that value and stop mulitple bets.
      if (playerMoney >= 100 && !placedBets.some(bet => bet.value === clickedNumber)) {
        // add the clicked number to the placedBets array

        console.log("Placed bet on: " + clickedNumber);



        placedBets.push({
          type: "number",
          value: clickedNumber,
          gridX: gridX,
          gridY: gridY
        });
        ///deduct money for bet
        playerMoney -= 100;
      }
    }
    /// right side dozens betting
    let rightX = betX + ROWS * cellX;
    if (mouseX >= rightX &&
      mouseX <= rightX + cellX &&
      mouseY >= betY &&
      mouseY <= betY + COLS * cellY
    ) {
      ///1st dozen
      if (playerMoney >= 100 && mouseY >= betY && mouseY < betY + cellY && !placedBets.some(bet => bet.type === "dozen" && bet.value === 1)) {
        placedBets.push({
          type: "dozen",
          value: 1,
        });
        playerMoney -= 100;
        console.log("Placed bet on: 1st 12");
      }
      ///2nd dozen
      if (playerMoney >= 100 && mouseY >= betY + cellY && mouseY < betY + 2 * cellY && !placedBets.some(bet => bet.type === "dozen" && bet.value === 2)) { 
        placedBets.push({
          type: "dozen",
          value: 2,
        });
        playerMoney -= 100;
        console.log("Placed bet on: 2nd 12");
      }
      ///3rd dozen
      if (playerMoney >= 100 && mouseY >= betY + 2 * cellY && mouseY < betY + 3 * cellY && !placedBets.some(bet => bet.type === "dozen" && bet.value === 3)) {
        placedBets.push({
          type: "dozen",
          value: 3,
        });
        playerMoney -= 100;
        console.log("Placed bet on: 3rd 12");
      }
    }

    ///bottom row betting
    let bottomY = betY + COLS * cellY;
    let bottomBoxW = ROWS * cellX / 4;
    if (playerMoney >= 100 && mouseY >= bottomY && mouseY < bottomY + cellY) {
      if (mouseX >= betX && mouseX < betX + bottomBoxW && !placedBets.some(bet => bet.type === "bottom" && bet.value === 1)) {
        placedBets.push({
          type: "bottom",
          value: 1
        });
        playerMoney -= 100;
      }
      else if (mouseX >= betX + bottomBoxW && mouseX < betX + 2 * bottomBoxW && !placedBets.some(bet => bet.type === "bottom" && bet.value === 2)) {
        placedBets.push({
          type: "bottom",
          value: 2
        });
        playerMoney -= 100;
      }
      else if (mouseX >= betX + 2 * bottomBoxW && mouseX < betX + 3 * bottomBoxW && !placedBets.some(bet => bet.type === "bottom" && bet.value === 3)) {
        placedBets.push({
          type: "bottom",
          value: 3
        });
        playerMoney -= 100;
      }
      else if (mouseX >= betX + 3 * bottomBoxW && mouseX < betX + 4 * bottomBoxW  && !placedBets.some(bet => bet.type === "bottom" && bet.value === 4)) {
        placedBets.push({
          type: "bottom",
          value: 4
        });
        playerMoney -= 100;
      }
    }
  }
}



function drawPlacedBets() {
  ///draws the chips on the grid based on where the bets were placed
  if (state === 'main' || state === 'spin') {
    imageMode(CENTER);
    //define local positions
    let rightX = betX + ROWS * cellX;
    let bottomBoxW = ROWS * cellX / 4;
    let bottomY = betY + COLS * cellY;

    for (let bet of placedBets) {

      let chipX = bet.gridX * cellX + betX + cellX / 2;
      let chipY = bet.gridY * cellY + betY + cellY / 2;
      if (bet.type === "number") {
        image(chipImage, chipX, chipY, cellX * 0.6, cellY * 0.4);
      }
      else if (bet.type === "dozen") {
        let dozenX = bet.value === 1 ? rightX + cellX / 2 : rightX + cellX / 2;
        let dozenY = bet.value === 1 ? betY + cellY / 2 : bet.value === 2 ? betY + cellY + cellY / 2 : betY + 2 * cellY + cellY / 2;
        image(chipImage, dozenX, dozenY, cellX * 0.6, cellY * 0.4);
      }
      else if (bet.type === "bottom") {
        let bottomX = bet.value === 1 ? betX + bottomBoxW / 2 : bet.value === 2 ? betX + bottomBoxW + bottomBoxW / 2 : bet.value === 3 ? betX + 2 * bottomBoxW + bottomBoxW / 2 : betX + 3 * bottomBoxW + bottomBoxW / 2;
        let bottomY = betY + COLS * cellY + cellY / 2;
        image(chipImage, bottomX, bottomY, cellX * 0.6, cellY * 0.4);
      }
    }
  }
}
function calcWinner() {
  for (let bet of placedBets) {
    if (bet.type === "number" && bet.value === winningNumber) {
      playerMoney += 100 * 35;
      win.play();
    }
    else if (bet.type === 'number') {
      lose.play();
    }
    else if (bet.type === "dozen") {
      if (bet.value === 1 && FIRSTDOZEN.includes(winningNumber) ||
          bet.value === 2 && SECONDDOZEN.includes(winningNumber) ||
          bet.value === 3 && THIRDDOZEN.includes(winningNumber)) {
        playerMoney += 100 * 3;
        win.play();
      }
      else {
        lose.play();
      }
    }
    else if (bet.type === "bottom") {
      // 1 = red
      // 2 = black
      // 3 = 19 to 36 odd
      /// 4 = 1 to 18 even

      if (bet.value === 1 && REDNUMBERS.includes(winningNumber)) {
        playerMoney += 100 * 2;
        win.play();
      }
      else if (bet.value === 2 && BLACKNUMBERS.includes(winningNumber)) {
        playerMoney += 100 * 2;
        win.play();
      }
      else if (
        bet.value === 3 &&
        winningNumber >= 19 &&
        winningNumber <= 36 &&
        winningNumber % 2 !== 0
      ) {
        playerMoney += 100 * 4;
        win.play();
      }
      else if (
        bet.value === 4 &&
        winningNumber >= 1 &&
        winningNumber <= 18 &&
        winningNumber % 2 === 0
      ) {
        playerMoney += 100 * 4;
        win.play();
      }
      else {
        lose.play();
      }
    }
    placedBets = [];
  }
}


function displayMoney(){
  ///displays the player money in top left corner
  if (state === 'main' || state === 'spin') {
    fill('red');
    textSize(60);
    let money = playerMoney;
    text("Money: $" + money, width * 0.15, height * 0.3);
    
  }
}