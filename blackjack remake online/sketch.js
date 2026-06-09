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

let buttonW;
let buttonH;
let buttonX;
let buttonY;

let cardY;
let dealerCardX;
let dealerCardY;
let cardWidth;
let cardHeight;
let scoreTextY;

let hitButtonX; 
let hitButtonY;
let standButtonX; 
let standButtonY;
let actionButtonW; 
let actionButtonH;

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
    state: "waiting",
    full: false,
    turn: 1,
    results: {
      player1: "",
      player2: "",
      player3: "",
      player4: ""
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (me.seat !== null) {
    mySeat = me.seat;
    myPlayer = players["player" + mySeat];
  }

  else if (players.player1.id === null) {
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
    game.full = true;
  }

  updateLayout();
}




function updateLayout() {
  cardWidth = windowWidth / 12;
  cardHeight = cardWidth * 1.4;

  dealerCardX = windowWidth / 2 - cardWidth;
  dealerCardY = windowHeight / 9;

  cardY = windowHeight * 0.50;

  buttonW = windowWidth / 10;
  buttonH = windowHeight / 14;

  actionButtonW = windowWidth / 10;
  actionButtonH = windowHeight / 14;

  scoreTextY = windowHeight * 0.45;
  
  hitButtonY = windowHeight * 0.75;
  standButtonY = windowHeight * 0.75;
  buttonY = windowHeight * 0.75;
  
  if (mySeat === 1) {
    buttonX = windowWidth * 0.2;
    hitButtonX = windowWidth * 0.15;
    standButtonX = windowWidth * 0.25;
  }
  else if (mySeat === 2) {
    buttonX = windowWidth * 0.4;
    hitButtonX = windowWidth * 0.4;
  }
  else if (mySeat === 3) {
    buttonX = windowWidth * 0.6;
    hitButtonX = windowWidth * 0.6;
  }
  else if (mySeat === 4) {
    buttonX = windowWidth * 0.8;
    hitButtonX = windowWidth * 0.8;
  }

  
}


function draw() {
  background("#374243");

  drawTurnText();
  readyButtons();

  dealDealerCards();
  drawPlayerCards();
  drawHandTotals();
  drawActionButtons();
  drawResults();
  drawResetButton();

  if (partyIsHost()) {
    if (game.state === "waiting" && everyoneReady()) {
      dealCards();
      game.turn = firstActiveSeat();
      game.state = "playing";
    }

    if (game.state === "dealer") {
      dealerPlay();
    }
  }
}


function dealCards() {
  if (!partyIsHost()) {
    return;
  }

  game.dealerCards = [];

  players.player1.cards = [];
  players.player2.cards = [];
  players.player3.cards = [];
  players.player4.cards = [];

  for (let i = 0; i < 2; i++) {
    game.dealerCards.push(getRandomCard());

    if (players.player1.id !== null) {
      players.player1.cards.push(getRandomCard());
    }

    if (players.player2.id !== null) {
      players.player2.cards.push(getRandomCard());
    }

    if (players.player3.id !== null) {
      players.player3.cards.push(getRandomCard());
    }

    if (players.player4.id !== null) {
      players.player4.cards.push(getRandomCard());
    }
  }
}

function drawPlayerCards() {
  drawCardsForPlayer(players.player1, windowWidth * 0.15, cardY);
  drawCardsForPlayer(players.player2, windowWidth * 0.35, cardY);
  drawCardsForPlayer(players.player3, windowWidth * 0.55, cardY);
  drawCardsForPlayer(players.player4, windowWidth * 0.75, cardY);
}


