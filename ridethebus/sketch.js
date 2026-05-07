// Array Assignmemnt - Ride the bus
// Tj Ham
// 3/17/2026

// Extra for Experts:
//my project serves as a clean, streamlined example of what my previous card game should have been more like. it includes features such as:
//-no duplicate card drawing
//-sound effects
//-polished visuals
//-advanced array and object notation use (even both at the same time)
//-clean draw loop
//-fully implimented window resize features (all features designed with this in mind)
//-advanced logic for gameplay mechanics
//-fonts

//The game uses some assets from my previous project, but otherwise it is fundimentally very different using cleaner solutions for cards, completely different logic systems
//and a complicated loop/array based button system that im very proud of. its seriously the most beatiful thing ive ever created in my life. Hope you enjoy!


///define gamestate
let state = 'main';

///define variables for images, sounds, fonts, card values and suits, buttons and options
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let values = [ "ace","2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
let cardImages = [];
let options = [];
let buttons = [];
///define a array of objects to hold the value, suit and key for each card
let cards = [
  {value: "", suit: "",key:""},
  {value: "", suit: "",key:""},
  {value: "", suit: "",key:""},
  {value: "", suit: "",key:""}
];


///define locations and dimensions for buttons and cards
let buttonX;
let buttonY;
let buttonH;
let buttonW;
let cardWidth;
let cardHeight;
let cardX;
let cardY;
let spacing;
let totalWidth;

const NAVBAR = 80;
let updatedScreenheight;


///playstage tracks what card is show and what options can be selected.
let playStage = 0;

let bet = 100;
let playerMoney = parseInt(localStorage.getItem("money"));


let choice;


function preload() {
  ///load background and menu images
  main = loadImage("ridethebus/assets/bg/mainbg.png");
  menu = loadImage("ridethebus/assets/bg/menu.png");
  instructions = loadImage('ridethebus/assets/bg/instructions.png');

  ///load font
  font = loadFont('ridethebus/assets/moralanademo.otf');

  //back of card
  bOC = loadImage('ridethebus/assets/cards/back_of_card.png');

  /// load sound effects
  win = loadSound('ridethebus/assets/sfx/win.mp3');
  lose = loadSound('ridethebus/assets/sfx/lose.mp3');
  cardFlip = loadSound('ridethebus/assets/sfx/cardFlip.mp3');
  betSound = loadSound('ridethebus/assets/sfx/bet.mp3');
  deal = loadSound('ridethebus/assets/sfx/deal.mp3');

  ///load cards using a nested loop
  for (let index = 0; index < 4; index++) {
    for (let j = 0; j < 13; j++) {
      let fileName = values[j] + "_of_" + suits[index] + ".svg";
      let key = values[j] + "_" + suits[index];
      /// key in form 2_Spades

      cardImages[key] = loadImage("ridethebus/assets/cards/" + fileName);
    }
  }
}

function setup() {
  ///function setup, define canvas and variables for button and card dimensions and locations.
  createCanvas(windowWidth, windowHeight-80);
  updatedScreenheight = windowHeight-80;
  buttonH = updatedScreenheight/ 10;
  buttonW = windowWidth / 10;
  buttonX = windowWidth / 2;
  buttonY = updatedScreenheight / 1.2;
  cardHeight = updatedScreenheight/4;
  cardWidth = windowWidth/13;
  spacing = width / 10;
  totalWidth = 3 * spacing + cardWidth; // distance from first to last card
  cardX = width / 2 - totalWidth / 2;
  cardY = height / 2.2;
}

function draw() {
  ///draw loop
  background("#374243");
  displayButtons();
  displayBet();
  displayCardValue();
  updateLocalStorage();
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;
  }
}



function mouseClicked(){
  ///mouseclicked handles all mouse interactions
  if (state === 'main' || state === 'redo' || playStage === 4) {
    ///deal button
    if (mouseX > buttonX - buttonW/2 && mouseX < buttonX + buttonW/2 && mouseY > buttonY - buttonH/2 && mouseY < buttonY + buttonH/2){
      deal.play();
      state = 'play';
      playStage = 0;
      choice = "";
      decideCardValue();
      /// change bet
      playerMoney -= bet;
    }
  }

  else if (state === 'play') {
    ///for loop to check if mouse is within boundaries of any of the option buttons and determine which button was clicked based on the label of the button object.
    for (let i = 0; i < buttons.length; i++){
      let b = buttons[i];

      if (mouseX > b.x - b.w/2 && mouseX < b.x + b.w/2 && mouseY > b.y - b.h/2 && mouseY < b.y + b.h/2){
        choice = b.label;
        calcResult();
        cardFlip.play();
        break;
      }
    }
    ///check if cash out button is clicked
    if (mouseX > windowWidth * 0.9 - buttonW/2 && mouseX < windowWidth * 0.9 + buttonW/2 && mouseY > updatedScreenheight * 0.9 - buttonH/2 && mouseY < updatedScreenheight * 0.9 + buttonH/2 && playStage >=1){
      state = 'main';
      ///change player money based on bet and playstage
      playerMoney += bet + bet * (playStage + 1);
      updateLocalStorage();
    }
  }
}
  



