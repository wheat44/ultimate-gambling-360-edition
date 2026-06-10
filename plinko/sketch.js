// Plinko
// Goal was to use Matter.js to create a realistic plinko style game instead of creating my own physics
//  Sub game for major project website

//physics engine variables
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let engine;
let world;

//game variables
let balls = [];
let pegs = [];
let slots = [];

//money variables and local storage
let playerMoney = parseInt(localStorage.getItem("money")) || 1000;
let bet = 25;

//initializing variables for creating the grid
let startX;
let totalWidth;
let spacing;

//initialzies the multipliers and slot building
let multipliers = [5, 1.5, 1.1, 0.5, 0.25, 0.1, 0.25, 0.5, 1.1, 1.5, 5];
let slotHeight = 100;


let autoBetMode = false;
let autoBetDelay = 750;

//slider variables
let slider;
let sliderSize;
let currentRows = 5;


let newRows = 10;
let changingRowsAllowed = true;
let sliderLocked = false;

//sound variables
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
  
  //starts the physics engine
  engine = Engine.create();
  world = engine.world;

  
  //ensures correct sizing after load
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

//class for the balls to be easily added into the game
class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.body = Bodies.circle(this.x, this.y, r, {
      restitution: 0.35,
      friction: 0.1,
      collisionFilter: { // changes the group so that the balls dont bounce off eachother
        group: -1
      }
    });
    this.r = r;
    this.scored = false; // prevents scoring multiple times

    //add this physics body to the world so Matter.js simulates it
    World.add(world, this.body);
  }

  show() {
    let pos = this.body.position; // gets the real time position from matter.js
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
    //only allow board rebuild when no balls are active
    newRows = slider.value();

    if (newRows !== currentRows) {
      currentRows = newRows;

      //rebiulds the layout
      drawPegs(currentRows);
      createSlots();
    }
  }

  background("#374243");

  Engine.update(engine); //updates gravity, collisions and velocity

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
  //prevents clicking in the UI region mostly so that when you click on the slider it doesn't drop a ball
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
  //only places a bet if the user has enough money
  if (bet <= playerMoney){
    playerMoney -= bet;

    const DROP_HEIGHT = 50;
    const RADIUS = spacing * 0.25;
    let randomSpawn = random(startX + totalWidth/2 - spacing/2, startX + totalWidth/2 + spacing/2); // spawns the ball within the top two pegs
    balls.push(new Ball(randomSpawn, DROP_HEIGHT, RADIUS));

    //plays audio when a ball is dropped
    if (ballDropSound && ballDropSound.isLoaded()) {
      ballDropSound.play();
    }
  }
}

//calls the function in the class ball to show the balls position on the screen
function drawBalls(){
  for (let ball of balls){
    ball.show();
  }
}


//updates the money thats being displayed
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


  //changes the multipliers based on how many rows the user selected
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

  //draws the text so the user knows what the multipliers are
  for (let i = 0; i < multipliers.length; i++){

    let x = slotStartX + i * slotWidth + slotWidth/2;

    text(multipliers[i] + "x", x, height - 30);
  }
}

function createSlots(){
  
  //removes the old slot bodies from physics world
  for (let slot of slots){
    World.remove(world, slot);
  }

  slots = [];

  let slotCount = multipliers.length;

  let slotWidth = spacing;

  let totalSlotWidth = slotCount * slotWidth;
  let slotStartX = width / 2 - totalSlotWidth / 2;
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

  //convert ball x-position into a slot index
  let index = floor((ball.body.position.x - slotStartX) / slotWidth);

  //prevents invalid indexes
  index = constrain(index, 0, multipliers.length - 1);

  let multiplier = multipliers[index];

  //all winning effects, adds money and plays sound
  let winnings = bet * multiplier;
  playerMoney += winnings;
  console.log("Multiplier:", multiplier);
  ball.scored = true;
  ballWinningsSound.play();

  // remove ball after short delay so player can see it settle
  setTimeout(() => {
    World.remove(world, ball.body); //remove the ball from the physics engine
    balls.splice(balls.indexOf(ball),1);
  }, 500);
}

function windowResized(){
  //get game container size so canvas always fits UI layout
  let viewport = document.getElementById("gameViewport");

  let canvasW = viewport.offsetWidth;
  let canvasH = viewport.offsetHeight;

  //resize the p5 canvas to match the container
  resizeCanvas(canvasW, canvasH);

  sliderSize = width * 0.15;
  slider.size(sliderSize);
  slider.position(width * 0.8, height *0.3);

  //rebuilds all physics objects
  drawPegs(currentRows);
  createSlots();
}

let lastAutoBet = 0;


function autoBet() {
//stops autobet if player runs out of money
  if (bet >= playerMoney){
    autoBetMode = false;
  }
  let currentTime = millis();

  //only places a bet after every autoBetDelay milliseconds
  if (currentTime - lastAutoBet > autoBetDelay){
    placeBet();
    lastAutoBet = currentTime;
  }
}

//the key a turns on the auto bet function
function keyPressed(){
  if (key === "a"){
    autoBetMode = !autoBetMode;
  }

}


function drawPegs(rows){

  //removes old peg bodies from the physics world
  //prevents dupliucate copllisions and memory build up
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

  //creates the triangular peg layout
  //each row has one more peg than the one above it
  for (let row = 1; row < rows; row++) {

    let y = 50 + row * spacing;

    let cols = row + 1;

    totalWidth = (cols - 1) * spacing;
    startX = width / 2 - totalWidth / 2;

    for (let col = 0; col < cols; col++) {

      let x = startX + col * spacing;

      let peg = Bodies.circle(x, y, pegRadius, {isStatic: true}); // static body means the object doesnt move to gravity

      pegs.push(peg);
      //adds the pegs to the physics world so they can collide with the balls
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
    // determine how far a slot is from the center

    let center = (multipliers.length - 1) / 2;
    let danger = abs(i - center);

    // 0 = middle, bigger = edges
    let amount = danger / center;

    //colour shifts from yellow to red outsides
    let r = 255;
    let g = 175 - amount * 205;
    let b = 0;

    fill(r, g, b);
    noStroke();

    rect(x + gap/2, height - boxHeight - 10, slotWidth - gap, boxHeight, 12);
  }
}

//draws the text for bets and number of rows
function drawText(){
  fill(255, 200, 0);
  textSize(windowWidth*0.01);

  text("BET: $" + bet, windowWidth * 0.87, windowHeight * 0.08);

  fill("white");
  text("Number Of Columns: " + newRows, windowWidth*0.88, windowHeight*0.125);

}

//scroll wheel to change bet
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
