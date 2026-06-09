///Global Variables
let playerMoney = parseInt(localStorage.getItem("money")) || 5000;
state = 'main';

const REDNUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACKNUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
let bettingGrid = [];
let placedBets = [];
const ROWS = 12;
const COLS = 3;

let wheelRotation = 0;
let startRotation = 0;
let targetRotation = 0;
let spinProgress = 0;
let spinning = false;
let spinResult = null;
let spinSpeed = 0.0035;
let hasWon = false;

///button variables
let buttonX;
let buttonY;
let buttonH;
let buttonW;

let wheelNumbers = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22,
  34, 15, 3, 24, 36, 13, 1, "00", 27, 10, 25, 29,
  12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];

let betX;
let betY;
let cellX;
let cellY;
let chipR = 40;
let betAmount = 100;

function setup() {
  createCanvas(windowWidth, windowHeight - 80);
  createGrid();
  updateLayout();
  win = loadSound('roulette/Assets/audio/se/r88_Casino_se/win.mp3');
  lose = loadSound('roulette/Assets/audio/se/r88_Casino_se/lose.mp3');
  spin = loadSound('roulette/Assets/audio/se/r88_Casino_se/roulette_spin.ogg');
  stop = loadSound('roulette/Assets/audio/se/r88_Casino_se/roulette_stop.ogg');
}

function updateLayout() {
  /// all locations/ layout variables called in setup and resize functions
  betX = windowWidth / 2;
  betY = windowHeight / 5;
  cellX = windowWidth / 30;
  cellY = windowHeight / 9;
  chipR = cellX * 0.8;
  circleX = windowWidth / 4;
  circleY = windowHeight / 2.3;
  circleR = windowWidth  / 8;
  menuWidth = windowWidth / 2;
  menuHeight = 100;
  buttonH = windowHeight/ 10;
  buttonW = windowWidth / 10;
  buttonX = windowWidth / 4;
  buttonY = windowHeight / 1.3;
}



function draw() {
  background("#374243");

  updateLocalStorage();
  drawGrid();
  createExtraSquares();
  drawPlacedBets();
  drawrouletteWheel();
  drawBetSelection();
  spinWheel();
  spinButton();
}


function updateLocalStorage(){
  ///constantly updates local storage
  localStorage.setItem("money", playerMoney);
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;
  }
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
      textSize(cellX * 0.4);
      textAlign(CENTER, CENTER);
      text(bettingGrid[x][y], betTextX, betTextY);
    }
  }
}


function createExtraSquares(){
  ///creates all accessory squares that exist outside the main grid

  /// two to one 
  for (let y = 0; y < COLS; y++){
    fill('green');
    rect(betX + cellX * ROWS , betY + cellY * y,cellX,cellY);
    fill('white');
    textSize(cellX * 0.4);
    textAlign(CENTER, CENTER);
    text("2 to 1", betX + cellX * ROWS + cellX/2,betY + cellY * y + cellY/2);
  }
  /// 0's and 00's
  for (let y = 0; y < 2; y++){
    fill('green');
    rect(betX - cellX , betY + cellY *1.5 * y ,cellX,cellY* 1.5);

    textSize(cellX * 0.4);
    textAlign(CENTER, CENTER);
    fill('white');
    ///draw text based on y value to determine if 0 or 00
    if (y === 0){
      text("0", betX - cellX/2, betY + cellY * 1.5 * y + cellY*0.75);
    }
    else {
      text("00", betX - cellX/2, betY + cellY * 1.5 * y + cellY*0.75);
    }
  }

  /// dozens
  for (let x = 0; x < 3; x++){
    fill('green');
    rect(betX + 4*cellX * x , betY + cellY * COLS,cellX * 4  ,cellX);
    fill('white');
    textSize(cellX * 0.4);
    textAlign(CENTER, CENTER);
    text(x + 1 +" Dozen", betX + 4*cellX * x + cellX*2, (cellX/2 , betY + cellY *COLS) + cellX/2);
  }

  /// bottom row
  for (let x = 0; x < 6; x++){
    /// determine colour and text based on squares x value in order
    
    if (x === 2){
      colour = 'Red';
    }
    else if (x === 3)  {
      colour = 'Black';
    }
    else {
      colour = 'green';
    }

    if (x === 0) {
      squareText = "1 to 18";
    }
    else if (x === 1) {
      squareText = "Even";
    }
    else if (x === 4) {
      squareText = "Odd";
    }
    else if (x === 5) {
      squareText = "19 to 36";
    }

    fill(colour);
    rect(betX + 2*cellX * x , betY + cellY * COLS + cellX ,cellX * 2 ,cellX);
    textSize(cellX * 0.4);
    textAlign(CENTER, CENTER);
    fill('white');
    if (x === 2 || x === 3){
      text(colour, betX + 2*cellX * x + cellX, (cellX/2 , betY + cellY *COLS) + cellX*1.5);
      text(colour, betX + 2*cellX * x + cellX, (cellX/2 , betY + cellY *COLS) + cellX*1.5);
    }
    else {
      text(squareText, betX + 2*cellX * x + cellX, (cellX/2 , betY + cellY *COLS) + cellX*1.5);
    }
  }
}




