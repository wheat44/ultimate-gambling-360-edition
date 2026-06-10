// Plinko

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;

let balls = [];
let pegs = [];

let playerMoney = parseInt(localStorage.getItem("money")) || 1000;
let bet = 25;

let startX;
let totalWidth;
let spacing;

let slots = [];
let multipliers = [5, 1.5, 1.1, 0.5, 0.25, 0.1, 0.25, 0.5, 1.1, 1.5, 5];
let slotHeight = 100;

let autoBetMode = false;
let autoBetDelay = 750;

let slider;
let sliderSize;
let currentRows = 5;

let newRows = 10;

let changingRowsAllowed = true;
let sliderLocked = false;

let ballDropSound;
let ballWinningsSound;


function setup() {

  ballDropSound = loadSound("plinko/ballDroppedSound.wav");
  ballWinningsSound = loadSound("plinko/popSoundForWinnings.mp3");

  
  let viewport = document.getElementById("gameViewport");

  let canvasW = viewport.offsetWidth;
  let canvasH = viewport.offsetHeight;

  let canvas = createCanvas(canvasW, canvasH);

  canvas.parent("gameViewport");
  

  engine = Engine.create();
  world = engine.world;

  

  setTimeout(() => {
    windowResized();
  }, 0);
  createSlots();

  //slider scales with the window
  sliderSize = windowWidth *0.1;
  
  //creates a slider up to a max of 16 rows that counts by 2
  slider = createSlider(10, 16, 10, 2);
  slider.size(sliderSize);
  slider.position(width * 0.5, height - 40);
  drawPegs(currentRows);
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.body = Bodies.circle(this.x, this.y, r, {
      restitution: 0.35,
      friction: 0.1,
      collisionFilter: {
        group: -1
      }
    });
    this.r = r;
    this.scored = false;
    World.add(world, this.body);
  }

  show() {
    let pos = this.body.position;
    fill("red");
    noStroke();
    circle(pos.x, pos.y, this.r * 2);
  }
}



function draw() {

  // if a ball is in play lock slider completely
  if (balls.length > 0) {
    slider.value(currentRows); // force it back
  }
  else {
    newRows = slider.value();

    if (newRows !== currentRows) {
      currentRows = newRows;
      drawPegs(currentRows);
      createSlots();
    }
  }

  background("#374243");
  Engine.update(engine);

  if (autoBetMode) {
    autoBet();
  }

  drawText();
  drawBalls();
  drawGrid();
  updateLocalStorage();
  drawMultiplierBoxes();
  drawTheGridAtBottomToDetermineWinnings();

  for (let ball of balls) {
    calculateWinnings(ball);
  }
}


function mousePressed() {

  if (autoBetMode) {
    return;
  }

  if (mouseX > width * 0.65 && mouseY < height * 0.45) {
    return;
  }

  if (mouseY > 100) {
    placeBet();
  }
}

function drawGrid(){
  fill("white");
  noStroke();

  for (let peg of pegs) {
    circle(
      peg.position.x,
      peg.position.y,
      peg.circleRadius * 2
    );
  }
}

function placeBet(){
  if (bet <= playerMoney){
    playerMoney -= bet;

    const DROP_HEIGHT = 50;
    const RADIUS = spacing * 0.25;
    let randomSpawn = random(startX + totalWidth/2 - spacing/2, startX + totalWidth/2 + spacing/2); // spawns the ball within the top two pegs
    balls.push(new Ball(randomSpawn, DROP_HEIGHT, RADIUS));


    if (ballDropSound && ballDropSound.isLoaded()) {
      ballDropSound.play();
    }
  }
}


function drawBalls(){
  for (let ball of balls){
    ball.show();
  }
}


function updateLocalStorage(){
  localStorage.setItem("money", playerMoney);
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;  
  }
}


function drawTheGridAtBottomToDetermineWinnings(){

  fill("white");
  textSize(constrain(spacing * 0.25, 12, 30));

  let slotWidth = spacing;

  let totalSlotWidth = multipliers.length * slotWidth;
  let slotStartX = width / 2 - totalSlotWidth / 2;

  textAlign(CENTER);
  fill(255);
  // textSize(24);

  if (newRows === 10){
    multipliers = [2.5, 1.5, 1.1, 0.5, 0.25, 0.1, 0.25, 0.5, 1.1, 1.5, 2.5];
  }
  if (newRows === 12){
    multipliers = [5, 2.5, 1.1, 0.75, 0.5, 0.25, 0.1, 0.25, 0.5, 0.75, 1.1, 2.5, 5];
  }
  if (newRows === 14){
    multipliers = [8, 5, 1.1, 0.75, 0.6, 0.5, 0.25, 0.1, 0.25, 0.5, 0.6, 0.75, 1.1, 5, 8];
  }
  if (newRows === 16){
    multipliers = [12, 8, 2, 1.1, 0.75, 0.6, 0.5, 0.25, 0.1, 0.25, 0.5, 0.6, 0.75, 1.1, 2, 8, 12];
  }

  for (let i = 0; i < multipliers.length; i++){

    let x = slotStartX + i * slotWidth + slotWidth/2;

    text(
      multipliers[i] + "x",
      x,
      height - 30
    );
  }
}

