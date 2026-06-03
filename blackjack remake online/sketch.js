// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


state = 'server';


let cardImages = [];
let suits = ["spades", "hearts", "diamonds", "clubs"];
let values = [ "ace","2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
let player1Cards = [];
let player2Cards = []; 
let player3Cards = []; 
let player4Cards = []; 
let dealerCards = [];


let pos = {x: 0, y: 0};

function preload() {
  // connect to a p5party server
  bOC = loadImage('blackjack remake online/Assets/Cards/back_of_card.png');

  ///load cards using a nested loop
  for (let index = 0; index < 4; index++) {
    for (let j = 0; j < 13; j++) {
      let fileName = values[j] + "_of_" + suits[index] + ".svg";
      let key = values[j] + "_" + suits[index];
      /// key in form 2_Spades

      cardImages[key] = loadImage("blackjack remake online/Assets/Cards/" + fileName);
    }
  }
  partyConnect(
    "wss://demoserver.p5party.org",
    "hello_party"
  );
  
  // tell p5.party to sync the pos object
  shareServer();

  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#374243");
  ellipse(pos.x, pos.y, 100, 100);
}

function mousePressed() {
  pos.x = mouseX;
  pos.y = mouseY;
}

function dealCards(){
  
}

function shareServer(){
  pos = partyLoadShared("pos", pos);
}