function mousePressed() {
  let betType = getTypeFromGrid(mouseX, mouseY);
    // check if spin button was clicked
  if (spinning === false && collidePointRect(mouseX, mouseY, buttonX - buttonW / 2, buttonY - buttonH / 2, buttonW, buttonH)) {
    let output = tempRandomOutput();
    spinToNumber(output);
    spin.play();
    return;
  }

  if (betType !== null) {
    // if its a valid bet, log the bet into the array
    let bet = {
      x: mouseX,
      y: mouseY,
      value: betType,
      numbers: [],
      amount: betAmount
    };

    // call snapBet function to snap the bet to the right place
    snapBet(bet);

    if (bet.value !== null && playerMoney >= betAmount) {
      saveBetUnits(bet);

      let amountAdded = addOrIncreaseBet(bet);
      playerMoney -= amountAdded;
    }
  }
}

function snapBet(bet) {
  /// given the bet object, snap it to the right place and determine what numbers it covers

  /// if its a nubmer bet snap to center of the square
  if (bet.value === "number") {
    let snapX = cellX / 2;
    let snapY = cellY / 2;

    bet.x = round((bet.x - betX) / snapX) * snapX + betX;
    bet.y = round((bet.y - betY) / snapY) * snapY + betY;

    // block outside edges, ie dont let it snap outside of numbers section and just return null
    if (
      bet.x === betX || bet.x === betX + cellX * ROWS ||
    bet.y === betY || bet.y === betY + cellY * COLS
    ) {
      bet.value = null;
      return;
    }


    let colPos = round((bet.x - betX) / (cellX / 2)) / 2;
    let rowPos = round((bet.y - betY) / (cellY / 2)) / 2;

    let nums = [];

    // center of one square
    if (colPos % 1 === 0.5 && rowPos % 1 === 0.5) {
      let col = floor(colPos);
      let row = floor(rowPos);

      nums.push(bettingGrid[col][row]);
      bet.value = "straight";
    }

    // vertical split left/right
    else if (colPos % 1 === 0 && rowPos % 1 === 0.5) {
      let leftCol = colPos - 1;
      let rightCol = colPos;
      let row = floor(rowPos);

      nums.push(bettingGrid[leftCol][row]);
      nums.push(bettingGrid[rightCol][row]);
      bet.value = "split";
    }

    // horizontal split top/bottom
    else if (colPos % 1 === 0.5 && rowPos % 1 === 0) {
      let col = floor(colPos);
      let topRow = rowPos - 1;
      let bottomRow = rowPos;

      nums.push(bettingGrid[col][topRow]);
      nums.push(bettingGrid[col][bottomRow]);
      bet.value = "split";
    }

    /// corner four numbers
    else if (colPos % 1 === 0 && rowPos % 1 === 0) {
      let leftCol = colPos - 1;
      let rightCol = colPos;
      let topRow = rowPos - 1;
      let bottomRow = rowPos;

      nums.push(bettingGrid[leftCol][topRow]);
      nums.push(bettingGrid[rightCol][topRow]);
      nums.push(bettingGrid[leftCol][bottomRow]);
      nums.push(bettingGrid[rightCol][bottomRow]);
      bet.value = "corner";
    }

    bet.numbers = nums;
  }
  else if (bet.value === "0 or 00") {
    bet.x = betX - cellX / 2;

    // top half is 0
    if (bet.y < betY + cellY * 1.5) {
      bet.y = betY + cellY * 0.75;
      bet.value = "0";
      bet.numbers = [0];
    }

    // bottom half is 00
    else {
      bet.y = betY + cellY * 2.25;
      bet.value = "00";
      bet.numbers = ["00"];
    }
  }

  else if (bet.value === "2 to 1") {
    // snap to center of the right-side row box
    let row = floor((bet.y - betY) / cellY);

    bet.x = betX + cellX * ROWS + cellX / 2;
    bet.y = betY + row * cellY + cellY / 2;
    bet.row = row;
  }

  else if (bet.value === "Dozen") {
    // snap to center of the correct dozen
    let dozen = floor((bet.x - betX) / (cellX * 4));

    bet.x = betX + dozen * cellX * 4 + cellX * 2;
    bet.y = betY + cellY * COLS + cellX / 2;

    bet.value = "Dozen " + (dozen + 1);
  }

  else if (bet.value === "Bottom Row") {
    // snap to center of the correct bottom-row outside bet
    let bottom = floor((bet.x - betX) / (cellX * 2));

    bet.x = betX + bottom * cellX * 2 + cellX;
    bet.y = betY + cellY * COLS + cellX * 1.5;

    if (bottom === 0) {
      bet.value = "1 to 18";
    }
    else if (bottom === 1) {
      bet.value = "Even";
    }
    else if (bottom === 2) {
      bet.value = "Red";
    }
    else if (bottom === 3) {
      bet.value = "Black";
    }
    else if (bottom === 4) {
      bet.value = "Odd";
    }
    else if (bottom === 5) {
      bet.value = "19 to 36";
    }
  }
}


