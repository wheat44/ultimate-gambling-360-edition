//Updated slots 
//Game now features slot delay for a more anticipated result as well as a menu for a clearer demonstration of what the user won




//game state variable that lets the program know if the user is playing
let gameState = "playing";

//money and bet variables
let playerMoney = parseInt(localStorage.getItem("money")) || 1000;
let bet = 25;
let betMax = 500;
let betMin = 25;
let activeBet = 0;

//spinning variables, sets up the delay and checks if the machine is spinning
let spinning = false;
let spinStartTime = 0;
let delay = 3000;

// win popup variables
let showPopup = false;
let popupStartTime = 0;
let popupDuration = 2500;
let winnings = 0;

//the handle and lever variables
let handleX;
let handleY;
let diameter;
let dragging = false;
let originalHandleY;
let result = " ";

//text for pulling the lever
let pullHere = "Pull To Spin!";

//variables for drawing the shapes
let symbols = ["square", "circle", "triangle"];
let shapeOne = "square";
let shapeTwo = "square";
let shapeThree = "square";
let finalShapeOne = "square";
let finalShapeTwo = "square";
let finalShapeThree = "square";

//variables for the delay on the slots
let reel1Done = false;
let reel2Done = false;
let reel3Done = false;

let reel1Delay = 1000;
let reel2Delay = 1800;
let reel3Delay = 2600;
let finalShapesReady = false;


//sound variables
let winSound;
let spinningSound;
let winSoundPlayed = false;


function preload(){
  winSound = loadSound('slots/slotsWinSound.wav');
  spinningSound = loadSound('slots/slotMachineSpinningSound.wav');
}

function setup() {
  handleX = windowWidth*0.8; // initalizes the handle variables once the windowHeight and Width have been declared
  handleY = windowHeight/2;
  diameter = windowWidth*0.05;
  originalHandleY = windowHeight /2;
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
}


function windowResized(){ 
  resizeCanvas(windowWidth, windowHeight); 
  handleX = windowWidth*0.8;
  originalHandleY = windowHeight / 2;
  diameter = windowWidth * 0.05;
  handleY = originalHandleY;
  dragging = false;
}


function draw() {
  if (gameState === "playing"){
    

    background("#374243");
    
    drawText();
    spinDelay();
    drawSlotMachine(); 
    slotDelay();
    // determines the delay for each slot to appear 

  }

  updateLocalStorage();
  drawPopup();
}
//draws the start screen with the game title


//function to create delay between when the 3 slots show up
function slotDelay(){

  if (spinning) {
    if (!reel1Done) {
      shapeOne = random(symbols);

      //Each reel updates independently so they can stop at different times
      if (millis() - spinStartTime >= reel1Delay) {
        reel1Done = true;


        if(finalShapesReady){
          shapeOne = finalShapeOne;
        }
      }
    }
    if (!reel2Done) {
      shapeTwo = random(symbols);

      if (millis() - spinStartTime >= reel2Delay) {
        reel2Done = true;

        //once the reel finishes spinning, stop showing random values and lock in the pre-determined final result
        if(finalShapesReady){
          shapeTwo = finalShapeTwo;
        }
      }
    }

    if (!reel3Done) {
      shapeThree = random(symbols);

      if (millis() - spinStartTime >= reel3Delay) {
        reel3Done = true;

        if(finalShapesReady){
          shapeThree = finalShapeThree;
        }
      }
    }
  }
}



//updates and displays all money, bet, and result text
//also shows legend for possible outcomes and instructions
function drawText(){
  fill(0, 150, 0);
  textSize(windowWidth*0.015);
  textStyle(BOLD);

  let displayBet = bet;

  fill(200, 150, 0);
  text("Bet: $"+ displayBet, windowWidth*0.8, windowHeight*0.09); 
  
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(windowWidth*0.01);
  
  let xOffset = windowWidth *0.01;
  //draws the legend for the users

  text(result, windowWidth/2, windowHeight * 0.95); // text for the result of the spin
 
  text(pullHere, handleX*0.95, originalHandleY*0.85); 
} 


//function that will determine the result
//updates money based on active bet
function randomOdds(){

  let odds = floor(random(1000));
  winnings = 0;

  if (odds === 999){
    winnings = 100 * activeBet;
    playerMoney += winnings;
    result = "JACKPOT!";
  }  
  else if (odds >= 974){
    winnings = 25 * activeBet;
    playerMoney += winnings;
    result = "BIG WIN!";
  }
  else if (odds >= 900){
    winnings = 2 * activeBet;
    playerMoney += winnings;
    result = "WIN";
  }
  else if (odds >= 600){
    winnings = activeBet;
    playerMoney += winnings;
    result = "BROKE EVEN";
  }
  else{
    result = "BUST";

  }
}


//function that places the users bet if they have enough money and starts the spin
//
function placeBet(){ 

  //Prevents betting while popup is active so the player cant overlap the gameState
  if (showPopup){
    return;
  }
  result = "";

  if (playerMoney === 0){
    result = "No Money Left!";
    return; 
  }
  
  if(!spinning && bet <= playerMoney ){ 
  
    activeBet = bet;
    
    if(activeBet > playerMoney){
      return;
    }
    playerMoney -= activeBet;

    // stores money before spin to calculate winnings
    winnings = -activeBet;

    // Reset reel state so previous spin doesn't interfere with animation timing
    reel1Done = false;
    reel2Done = false;
    reel3Done = false;

    randomOdds();

    setFinalShapes();
    finalShapesReady = true;

    spinning = true;
    spinStartTime = millis();
    
    spinningSound.loop();
  }
  
  else if (playerMoney < bet){
    result = "Not Enough Funds";
  }
}