function displayButtons(){
  textFont('Courier New');
  textSize(20);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  ///reset buttons and options arrays
  buttons = [];
  options = [];

  ///Start button during menu state
  if (state === 'menu'){
    fill(212,141,51);
    rect(buttonX, buttonY, buttonW, buttonH);
    fill('black');
    text('START!', buttonX, buttonY);
  } 

  ///okay button during instructions state
  else if (state === 'instructions'){ 
    fill(212,141,51);
    rect(buttonX, buttonY, buttonW, buttonH);
    fill('black');
    text('OKAY!', buttonX, buttonY);
  }

  /// deal button during main and redo states
  else if (state === 'main' || state === 'redo' || playStage === 4){
    fill(212,141,51);
    rect(buttonX, buttonY, buttonW, buttonH);
    fill('black');
    text('Deal!', buttonX, buttonY);
  }

  ///buttons for each stage of the game during play state
  else if (state === 'play'){
    ///cash out button
    rectMode(CENTER);
    fill(79);
    rect(windowWidth * 0.9, updatedScreenheight * 0.9, buttonW, buttonH);
    fill('white');
    text('Cash Out', windowWidth * 0.9, updatedScreenheight * 0.9);


    if (playStage === 0){
      options = ['Red', 'Black'];
    }
    else if (playStage === 1){
      options = ['Higher', 'Lower', 'Same'];
    }
    else if (playStage === 2){
      options = ['Inside', 'Outside', 'Same'];
    }
    else if (playStage === 3){
      options = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    }

    ///create buttons equally spaced based on number of options and display them using button object.
    for (let i = 0; i < options.length; i++){
      let x = buttonX + (i - (options.length - 1) / 2) * (buttonW + 10);

      ///define the buttons that have to be drawn
      buttons.push({
        label: options[i],
        x: x,
        y: buttonY,
        w: buttonW,
        h: buttonH
      });

      ///choose colours for red and black buttons and gray for the rest
      if (options[i] === 'Red' || options[i] === 'Hearts' || options[i] === 'Diamonds'){
        fill('red');
      }
      else if (options[i] === 'Black' || options[i] === 'Spades' || options[i] === 'Clubs'){
        fill('black');
      }
      else {
        fill(79);
      }

      ///display the buttons
      rect(x, buttonY, buttonW, buttonH);
      fill('white');
      text(options[i], x, buttonY);
    }
  }
}

function calcResult(){
  ///function calculates result after button push
  if (playStage === 0){
    if (choice === 'Red' && (cards[0].suit === 'Hearts' || cards[0].suit === 'Diamonds') ||choice === 'Black' && (cards[0].suit === 'Spades' || cards[0].suit === 'Clubs')){
      playStage++;
      updateLocalStorage();
    } 
    else {
      state = 'redo';
      playStage++;
      lose.play();
      updateLocalStorage();
    }
  }

  else if (playStage === 1){
    ///assing curr variable to track higher/lower variables 
    let curr = values.indexOf(cards[1].value); 
    let prev = values.indexOf(cards[0].value);

    if (choice === 'Higher' && curr > prev ||choice === 'Lower' && curr < prev ||choice === 'Same' && curr === prev){
      playStage++;
    } 
    else {
      state = 'redo';
      playStage++;
      lose.play();
    }

  }


  else if (playStage === 2){
    ///create temp variables of last 2 cards and current card to compare if card is inside our outside previous
    let a = values.indexOf(cards[0].value);
    let b = values.indexOf(cards[1].value);
    let c = values.indexOf(cards[2].value);

    ///create min and maxval variable to choose between which is bigger and smaller to decide what peramiters choice must be in
    let minVal = Math.min(a, b);
    let maxVal = Math.max(a, b);

    ///compare choice to peramiters
    if (choice === 'Inside' && c > minVal && c < maxVal || choice === 'Outside' && (c < minVal || c > maxVal) || choice === 'Same' && (c === a || c === b)){
      playStage++;
    } 

    else {
      state = 'redo';
      playStage++;
      lose.play();
    }
  }

  ///check final stage if player chose correct suit
  else if (playStage === 3){
    if (cards[3].suit === choice){
      playStage++;
      win.play();
      ///change player money based on bet and playstage
      playerMoney += bet + bet * (playStage + 1);
    } 
    else {
      state = 'redo';
      playStage++;
      lose.play();
    }
  }
}