function drawPlacedBets() {
  for (let i = 0; i < placedBets.length; i++) {
    ///change the colour of the chip based on amount bet
    let bet = placedBets[i];
    fillColours = ['yellow','orange','green','cyan','purple','cyan','red','white','yellow','violet','blue'];
    colourChoice = fillColours[bet.amount/100];

    ///draw the actual bets
    fill(colourChoice);
    circle(bet.x, bet.y, chipR);

    fill("black");
    textSize(chipR * 0.35);
    textAlign(CENTER, CENTER);
    text("$" + bet.amount, bet.x, bet.y);


  }
}

function saveBetUnits(bet) {
  ///saves the betting units rather than absolute position so that they can be resized properly when the window size changes
  bet.xUnit = (bet.x - betX) / cellX;
  bet.yUnit = (bet.y - betY) / cellY;
}

function resizePlacedBets() {
  ///resize and relocated the placed bets based on changed window size
  for (let i = 0; i < placedBets.length; i++) {
    let bet = placedBets[i];

    bet.x = betX + bet.xUnit * cellX;
    bet.y = betY + bet.yUnit * cellY;
  }
}


function getTypeFromGrid(x, y) {
  //// determines what type of bet the user is trying to place based on where they click, returns null if they click an invalid spot
  if (x < betX && x > betX - cellX && y > betY && y < betY + cellY * 3) {
    return "0 or 00";
  }
  else if (x > betX + cellX * ROWS && x < betX + cellX * (ROWS + 1) && y > betY && y < betY + cellY * COLS) {
    return "2 to 1";
  }
  else if (y > betY + cellY * COLS && y < betY + cellY * COLS + cellX && x > betX && x < betX + cellX * ROWS) {
    return "Dozen";
  }
  else if (y > betY + cellY * COLS + cellX && y < betY + cellY * COLS + 2*cellX && x > betX && x < betX + cellX * ROWS) {
    return "Bottom Row";
  }
  else if (y > betY && y < betY + cellY * COLS && x > betX && x < betX + cellX * ROWS) {
    return "number";
  }
  return null;
}