// function that changes the bet if the mouse wheel is scrolled up/down, when not spinning and not all in
function mouseWheel(event){  
  if (spinning === false){ 
    if (event.delta < 0 && bet < betMax){ // can't bet over $500
      bet+=5;
    }
    else if(event.delta > 0 && bet > betMin){ // can't bet under $25
      bet -=5;
    }

    return false; // so that the screen doesn't scroll when the mouse wheel scrolls.
  }
}

//adds a delay for the spinning animation, then finalizes results
function spinDelay(){
  if (spinning && millis() - spinStartTime >= delay){

    spinning = false;
    showPopup = true;
    popupStartTime = millis();

    pullHere = "Pull To Spin!";

    spinningSound.stop();
  }
}

//draws slots machine visuals including lever, symbols and the machine itself
function drawSlotMachine(){ 
  
  fill(50);
  rect(windowWidth/2, windowHeight/2, windowWidth*0.5, windowHeight*0.6, 10);

  fill (255);
  rect(windowWidth/3, windowHeight/2, windowWidth*0.1, windowHeight* 0.4, 10);

  rect(windowWidth/2, windowHeight/2, windowWidth*0.1, windowHeight* 0.4, 10); 

  rect(windowWidth/1.5, windowHeight/2, windowWidth*0.1, windowHeight* 0.4, 10);

  fill(50);
  let rodLength = windowHeight*0.2 - (handleY - originalHandleY); // have the rod length change when user is pulling down
  rodLength = max(rodLength, 0);
  rect(handleX, handleY + rodLength/2, windowWidth*0.02, rodLength);

  fill(255,0,0);
  circle(handleX, handleY, diameter);

  //draws the symbols inside the machine 
  drawSymbol(shapeOne, windowWidth/3, windowHeight/2);
  drawSymbol(shapeTwo, windowWidth/2, windowHeight/2);
  drawSymbol(shapeThree, windowWidth/1.5, windowHeight/2);
  
}

//starts dragging id the lever is clicked
function mousePressed(){

  let handleDist = dist(mouseX, mouseY, handleX, handleY); 

  if (!spinning && handleDist <= diameter/2){
    dragging = true;
  }
}


//moves the lever with the mouse, constraining it to its track
function mouseDragged(){ 
  if (dragging){
    handleY = constrain(mouseY, originalHandleY, originalHandleY + 150);
    
    pullHere = " "; //removes the pull here text while pulling
  }
}


//releases the lever, triggers bet if pulled far enough, then resets the lever
function mouseReleased(){
  if (dragging){
    dragging = false;

    
    if (handleY > originalHandleY + 100){
      placeBet();
    }

    handleY = originalHandleY;
  
  }
} 


//function that sets the final shapes based on the given result from the random odds function
function setFinalShapes(){

  if (result === "JACKPOT!"){
    finalShapeOne = "triangle";
    finalShapeTwo = "triangle";
    finalShapeThree = "triangle";
  }

  else if (result === "BIG WIN!"){
    finalShapeOne = "circle";
    finalShapeTwo = "circle";
    finalShapeThree = "circle";
  }

  else if (result === "WIN"){
    finalShapeOne = "square";
    finalShapeTwo = "square";
    finalShapeThree = "square";
  }

  else if (result === "BROKE EVEN"){
    finalShapeOne = "square";
    finalShapeTwo = "square";
    finalShapeThree = random(["circle", "triangle"]);
  }

  else{

    finalShapeOne = random(["triangle", "circle"]);
    finalShapeTwo = random(["triangle", "square"]);
    finalShapeThree = random(["circle", "square"]);

  }
}



//draws the symbols with a given string symbol, and x, y coordinates
function drawSymbol(symbol, x, y){

  if (symbol === "square"){
    fill(255, 0, 0);
    rect(x, y, windowWidth/32, windowHeight/18); 
  }
  else if(symbol === "circle"){
    fill(0,255,0);
    circle(x,y, windowWidth/32);
  }

  else if (symbol === "triangle"){
    let size = windowWidth/32;
    fill(255,255,0);
    triangle(x-size/2, y+size/2, x, y-size/2, x+size/2, y+size/2);
  }
}

function updateLocalStorage(){
  localStorage.setItem("money", playerMoney);
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;  
  }
}

function drawPopup(){

  if(showPopup){
    if (millis() - popupStartTime < 50) {
      winSoundPlayed = false;
    }
    // Automatically removes popup after fixed time so gameplay flow continues
    if(millis() - popupStartTime > popupDuration){
      showPopup = false;
      return;
    }
    fill(0,180);
    rect(windowWidth/2, windowHeight/2, 
      windowWidth*0.35, windowHeight*0.25,20);

    fill(255);
    textAlign(CENTER,CENTER);
    textSize(windowWidth*0.03);
    
    // Different UI depending on outcome makes results more readable instantly
    if(winnings > 0){
      fill(0,255,0);

      if(winnings > 0){

        fill(0,255,0);

        // play win sound ONCE when popup appears
        if (!winSoundPlayed){
          winSound.play();
          winSoundPlayed = true;
        }
        text(result + "\n+$" + winnings, windowWidth/2, windowHeight/2);
      }
    }
    else{
      fill(255,0,0);
      text("BUST\n-$" + activeBet, windowWidth/2, windowHeight/2);
    }
    textAlign(LEFT,TOP);

  }

}