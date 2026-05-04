// Plinko

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;

let balls = [];
let pegs = [];

let playerMoney = parseInt(localStorage.getItem("money"));

let bet = 25;

let startX;
let totalWidth;
let spacing;

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  let rows = 10;
  spacing = 80;

  for (let row = 1; row < rows; row++) {

    let y = 100 + row * spacing;

    // number of pegs increases each row
    let cols = row + 1;

    // center the row
    totalWidth = (cols - 1) * spacing;
    startX = width / 2 - totalWidth / 2;

    for (let col = 0; col < cols; col++) {

      let x = startX + col * spacing;

      let peg = Bodies.circle(x, y, 8, { isStatic: true });
      pegs.push(peg);
      World.add(world, peg);
    }
  }
}

class Ball {
  constructor(x, y, r) {
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.5,
      friction: 0.1,
      collisionFilter: {
        group: -1
      }
    });
    this.r = r;
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
  background(0);
  Engine.update(engine);

  drawBalls();
  drawGrid();
  updateLocalStorage();
}


function mousePressed() {
  if (mouseY > 100){
    let randomSpawn = random(startX + totalWidth/2 - spacing/2, startX + totalWidth/2 + spacing/2); // spawns the ball within the top two pegs
    const DROP_HEIGHT = 100;
    const RADIUS = 20;
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
  localStorage.money = playerMoney;
}

function drawText(){
  text("Money" + playerMoney, width/2, height/2);
}