function createSlots(){


  for (let slot of slots){
    World.remove(world, slot);
  }

  slots = [];

  let slotCount = multipliers.length;

  let slotWidth = spacing;

  let totalSlotWidth = slotCount * slotWidth;
  let slotStartX = width / 2 - totalSlotWidth / 2;

  for (let i = 0; i <= slotCount; i++) {

    let x = slotStartX + i * slotWidth;

    let divider = Bodies.rectangle(
      x,
      height + 75, 
      10,
      slotHeight,
      { isStatic: true }
    );

    slots.push(divider);
    World.add(world, divider);
  }
}

function calculateWinnings(ball){

  // prevent scoring multiple times
  if (ball.scored){
    return;
  } 

  // only score when ball reaches bottom
  if (ball.body.position.y < height - slotHeight){
    return;
  }

  let slotWidth = spacing;

  let totalSlotWidth = multipliers.length * slotWidth;
  let slotStartX = width / 2 - totalSlotWidth / 2;

  let index = floor((ball.body.position.x - slotStartX) / slotWidth);

  index = constrain(index, 0, multipliers.length - 1);

  let multiplier = multipliers[index];

  let winnings = bet * multiplier;

  playerMoney += winnings;

  console.log("Multiplier:", multiplier);

  ball.scored = true;

  ballWinningsSound.play();

  setTimeout(() => {
    World.remove(world, ball.body);
    balls.splice(balls.indexOf(ball),1);
  }, 500);
}

function checkBallLocation(ball){
  return ball.body.position.x;
}

function windowResized(){
  let viewport = document.getElementById("gameViewport");

  let canvasW = viewport.offsetWidth;
  let canvasH = viewport.offsetHeight;

  resizeCanvas(canvasW, canvasH);

  sliderSize = width * 0.15;
  slider.size(sliderSize);
  slider.position(width * 0.8, height *0.3
  );

  drawPegs(currentRows);
  createSlots();
}

let lastAutoBet = 0;

function autoBet() {

  if (bet >= playerMoney){
    autoBetMode = false;
  }
  let currentTime = millis();

  if (currentTime - lastAutoBet > autoBetDelay){
    placeBet();
    lastAutoBet = currentTime;
  }
}

function keyPressed(){
  if (key === "a"){
    autoBetMode = !autoBetMode;
  }

}


function drawPegs(rows){

  for (let peg of pegs){
    World.remove(world, peg);
  }

  pegs = [];

  let maxBoardWidth = width;
  let maxBoardHeight = height * 0.9;

  let spacingX = maxBoardWidth / rows;

  let spacingY = maxBoardHeight / rows;

  spacing = min(spacingX, spacingY);

  let pegRadius = spacing * 0.12;

  for (let row = 1; row < rows; row++) {

    let y = 50 + row * spacing;

    let cols = row + 1;

    totalWidth = (cols - 1) * spacing;
    startX = width / 2 - totalWidth / 2;

    for (let col = 0; col < cols; col++) {

      let x = startX + col * spacing;

      let peg = Bodies.circle(x, y, pegRadius, {
        isStatic: true
      });

      pegs.push(peg);
      World.add(world, peg);
    }
  }
}

function drawMultiplierBoxes(){

  let slotWidth = spacing;

  let totalSlotWidth = multipliers.length * slotWidth;

  let slotStartX = width/2 - totalSlotWidth / 2;


  let gap = 6;
  let boxHeight = spacing;

  for(let i = 0; i < multipliers.length; i++){

    let x = slotStartX + i * slotWidth;


    // distance from center
    let center = (multipliers.length - 1) / 2;
    let danger = abs(i - center);


    // 0 = middle, bigger = edges
    let amount = danger / center;


    let r = 255;
    let g = 175 - amount * 205;
    let b = 0;


    fill(r, g, b);
    noStroke();


    rect(x + gap/2, height - boxHeight - 10, slotWidth - gap, boxHeight, 12);
  }
}

function drawText(){
  fill(255, 200, 0);
  textSize(windowWidth*0.01);

  text("BET: $" + bet, windowWidth * 0.87, windowHeight * 0.08);

  fill("white");
  text("Number Of Rows: " + newRows, windowWidth*0.88, windowHeight*0.125);

}

function mouseWheel(event) {
  if (balls.length === 0){
    if (event.delta < 0) {
      bet += 5;
    }
    else {
      bet -= 5;
    }
    bet = constrain(bet, 5, 500);
    return false; 
  }
}
