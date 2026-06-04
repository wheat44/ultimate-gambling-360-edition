// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"




let cardImages = [];
let suits = ["spades", "hearts", "diamonds", "clubs"];
let values = [ "ace","2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

let me;
let myPlayer;
let mySeat = null;


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

  me = partyLoadMyShared({
    seat: null
  });

  players = partyLoadShared("players", {
    player1: {
      id: null,
      ready: false,
      cards: []
    },

    player2: {
      id: null,
      ready: false,
      cards: []
    },

    player3: {
      id: null,
      ready: false,
      cards: []
    },

    player4: {
      id: null,
      ready: false,
      cards: []
    }
  });

  game = partyLoadShared("game", {
    dealerCards: [],
    deck: [],
    state: "waiting"
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //for each player get their client id and assign it to the first available seat

  // Already seated?
  if (me.seat !== null) {
    mySeat = me.seat;
    myPlayer = players["player" + mySeat];
    return;
  }

  // otherwise claim a seat
  if (players.player1.id === null) {
    mySeat = 1;
    me.seat = 1;
    players.player1.id = 'p1';
    myPlayer = players.player1;
  }

  else if (players.player2.id === null) {
    mySeat = 2;
    me.seat = 2;
    players.player2.id = 'p2';
    myPlayer = players.player2;
  }

  else if (players.player3.id === null) {
    mySeat = 3;
    me.seat = 3;
    players.player3.id = 'p3';
    myPlayer = players.player3;
  }

  else if (players.player4.id === null) {
    mySeat = 4;
    me.seat = 4;
    players.player4.id = 'p4';
    myPlayer = players.player4;
  }

  else {
    game.state = "full";
  }
}


function draw() {
  background("#374243");

  if (partyIsHost()) {
    if (game.state === "waiting" && everyoneReady()) {
      dealCards();
      game.state = "playing";
    }
  }
}


function dealCards(){
  ///clear everyones cards

  ///
  ///assign cards to everyone

  ///assign 2 dealer cards
  for (let index = 0; index < 2; index++) {
    game.dealerCards.push({
      suit: floor(random(0,4)),
      value: floor(random(0,13))
    });
  }
}

function everyoneReady() {

  if (players.player1.id !== null && !players.player1.ready) {
    return false;
  }

  if (players.player2.id !== null && !players.player2.ready) {
    return false;
  }

  if (players.player3.id !== null && !players.player3.ready) {
    return false;
  }

  if (players.player4.id !== null && !players.player4.ready) {
    return false;
  }

  return true;
}


function buildDeck() {
  game.deck = [];

  for (let s = 0; s < 4; s++) {
    for (let v = 0; v < 13; v++) {
      game.deck.push({ suit: s, value: v });
    }
  }

  shuffle(game.deck, true);
}

function shuffle(){
  
}


function drawDealerCards(){

}