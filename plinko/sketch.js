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
let multipliers = [10, 2.5, 1.5, 1.1, 0.25, 0.1, 0.25, 1.1, 1.5, 2.5, 10];
let slotHeight = 100;

let autoBetMode = true;
let autoBetDelay = 500;

let slider;
let sliderSize;
let currentRows = 5;



function setup() {
  let viewport = document.getElementById("gameViewport");

  let canvasW = viewport.offsetWidth;
  let canvasH = viewport.offsetHeight;

  let canvas = createCanvas(canvasW, canvasH);

  canvas.parent("gameViewport");

  engine = Engine.create();
  world = engine.world;

  let rows = 10;
  spacing = 80;

  setTimeout(() => {
    windowResized();
  }, 0);
  createSlots();

  //slider scales with the window
  sliderSize = windowWidth *0.33;
  
  //creates a slider up to a max of 24 so there is still one safe tile left and sets size
  slider = createSlider(10, 15, 10, 1);
  slider.size(sliderSize);
  slider.position(windowWidth/1.1 - sliderSize/2, windowHeight * 0.95);

  drawPegs(currentRows);
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.body = Bodies.circle(this.x, this.y, r, {
      restitution: 0.3,
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
  
  let newRows = slider.value();

  if (newRows !== currentRows){
    currentRows = newRows;
    drawPegs(currentRows);
  }

  background("#374243");
  Engine.update(engine);
  drawBalls();
  drawGrid();
  updateLocalStorage();
  drawTheGridAtBottomToDetermineWinnings();
  for (let ball of balls){
    calculateWinnings(ball);
  }
}


function mousePressed() {
  if (mouseY > 100){
    let randomSpawn = random(startX + totalWidth/2 - spacing/2, startX + totalWidth/2 + spacing/2); // spawns the ball within the top two pegs
    const DROP_HEIGHT = 50;
    const RADIUS = 22;
    balls.push(new Ball(randomSpawn, DROP_HEIGHT, RADIUS));
    placeBet();
  }
}


function drawGrid(){
  fill("white");
  noStroke();
  for (let peg of pegs) {
    circle(peg.position.x, peg.position.y, 20);
  }
}

function placeBet(){
  if (bet <= playerMoney){
    playerMoney -= bet;
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

  for (let slot of slots){
    rectMode(CENTER);

    rect(
      slot.position.x,
      slot.position.y,
      10,
      slotHeight
    );
  }

  let slotWidth = spacing;

  let totalSlotWidth = multipliers.length * slotWidth;
  let slotStartX = width / 2 - totalSlotWidth / 2;

  textAlign(CENTER);
  fill(255);
  textSize(24);

  for (let i = 0; i < multipliers.length; i++){

    let x = slotStartX + i * slotWidth + slotWidth / 2;

    text(
      multipliers[i] + "x",
      x,
      height - 30
    );
  }
}

function createSlots(){
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
}

function checkBallLocation(ball){
  return ball.body.position.x;
}

function windowResized(){
  let viewport = document.getElementById("gameViewport");

  let canvasW = viewport.offsetWidth;
  let canvasH = viewport.offsetHeight;

  resizeCanvas(canvasW, canvasH);

}

function autoBet(){
  while(autoBetMode && frameCount % 60 === 0){
    balls.push(new Ball(randomSpawn, DROP_HEIGHT, RADIUS));
  }
}

function drawPegs(rows){

  for (let peg of pegs){
    World.remove(world, peg);
  }

  pegs = [];

  for (let row = 1; row < rows; row++) {

    let y = 25 + row * spacing;

    let cols = row + 1;

    totalWidth = (cols - 1) * spacing;
    startX = width / 2 - totalWidth / 2;

    for (let col = 0; col < cols; col++) {

      let x = startX + col * spacing;

      let peg = Bodies.circle(x, y, 8, {
        isStatic: true
      });

      pegs.push(peg);
      World.add(world, peg);
    }
  }
}