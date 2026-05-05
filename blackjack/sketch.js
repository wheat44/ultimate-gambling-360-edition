///TJ HAM
///Ultimate Blackjack - Interactive Scene Assignment
// 3/2/2026

// Extra for Experts:
// My project Is a fully functional blackjack game with a menu, instructions, and gameplay. The only feature that missing is the ability to split cards, in order to impliment i would want to change how my game handles cards as a object to make it easier to 
// include a split hand. It uses nested loops(to load cards and to draw them ), arrays (to store card info and player hands), objects (to store card info), and state variables and substates. The draw loop only calls functions and is very clean, 
// and the flow of functions is intuitive and easy to follow. my game is fully compatiable with different screen sizes and window resizing, within reason, it looks a little jank on my vertical stacked monitor but for most standard window size the resize function works.
// the mousewheel is used to control betting amount. Buttons, images, and keyboard controls, are all featured as well as some pretty fun and snazzy retro graphics i drew in paint. the card loading is a cool function that required me to do some outside 
// and look at documentation for insperation. overall im very happy with this project, its very clean, bug free, and kinda fun to just play. It really knocked the rust off since last semester and got me back into coding. 
// hope you enjoy it!



/// Assign Gamestate
state = "menu"; 
/// Assign global variables and define terms

/// create arrays for suits, values, images, and player cards
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let values = [ "ace","2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
let cardImages = [];
let playerCards = [];
let dealerCards = [];


///button locations and dimensions
let buttonX;
let buttonY;
let buttonR = 75;
let hButtonX;
let hButtonY;
let hButtonR = 100;
let sButtonX = 50;
let sButtonY = 250;
let sButtonR = 100;
let cardX;
let cardY;
let dealerCardX;
let dealerCardY;
let cardWidth;
let cardHeight;


///game substates
let button = false;
let hit = false;
let deal = false;
let stand = false;
let inPlay = false;
let cardFlipped = false;
let temp = false;
let roundOver = false;
let result = "";


///numerical game variables 
let bet = 100
let playerMoney = 5000
let score = 0;
let dealerScore = 0;

///define card object to use inside loop for card info
let card = {
  cardValue: values[12],
  cardSuite: suits[2]
};

let dealerCard = {
  cardValue: values[12],
  cardSuite: suits[2]
}



/// preload
function preload() {
  ///load background and meny images
  bg = loadImage("Assets/BG/background.png");
  menu = loadImage("Assets/BG/blackjack bg.png");
  instructionsImg  = loadImage("Assets/BG/Instructions_BG.png");

  //back of card
  bOC = loadImage('Assets/Cards/back_of_card.png')

  ///load cards using a nested loop
  for (let index = 0; index < 4; index++) {
    for (let j = 0; j < 13; j++) {
      let fileName = values[j] + "_of_" + suits[index] + ".svg";
      let key = values[j] + "_" + suits[index];
      /// key in form 2_Spades

      cardImages[key] = loadImage("Assets/Cards/" + fileName);
    }
  }
}


function setup() {
  ///define canvas size based on window size
  let canvasH = windowHeight;
  let canvasW = windowWidth;
  createCanvas(canvasW, canvasH);

  /// define button dimensions based on window size.
  buttonX = width / 2;
  buttonY = height / 2;
  hButtonX = width / 2 - 100;
  hButtonY = height / 2 + 300;
  sButtonX = width / 2 + 100;
  sButtonY = height / 2 + 300;
  cardX = width / 3 - 250;
  cardY = height / 2 - 60;
  dealerCardX = width / 3 - 250;
  dealerCardY = height / 2 - 300;
  cardWidth = width / 13.5;
  cardHeight = height / 6;
}

///main draw loop, calls all functions
function draw() {
  displayBg();
  startButton();
  displayBet();
  dealCards();
  calcScore();
  displayResult();
  dealDealerCards();
  displayGameResult();
}


function displayBg() {
  ///displays background based on the game state
  if (state === "main" || state === 'play') {
    image(bg, 0, 0, width, height);
  }
  if (state === "menu") {
    image(menu, 0, 0, width, height);
  }
  if(state === 'main'){
    image(instructionsImg,0,0,width,height)
    let buttonDist = dist(mouseX, mouseY, buttonX, buttonY);
    fill('white');
    ellipseMode(CENTER);
    ellipse(buttonX, height-160, 400, 200, 6);
    fill('black');
    textSize(100);
    text("OKAY!", buttonX, height-130);
  }
}


function startButton() {
  ///display start button when in menu state
  if (state === "menu") {
    fill(34, 177, 76); 
    strokeWeight(4);
    stroke('black');
    rect(buttonX - 200, buttonY - 100, 400, 200);
    fill(255);
    textAlign(CENTER);
    textSize(50);
    text("START", buttonX, buttonY+20);
  }
  ///display hit button when in play state
  if (state === "play") {
    textAlign(CENTER, CENTER);
    textSize(hButtonR * 0.25);
    fill(0);
    circle(hButtonX, hButtonY, hButtonR);
    fill('255');
    text("HIT!", hButtonX, hButtonY);

  }
  if (state === "play") {
    ///display stand button when in play state
    textAlign(CENTER, CENTER);
    textSize(sButtonR * 0.25);
    fill(0);
    circle(sButtonX, sButtonY, sButtonR);
    fill('255');
    text("STAND!", sButtonX, sButtonY);

  }
}

///button mousepressed controls
function mousePressed() {

  /// if in menu do start button control
  if (state === 'menu') {
    let buttonDist = dist(mouseX, mouseY, buttonX, buttonY);

    if (buttonDist < buttonR) {
      state = 'main';
    }
  }

  /// if in main do the instructions button contorl
  else if (state === 'main') {
    let buttonDist = dist(mouseX, mouseY, buttonX, height-160);

    if (buttonDist < 200) {
      state = 'play';
    }
  }

  /// if in play do the hit and stand button contorl
  else if (state === 'play') {

    let hButtonDist = dist(mouseX, mouseY, hButtonX, hButtonY);
    let sButtonDist = dist(mouseX, mouseY, sButtonX, sButtonY);

    if (hButtonDist < hButtonR / 2 && stand === false && inPlay) {
      hit = true;
    }

    if (sButtonDist < sButtonR / 2) {
      stand = true;
      
    }
  }
}

function keyPressed(){
  ///space pressed changes deal to true
  if (keyCode === 32 && state === 'play' && !inPlay){
    deal = true;
  }
  /// r to reset 
  if (key === "r") {
    state = "menu";
  }
}
    
function dealCards() {

/// when new deal is called reset all varaibles
  if (deal === true) {

    playerCards = []; // clear old cards
    hit = false; // reset hit
    stand = false; // reset stand
    score = 0; // reset score
    roundOver = false; // reset roundover
    result = ""; // reset result
    
    ///change inPlay function
    inPlay = true;


    /// reset dealer cards and score
    dealerCards = [];
    dealerScore = 0;

// determine 2 dealer cards
  for (let index = 0; index < 2; index++) {
    dealerCards.push({
      suit: floor(random(0,4)),
      value: floor(random(0,13))
    });
  }

/// determine the first 2 cards, evenly scaped out using index variable
    for (let index = 0; index < 2; index++) {
      playerCards.push({
        suit: floor(random(0,4)),
        value: floor(random(0,13))
      });
    }

    deal = false;
  }

/// hit button adds card to player hand
  if (hit === true && score < 21) {
    playerCards.push({
      suit: floor(random(0,4)),
      value: floor(random(0,13))
    });

    hit = false;
  }

///draw the cards
  if (state === 'play') {

    for (let index = 0; index < playerCards.length; index++) {
    ///define player cards 
      let card = playerCards[index];
      let key = values[card.value] + '_' + suits[card.suit];
      ///evenly space out cards and draw image
      image(cardImages[key], cardX + index * (width/10), cardY, cardWidth, cardHeight);
    }
  }
}


function dealDealerCards() {

  if (state !== "play") return;

  for (let i = 0; i < dealerCards.length; i++) {

    let card = dealerCards[i];
    let key = values[card.value] + "_" + suits[card.suit];

    // Hide second card unless player stands or round over
    if (i === 1 && inPlay) {
      image(bOC, dealerCardX + i * (width/10), dealerCardY, cardWidth, cardHeight);
    } 
    else {
      image(cardImages[key], dealerCardX + i * (width/10), dealerCardY, cardWidth, cardHeight);
    }
  }

  // Dealer logic runs when player stands
  if (stand && inPlay) {

    calculateDealerScore();

    while (dealerScore < 17) {
      dealerCards.push({
        suit: floor(random(0,4)),
        value: floor(random(0,13))
      });

      calculateDealerScore();
    }

    inPlay = false; // Round ends here
  }
}


///mousewheel betting control
function mouseWheel(event) {
  ///scrolling down
  if (event.delta > 0 && bet > 0 && inPlay === false && state === 'play' && bet <= playerMoney){
    bet -= 25;
  }
  ///scrolling up
  else if(event.delta < 0 && bet < 1000 && inPlay === false && state === 'play' && bet <= playerMoney){
    bet += 25;
  }
  ///prevent screen from scrolling when mouse scrolls 
  return false 
}

function displayBet(){
  if (state === 'play'){
    textSize(20);
    let amount = bet
    text("Bet: $" + amount, width * 0.1, height * 0.2)
    let money = playerMoney
    text("Money: $" + money, width * 0.1, height * 0.25)
    
  }
}



function calcScore(){
   if (state !== 'play' || playerCards.length === 0) return; /// if not in play state or no cards dealt return to avoid errors

    score = 0;
    let aceCount = 0; /// track number of aces for ace adjustment
    

    for (let index = 0; index < playerCards.length; index++) {/// loop through player cards and calculate score
      let value = playerCards[index].value;


      if (value === 0) { /// if card is an ace
        aceCount++;
        score += 11; /// count ace as 11
      }

      else if (value >= 10) { /// if card is a face card
        score += 10;
      }

      else { /// for cards 2-10
        score += value + 1; /// add 1 because card values are 0 indexed
    }
    

    // Ace adjustment
      while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
      }


    //calulate for bust
    if (score > 21){
      textSize(300);
      fill('red')
      textAlign(CENTER, CENTER);
      text("BUST!", windowWidth/2, windowHeight/1.5);
      inPlay = false
    }
    score = score;   
    }
}