function mouseWheel(event) {
  ///scrolling down
  if (event.delta > 0 && bet > 0 && (state === 'main' ||  state === 'redo') && bet <= playerMoney){
    bet -= 25;
    betSound.play();
  }
  ///scrolling up
  else if(event.delta < 0 && bet < 1000  && (state === 'main' ||  state === 'redo') && bet + 25 <= playerMoney){
    bet += 25;
    betSound.play();
  }
  ///prevent screen from scrolling when mouse scrolls 
  return false;
}

function displayBet(){
  ///display the player bet and money amount
  if (state === 'j' || state === 'play' || state === 'redo'){
    textFont(font);
    fill(212,141,51);
    textSize(40);
    let amount = bet;
    text("Bet: $" + amount, windowWidth * 0.1, updatedScreenheight * 0.88);
    let money = playerMoney;
    text("Money: $" + money, windowWidth * 0.1, updatedScreenheight * 0.92); 
  }

  ///check if bet is invalid
  if (bet >playerMoney){
    bet = playerMoney;
  }

  ///check if playerMoney is greater than 0 
  if (playerMoney <0){
    bet = 0;
    playerMoney = 0;
  }
}

function displayCardValue(){
  ///function initially displays blank back of cards untill correct playstage, which then reads key and displays images
  if (state === 'play' || state === 'redo'){
    for (let i = 0; i < 4; i++){
      if (state === 'play' || state === 'redo'){
        if (playStage < 1){
          image(bOC, cardX + i * spacing, cardY, cardWidth, cardHeight);
        }
        else if (playStage === 1){
          if (i >= 1){
            image(bOC, cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
          else {
            image(cardImages[cards[i].key], cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
        }
        else if (playStage === 2){
          if (i >= 2){
            image(bOC, cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
          else {
            image(cardImages[cards[i].key], cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
        }
        else if (playStage === 3){
          if (i >= 3){
            image(bOC, cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
          else {
            image(cardImages[cards[i].key], cardX + i * spacing, cardY, cardWidth, cardHeight);
          }
        }
        else if (playStage === 4){
          image(cardImages[cards[i].key], cardX + i * spacing, cardY, cardWidth, cardHeight);
        }
      }
    }
  }
}

function decideCardValue(){
  if (state === 'play' || state === 'redo'){
    for (let i = 0; i < 4; i++){

      ///assigne duplicate variable
      let duplicate = true;
      
      while (duplicate){
        duplicate = false;
        let valueIndex = floor(random(0, 13));
        let suitIndex = floor(random(0, 4));

        ///assign temporary variables to check against during for loop
        let tempValue = values[valueIndex];
        let tempSuit = suits[suitIndex];
        let tempKey = tempValue + '_' + tempSuit;

        ///check against chosen card\
        for (let f = 0; f < i; f++){
          if (tempKey === cards[f].key){
            duplicate = true;
          }
        }

        ///only assigns permanent variables after confirming not duplicate
        if (duplicate === false){
          cards[i].value = tempValue;
          cards[i].suit = tempSuit;
          cards[i].key = tempKey;
        }
      }   
    }
  }
}


function keyPressed(){
  /// r to reset 
  if (key === "r") {
    state = "menu";
    playStage = 0;
    choice = "";
  }
}
    


function windowResized() {
  /// redefine variables when window is resized.
  resizeCanvas(windowWidth, updatedScreenheight);
  buttonH = updatedScreenheight/ 10;
  buttonW = windowWidth / 10;
  buttonX = windowWidth /2;
  buttonY = updatedScreenheight / 1.2;
  cardWidth = windowWidth / 14;
  cardHeight = updatedScreenheight/ 6 ;
  spacing = width / 10;
  totalWidth = 3 * spacing + cardWidth; // distance from first to last card
  cardX = width / 2 - totalWidth / 2;
  cardY = height / 2.2;
}


function updateLocalStorage(){
  localStorage.setItem("money", playerMoney);
}