function addOrIncreaseBet(newBet) {
  for (let i = 0; i < placedBets.length; i++) {
    let oldBet = placedBets[i];

    // same snapped chip location = same bet spot
    if (oldBet.x === newBet.x && oldBet.y === newBet.y) {

      // already maxed, add nothing
      if (oldBet.amount >= 1000) {
        return 0;
      }

      // only add up to the max
      let spaceLeft = 1000 - oldBet.amount;
      let amountToAdd = min(newBet.amount, spaceLeft);

      oldBet.amount += amountToAdd;
      return amountToAdd;
    }
  }

  // new bet spot
  placedBets.push(newBet);
  return newBet.amount;
}

function keyPressed() {
  if (key === 'Enter' && spinning === false) {
    let output = tempRandomOutput();

    spinToNumber(output);

    console.log("the output is: " + output);
  }
}

function spinButton(){
  if (spinning === false){
    ///draw the spin button
    rectMode(CENTER);
    fill(212,141,51);
    rect(buttonX, buttonY, buttonW, buttonH);
    fill('white');
    text('SPIN!', buttonX, buttonY);
    rectMode(CORNER);
    
  }
  
}

function displayResult(output) {

}




function calcResult(output) {
  let totalWinnings = 0;

  for (let i = 0; i < placedBets.length; i++) {
    ///go through each bet and determine if its a winner
    let bet = placedBets[i];
    let won = false;

    // straight, split, corner, 0, 00
    if (bet.numbers.includes(output)) {
      won = true;
    }

    // dozens
    else if (bet.value === "Dozen 1" && output >= 1 && output <= 12) {
      won = true;
    }
    else if (bet.value === "Dozen 2" && output >= 13 && output <= 24) {
      won = true;
    }
    else if (bet.value === "Dozen 3" && output >= 25 && output <= 36) {
      won = true;
    }

    // bottom row
    else if (bet.value === "1 to 18" && output >= 1 && output <= 18) {
      won = true;
    }
    else if (bet.value === "19 to 36" && output >= 19 && output <= 36) {
      won = true;
    }
    else if (bet.value === "Even" && output !== 0 && output !== "00" && output % 2 === 0) {
      won = true;
    }
    else if (bet.value === "Odd" && output !== 0 && output !== "00" && output % 2 === 1) {
      won = true;
    }
    else if (bet.value === "Red" && REDNUMBERS.includes(output)) {
      won = true;
    }
    else if (bet.value === "Black" && BLACKNUMBERS.includes(output)) {
      won = true;
    }

    // 2 to 1
    else if (bet.value === "2 to 1") {
      for (let col = 0; col < ROWS; col++) {
        if (bettingGrid[col][bet.row] === output) {
          won = true;
        }
      }
    }

    /// if they won check what type of bet it was for multiplyer
    if (won) {
      let winnings = bet.amount * getPayout(bet.value);
      totalWinnings += winnings;
      hasWon = true;
    }
  }

  playerMoney += totalWinnings;
  ///determine the sound effect to play
  if (hasWon) {
    win.play();
  }
  else {
    lose.play();
  }
  ///reset winnings for next round
  hasWon = false;

  // reset placed bets aftrer each spin
  placedBets = [];
}

function tempRandomOutput(){
  /// for testing purposes, outputs a random number from 0-36 or 00 when you click the canvas
  let output;
  let rand = random(0, 38);
  if (rand < 37) {
    output = floor(rand);
  }
  else {
    output = "00";
  }
  return output;
}