function calculateDealerScore(){
  dealerScore = 0;
  let aceCount = 0; 
  for (let index = 0; index < dealerCards.length; index++) {
    let value = dealerCards[index].value;
    if (value === 0) { /// if card is an ace
      aceCount++;
      dealerScore += 11; /// count ace as 11
    }
    else if (value >= 10) { /// if card is a face card
      dealerScore += 10;
    } 
    else { /// for cards 2-10
      dealerScore += value + 1; /// add 1 because card values are 0 indexed
    } 
  }
  // Ace adjustment
  while (dealerScore > 21 && aceCount > 0) {
    dealerScore -= 10;
    aceCount--;
  }
  return dealerScore;
}




function getCardValue(index){
  /// Determine the value of the card based on its index in the values array

  if (index === 0) return 11; // Ace

  if (index >= 10) return 10; // Jack, Queen, King

  return index + 1; // because 2 is index 1, 3 is index 2, etc.
}

function displayResult(){
  if (state === 'play'){ /// if not in play dont display score
    textAlign(CENTER, BOTTOM);
    textSize(height * 0.05);
    fill(255);
    text("Your Score: " + score, width / 2, height * 0.90);
  }
 
  dealerScore = calculateDealerScore();

  if (state === 'play' && !inPlay){ /// if not in play dont display score{
    textAlign(RIGHT, TOP);
    textSize(20);
    fill(255);
    text("Dealer: " + dealerScore, width * 0.95, height * 0.2);
  }
}

