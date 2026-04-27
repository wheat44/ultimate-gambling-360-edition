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
}


function mousePressed() {
  balls.push(new Ball(mouseX, 50, 15));
}