function getPayout(type) {
  // total return multiplier, including the original bet
  if (type === "straight" || type === "0" || type === "00") {
    return 36;
  }
  else if (type === "split") {
    return 18;
  }
  else if (type === "corner") {
    return 9;
  }
  else if (type.startsWith("Dozen")) {
    return 3;
  }
  else if (type === "2 to 1") {
    return 3;
  }
  else {
    // red, black, odd, even, 1 to 18, 19 to 36
    return 2;
  }
}

function drawrouletteWheel() {
  ///function to draw the actual roulette wheel
  let totalSlots = wheelNumbers.length;
  let angleSize = TWO_PI / totalSlots;

  push();
  translate(circleX, circleY);
  rotate(wheelRotation);

  // outer wheel
  fill("brown");
  circle(0, 0, circleR * 2.2);

  // number slots
  for (let i = 0; i < totalSlots; i++) {
    let num = wheelNumbers[i];

    let startAngle = i * angleSize - HALF_PI;
    let endAngle = startAngle + angleSize;

    if (num === 0 || num === "00") {
      fill("green");
    }
    else if (REDNUMBERS.includes(num)) {
      fill("red");
    }
    else {
      fill("black");
    }

    arc(0, 0, circleR * 2, circleR * 2, startAngle, endAngle, PIE);

    let textAngle = startAngle + angleSize / 2;
    let textX = cos(textAngle) * circleR * 0.78;
    let textY = sin(textAngle) * circleR * 0.78;

    push();
    translate(textX, textY);
    rotate(textAngle + HALF_PI);
    fill("white");
    textSize(circleR * 0.12);
    textAlign(CENTER, CENTER);
    text(num, 0, 0);
    pop();
  }

  // inner wheel circles
  fill("#8B5A2B");
  circle(0, 0, circleR * 1.25);

  fill("#d6b36a");
  circle(0, 0, circleR * 0.75);

  fill("#eeeeee");
  circle(0, 0, circleR * 0.18);

  pop();

  // pointer at top, not rotated with the wheel
  fill("yellow");
  triangle(
    circleX, circleY - circleR - 20,
    circleX - 12, circleY - circleR + 10,
    circleX + 12, circleY - circleR + 10
  );
}


function drawBetSelection(){
  /// draws a betting selectio menu on the bottom of the screen
  fill('black');
  rect(0, windowHeight - 100, windowWidth, 100);
}

function spinWheel() {
  if (spinning) {
    spinProgress += spinSpeed;

    if (spinProgress >= 1) {
      spinProgress = 1;
    }

    // ease-out: fast at first, slow at the end
    let easedProgress = 1 - pow(1 - spinProgress, 3);

    wheelRotation = lerp(startRotation, targetRotation, easedProgress);

    if (spinProgress >= 1) {
      wheelRotation = targetRotation;
      spin.stop();
      stop.play();
      spinning = false;
      state = "main";

      calcResult(spinResult);
      displayResult(spinResult);
    }
  }
}

function spinToNumber(output) {
  spinResult = output;
  spinning = true;
  state = "spin";

  spinProgress = 0;
  startRotation = wheelRotation;

  let index = wheelNumbers.indexOf(output);
  let angleSize = TWO_PI / wheelNumbers.length;

  //the center angle of the chosen slot
  let numberAngle = index * angleSize + angleSize / 2 - HALF_PI;

  //the pointer is at the top
  let pointerAngle = -HALF_PI;

  ///rotation needed to bring chosen number to pointer
  let neededRotation = pointerAngle - numberAngle;

  //convert that to a positive clockwise amount
  while (neededRotation < 0) {
    neededRotation += TWO_PI;
  }

  ///add many full spins
  let extraSpins = TWO_PI * 6;

  targetRotation = startRotation + extraSpins + neededRotation;
}




function windowResized() {
  createCanvas(windowWidth, windowHeight - 80);
  updateLayout();
  resizePlacedBets();
}