function displayGameResult(){
  /// determine game result based on scores, declare roundOver
  if (state === 'play' && !inPlay && !roundOver){ /// if not in play dont display score
    textSize(300);
    fill('red')
    if (dealerScore > 21){
      result = "PLAYER WINS";
      changeMoney(result);
      roundOver = true;
    }
    if (score > 21){
      result = "DEALER WINS";
      changeMoney(result);
      roundOver = true;

    }
    if (score <= 21 && dealerScore <= 21){
      if (score > dealerScore){
        result = "PLAYER WINS";
        changeMoney(result);
        roundOver = true;
      }
      else if (dealerScore > score){
        result = "DEALER WINS";
        changeMoney(result);
        roundOver = true;

      }
      else if(dealerScore > 0) {
        result = "PUSH";
        roundOver = true;

      }
    }
  }
/// display result text
  if (state === "play" && roundOver){
    textSize(150);
    fill('red');
    textAlign(CENTER, CENTER);
    text(result, windowWidth/2, windowHeight/2);
  }



}


function changeMoney(result){
  /// change player money based on result of the game, seperated to avoid constant increase bug
  if (result === "PLAYER WINS"){
    playerMoney += bet;
  }
  else if (result === "DEALER WINS"){
    playerMoney -= bet;

  }
}





/// if window is resized, resize the canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2;
  hButtonX = width / 2 - 100;
  hButtonY = height / 2 + 300;
  sButtonX = width / 2 + 100;
  sButtonY = height / 2 + 300;
  buttonR = width / 6;
  cardX = width / 3 - 250;
  cardY = height / 2 - 60;
  dealerCardX = width / 3 - 250;
  dealerCardY = height / 2 - 300;
  cardWidth = width / 13.5;
  cardHeight = height / 6;
}