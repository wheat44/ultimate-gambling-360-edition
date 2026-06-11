//Blackjack Remake
//uses p5 party to create a 4 player to one dealer environment


///dont forget to remove the temp auto seat assigning that was changed, just ctrl f temp

///card arrays
let cardImages = [];
let suits = ["spades", "hearts", "diamonds", "clubs"];
let values = [ "ace","2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];


//individual player variables
let me;
let myPlayer;
let mySeat = null;
let myId;

///button/location Variables
let buttonW;
let buttonH;
let buttonX;
let buttonY;
let seatX = [];
let seatY;
let seatButtonY;
let infoY;
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

///betting varaibles
let betAmount = 100;
let paidThisRound = false;


function preload() {
  ///load images
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
  ///connect to p5 party server
  partyConnect(
    "wss://demoserver.p5party.org",
    "blackJackMain",
  );

  ///assign me variable to shared server
  me = partyLoadMyShared({
    seat: null
  });

  ///assign players varible to shared server
  players = partyLoadShared("players", {
    player1: {
      id: null,
      ready: false,
      cards: [],
      balance: 0,
      bet: 0
    },

    player2: {
      id: null,
      ready: false,
      cards: [],
      balance: 0,
      bet: 0
    },

    player3: {
      id: null,
      ready: false,
      cards: [],
      balance: 0,
      bet: 0
    },

    player4: {
      id: null,
      ready: false,
      cards: [],
      balance: 0,
      bet: 0
    }
  });

  ///assign game variables to shared server
  game = partyLoadShared("game", {
    dealerCards: [],
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

  ///assign each player their id based on if they already have one
  myId = sessionStorage.getItem("blackjackId");

  if (myId === null) {
    ///if they dont have one assing them in form player_# then set it
    myId = "player_" + floor(random(1000000, 9999999));
    sessionStorage.setItem("blackjackId", myId);
  }

  ///reset mySeat and myPlayer each time someone connects
  mySeat = null;
  myPlayer = null;

  ///temp, remove when seat seleciton is done to not auto do it. make sure it works after
  for (let seat = 1; seat <= 4; seat++) {
    let player = players["player" + seat];

    if (player.id === myId) {
      mySeat = seat;
      me.seat = seat;
      myPlayer = player;
    }
  }

  updateLayout();
}



function updateLayout() {
  ///update layout function that assings all variables so i dont have to do each thing twice in resize and setup
  cardWidth = windowWidth / 13;
  cardHeight = cardWidth * 1.4;

  dealerCardX = windowWidth / 2 - cardWidth * 0.6;
  dealerCardY = windowHeight * 0.12;

  seatX = [
    ///x values for seat button loations
    windowWidth * 0.16,
    windowWidth * 0.38,
    windowWidth * 0.60,
    windowWidth * 0.82
  ];

  cardY = windowHeight * 0.52;
  infoY = windowHeight * 0.45;
  scoreTextY = infoY;

  buttonW = windowWidth * 0.12;
  buttonH = windowHeight * 0.07;

  actionButtonW = windowWidth * 0.10;
  actionButtonH = windowHeight * 0.07;

  seatY = cardY;
  seatButtonY = cardY * 1.3;

  buttonY = windowHeight * 0.78;
  hitButtonY = windowHeight * 0.78;
  standButtonY = windowHeight * 0.78;

  if (mySeat !== null) {
    ///if i have a seat assign my seatX value
    buttonX = seatX[mySeat - 1] - buttonW / 2;

    hitButtonX = seatX[mySeat - 1] - actionButtonW - 10;
    standButtonX = seatX[mySeat - 1] + 10;
  }
}


function draw() {
  background("#374243");

  ///constantly keep the paidThisRound FUnction false
  if (game.state === "waiting") {
    paidThisRound = false;
  }


  drawTurnText();
  drawSeatSelect();
  drawBetAmount();
  readyButtons();
  updateLocalStorage();

  dealDealerCards();
  drawPlayerCards();
  drawPlayerInfo();
  drawActionButtons();
  drawResults();


  if (game.state === "roundOver" && !paidThisRound) {
    updateMoneyAfterRound();
    paidThisRound = true;
  } 
  drawResetButton();

  if (partyIsHost()) {
    ///only one person is doing this, this partyIsHost is built into p5 party

    if (game.state === "waiting" && everyoneReady()) {
      ///check the everyoneReady function if state is waiting to start the game
      dealCards();
      game.turn = firstReadySeat();
      game.state = "playing";
    }

    if (game.state === "dealer") {
      ///always check if its dealer time
      dealerPlay();
    }
  }
}


function dealCards() {
  ///deals cards to each connected player
  if (!partyIsHost()) {
    return;
    ///only the host should deal the cards to players so they arent being assigned tons of cards
  }

  ///reset dealer cards
  game.dealerCards = [];

  //reset player cards
  players.player1.cards = [];
  players.player2.cards = [];
  players.player3.cards = [];
  players.player4.cards = [];


  for (let i = 0; i < 2; i++) {
    ///assing two cards to each ready player using getRandom Card function
    game.dealerCards.push(getRandomCard());

    if (players.player1.ready) {
      players.player1.cards.push(getRandomCard());
    }

    if (players.player2.ready) {
      players.player2.cards.push(getRandomCard());
    }

    if (players.player3.ready) {
      players.player3.cards.push(getRandomCard());
    }

    if (players.player4.ready) {
      players.player4.cards.push(getRandomCard());
    }
  }
}

function drawPlayerCards() {
  ///draws the dealt player cards

  ///create an array to iterate through
  let playerList = [
    players.player1,
    players.player2,
    players.player3,
    players.player4
  ];

  for (let p = 0; p < playerList.length; p++) {
    let player = playerList[p];

    if (player.id !== null) {
      ///if they are a connected player draw them cards
      for (let i = 0; i < player.cards.length; i++) {
        let card = player.cards[i];
        let key = values[card.value] + "_" + suits[card.suit];

        image(cardImages[key],seatX[p] - cardWidth / 2 + i * cardWidth * 0.45,
          cardY,cardWidth,cardHeight
        );
      }
    }
  }
}



function drawSeatSelect() {
  //Draw the seat selection
  if (mySeat !== null) {
    //only run if you have a seat
    return;
  }

  fill("white");
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Choose Your Seat", width / 2, height * 0.35);

  for (let seat = 1; seat <= 4; seat++) {
    let player = players["player" + seat];

    let x = seatX[seat - 1] - buttonW / 2;
    let y = seatButtonY;

    if (player.id === null) {
      fill("gold");
    }
    else {
      fill("gray");
    }

    rect(x, y, buttonW, buttonH, 12);

    fill("black");
    textSize(18);

    if (player.id === null) {
      text("Seat " + seat, x + buttonW / 2, y + buttonH / 2);
    }
    else {
      text("Taken", x + buttonW / 2, y + buttonH / 2);
    }
  }
}


function everyoneReady() {
  ///check if everyone is ready
  let someoneIsReady = false;

  if (players.player1.id !== null) {
    someoneIsReady = true;
    if (!players.player1.ready) {
      return false;
    }
  }

  if (players.player2.id !== null) {
    someoneIsReady = true;
    if (!players.player2.ready) {
      return false;
    }
  }

  if (players.player3.id !== null) {
    someoneIsReady = true;
    if (!players.player3.ready) {
      return false;
    }
  }

  if (players.player4.id !== null) {
    someoneIsReady = true;
    if (!players.player4.ready) {
      return false;
    }
  }

  return someoneIsReady;
  //use someoneisready variable to see if we can deal the cards
}


function dealDealerCards() {
  ///assign cards to dealer
  if (game.state === "waiting") {
    return;
    ///only if in playing gamestates
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
  ///function that is called to assign random cards to players
  return {
    suit: floor(random(0, 4)),
    value: floor(random(0, 13))
  };
}


function readyButtons() {
  if (myPlayer === null) {
    return;
  }

  if (game.state === "waiting") {
    if (myPlayer.ready) {
      fill("green");
    }
    else {
      fill("gold");
    }

    rect(buttonX, buttonY, buttonW, buttonH, 10);

    fill("black");
    textAlign(CENTER, CENTER);
    textSize(buttonH * 0.3);

    if (myPlayer.ready) {
      text("READY", buttonX + buttonW / 2, buttonY + buttonH / 2);
    }
    else {
      text("READY UP", buttonX + buttonW / 2, buttonY + buttonH / 2);
    }
  }
}


function firstReadySeat() {
  for (let seat = 1; seat <= 4; seat++) {
    let player = players["player" + seat];

    if (player.ready) {
      return seat;
    }
  }

  return 1;
}

function nextTurn() {
  let next = game.turn + 1;

  while (next <= 4) {
    let player = players["player" + next];

    if (player.id !== null && player.ready) {
      game.turn = next;
      return;
    }

    next++;
  }

  game.state = "dealer";
}

function mousePressed() {
  if (mySeat === null) {
    for (let seat = 1; seat <= 4; seat++) {
      let player = players["player" + seat];

      let x = seatX[seat - 1] - buttonW / 2;
      let y = seatButtonY;

      if (
        player.id === null &&
        collidePointRect(mouseX, mouseY, x, y, buttonW, buttonH)
      ) {
        player.id = myId;
        player.ready = false;
        player.cards = [];
        player.balance = parseInt(localStorage.getItem("money")) || 5000;

        mySeat = seat;
        me.seat = seat;
        myPlayer = player;

        updateLayout();
        return;
      }
    }

    return;
  }


  if (myPlayer === null) {
    return;
  }


  if (
    game.state === "waiting" &&
    collidePointRect(mouseX, mouseY, buttonX, buttonY, buttonW, buttonH)
  ) {
    let money = parseInt(localStorage.getItem("money")) || 5000;

    if (money >= betAmount) {
      money -= betAmount;

      myPlayer.ready = true;
      myPlayer.bet = betAmount;
      myPlayer.balance = money;

      updateLocalStorage();
    }
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



function mouseWheel(event) {
  if (myPlayer === null) {
    return;
  }

  if (game.state !== "waiting" || myPlayer.ready) {
    return;
  }

  let money = parseInt(localStorage.getItem("money")) || 5000;

  if (event.delta < 0) {
    betAmount += 100;
  }
  else {
    betAmount -= 100;
  }

  if (betAmount < 100) {
    betAmount = 100;
  }

  if (betAmount > money) {
    betAmount = money;
  }

  return false;
}



function drawBetAmount() {
  if (myPlayer === null) {
    return;
  }

  if (game.state === "waiting" && !myPlayer.ready) {
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(22);

    text("Scroll to change bet", seatX[mySeat - 1], buttonY - 60);
    text("Bet: $" + betAmount, seatX[mySeat - 1], buttonY - 35);
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
    textSize(actionButtonH * 0.35);
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

    if (player.id !== null && player.ready) {
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

function drawPlayerInfo() {
  let playerList = [
    players.player1,
    players.player2,
    players.player3,
    players.player4
  ];

  fill("white");
  textSize(20);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < playerList.length; i++) {
    let player = playerList[i];
    let seat = i + 1;
    let x = seatX[i];

    if (player.id !== null) {
      text("Player " + seat, x, infoY - 55);
      text("Money: $" + player.balance, x, infoY - 30);
      text("Bet: $" + player.bet, x, infoY - 5);

      if (player.cards.length > 0) {
        text("Score: " + getHandValue(player.cards), x, infoY + 25);
      }
      else if (player.ready) {
        text("Ready", x, infoY + 20);
      }
      else {
        text("Waiting", x, infoY + 20);
      }
    }
  }
}

function updateMoneyAfterRound() {
  if (myPlayer === null) {
    return;
  }

  let result = game.results["player" + mySeat];
  let money = parseInt(localStorage.getItem("money")) || 0;

  if (result === "Win") {
    money += myPlayer.bet * 2;
  }
  else if (result === "Push") {
    money += myPlayer.bet;
  }

  myPlayer.balance = money;
  updateLocalStorage();
}

function updateLocalStorage() {
  if (myPlayer === null) {
    return;
  }

  localStorage.setItem("money", myPlayer.balance);

  let moneyDisplay = document.getElementById("moneyDisplay");

  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + myPlayer.balance;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}