function drawCardsForPlayer(player, x, y) {
  if (player.id === null) {
    return;
  }

  for (let i = 0; i < player.cards.length; i++) {
    let card = player.cards[i];
    let key = values[card.value] + "_" + suits[card.suit];

    image(cardImages[key], x + i * cardWidth * 0.45, y, cardWidth, cardHeight);
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

  shuffleCards(game.deck, true);
}

function shuffleCards(deck, shuffle){
  if (shuffle === 'true'){
    ///reset and shuffle the deck
  }

  ///set shuffle to false
  shuffle = false;

}


function dealDealerCards() {
  if (game.state === "waiting") {
    return;
  }

  for (let i = 0; i < game.dealerCards.length; i++) {
    let card = game.dealerCards[i];
    let key = values[card.value] + "_" + suits[card.suit];

    // hide second dealer card only during player turns
    if (i === 1 && game.state === "playing") {
      image(bOC, dealerCardX + i * cardWidth * 0.6, dealerCardY, cardWidth, cardHeight);
    }
    else {
      image(cardImages[key], dealerCardX + i * cardWidth * 0.6, dealerCardY, cardWidth, cardHeight);
    }
  }

  fill("white");
  textSize(24);
  textAlign(CENTER, CENTER);

  if (game.state !== "playing") {
    text("Dealer: " + getHandValue(game.dealerCards), windowWidth / 2, dealerCardY + cardHeight + 30);
  }
}

function getRandomCard() {
  return {
    suit: floor(random(0, 4)),
    value: floor(random(0, 13))
  };
}


function readyButtons() {
  if (game.state === "waiting" && myPlayer.ready === false) {
    fill("gold");
    rect(buttonX, buttonY, buttonW, buttonH, 10);

    fill("black");
    textAlign(CENTER, CENTER);
    textSize(buttonH * 0.35);
    text("READY", buttonX + buttonW / 2, buttonY + buttonH / 2);
  }
}


function firstActiveSeat() {
  for (let seat = 1; seat <= 4; seat++) {
    let player = players["player" + seat];

    if (player.id !== null) {
      return seat;
    }
  }

  return 1;
}

function nextTurn() {
  let next = game.turn + 1;

  while (next <= 4) {
    let player = players["player" + next];

    if (player.id !== null) {
      game.turn = next;
      return;
    }

    next++;
  }

  game.state = "dealer";
}

function mousePressed() {
  if (
    game.state === "waiting" &&
    collidePointRect(mouseX, mouseY, buttonX, buttonY, buttonW, buttonH)
  ) {
    myPlayer.ready = true;
    return;
  }

  if (game.state === "playing" && game.turn === mySeat) {

    if (collidePointRect(mouseX, mouseY, hitButtonX, hitButtonY, actionButtonW, actionButtonH)) {
      myPlayer.cards.push(getRandomCard());

      if (getHandValue(myPlayer.cards) > 21) {
        nextTurn();
      }

      return;
    }

    if (collidePointRect(mouseX, mouseY, standButtonX, standButtonY, actionButtonW, actionButtonH)) {
      nextTurn();
      return;
    }
  }

  if (game.state === "roundOver") {
    if (collidePointRect(mouseX, mouseY, buttonX, buttonY, buttonW, buttonH)) {
      resetRound();
      return;
    }
  }
}


function dealerPlay() {
  if (!partyIsHost()) {
    return;
  }

  while (getHandValue(game.dealerCards) < 17) {
    game.dealerCards.push(getRandomCard());
  }

  calculateResults();
  game.state = "roundOver";
}


function drawActionButtons() {
  if (game.state === "playing" && game.turn === mySeat) {
    fill("green");
    rect(hitButtonX, hitButtonY, actionButtonW, actionButtonH, 10);

    fill("white");
    textAlign(CENTER, CENTER);
    text("HIT", hitButtonX + actionButtonW / 2, hitButtonY + actionButtonH / 2);

    fill("red");
    rect(standButtonX, standButtonY, actionButtonW, actionButtonH, 10);

    fill("white");
    text("STAND", standButtonX + actionButtonW / 2, standButtonY + actionButtonH / 2);
  }
}

function getHandValue(cards) {
  let total = 0;
  let aces = 0;

  for (let i = 0; i < cards.length; i++) {
    let v = cards[i].value;

    if (v === 0) {
      total += 11;
      aces++;
    }
    else if (v >= 9) {
      total += 10;
    }
    else {
      total += v + 1;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}


function calculateResults() {
  let dealerTotal = getHandValue(game.dealerCards);

  for (let seat = 1; seat <= 4; seat++) {
    let player = players["player" + seat];

    if (player.id !== null) {
      let playerTotal = getHandValue(player.cards);

      if (playerTotal > 21) {
        game.results["player" + seat] = "Bust";
      }
      else if (dealerTotal > 21) {
        game.results["player" + seat] = "Win";
      }
      else if (playerTotal > dealerTotal) {
        game.results["player" + seat] = "Win";
      }
      else if (playerTotal < dealerTotal) {
        game.results["player" + seat] = "Lose";
      }
      else {
        game.results["player" + seat] = "Push";
      }
    }
  }
}


function drawHandTotals() {
  fill("white");
  textSize(24);
  textAlign(CENTER, CENTER);

  if (players.player1.id !== null && players.player1.cards.length > 0) {
    text(getHandValue(players.player1.cards), windowWidth * 0.16, scoreTextY);
  }

  if (players.player2.id !== null && players.player2.cards.length > 0) {
    text(getHandValue(players.player2.cards), windowWidth * 0.36, scoreTextY);
  }

  if (players.player3.id !== null && players.player3.cards.length > 0) {
    text(getHandValue(players.player3.cards), windowWidth * 0.56, scoreTextY);
  }

  if (players.player4.id !== null && players.player4.cards.length > 0) {
    text(getHandValue(players.player4.cards), windowWidth * 0.76, scoreTextY);
  }
}

function drawResults() {
  if (game.state !== "roundOver") {
    return;
  }

  fill("gold");
  textSize(28);
  textAlign(CENTER, CENTER);

  if (players.player1.id !== null) {
    text(game.results.player1, windowWidth * 0.15, scoreTextY*1.05);
  }

  if (players.player2.id !== null) {
    text(game.results.player2, windowWidth * 0.35, scoreTextY*1.05);
  }

  if (players.player3.id !== null) {
    text(game.results.player3, windowWidth * 0.55, scoreTextY*1.05);
  }

  if (players.player4.id !== null) {
    text(game.results.player4, windowWidth * 0.75, scoreTextY *1.05);
  }
}

function drawTurnText() {
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(28);

  if (game.state === "waiting") {
    text("Waiting for players to ready up...", width / 2, height * 0.05);
  }
  else if (game.state === "playing") {
    text("Player " + game.turn + "'s turn", width / 2, height * 0.05);
  }
  else if (game.state === "dealer") {
    text("Dealer is playing...", width / 2, height * 0.05);
  }
  else if (game.state === "roundOver") {
    text("Round Over", width / 2, height * 0.05);
  }
}


function drawResetButton() {
  if (game.state === "roundOver" && partyIsHost()) {
    fill("gold");
    rect(buttonX, buttonY, buttonW, buttonH, 10);

    fill("black");
    textAlign(CENTER, CENTER);
    textSize(buttonH * 0.3);
    text("RESET", buttonX + buttonW / 2, buttonY + buttonH / 2);
  }
}

function resetRound() {
  if (!partyIsHost()) {
    return;
  }

  game.dealerCards = [];
  game.deck = [];
  game.state = "waiting";
  game.turn = 1;

  game.results.player1 = "";
  game.results.player2 = "";
  game.results.player3 = "";
  game.results.player4 = "";

  players.player1.ready = false;
  players.player2.ready = false;
  players.player3.ready = false;
  players.player4.ready = false;

  players.player1.cards = [];
  players.player2.cards = [];
  players.player3.cards = [];
  players.player4.cards = [];
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}