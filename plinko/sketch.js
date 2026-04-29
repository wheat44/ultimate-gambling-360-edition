// Plinko

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;

let balls = [];
let pegs = [];


function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  let rows = 10;
  let spacing = 80;

  for (let row = 0; row < rows; row++) {

    let y = 100 + row * spacing;

    // number of pegs increases each row
    let cols = row + 1;

    // center the row
    let totalWidth = (cols - 1) * spacing;
    let startX = width / 2 - totalWidth / 2;

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
      friction: 0.1
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

  for (let ball of balls){
    ball.show();
  }
  fill("white");
  noStroke();

  for (let peg of pegs) {
    circle(peg.position.x, peg.position.y, 20);
  }
}


function mousePressed() {
  balls.push(new Ball(mouseX, 50, 12));
}
