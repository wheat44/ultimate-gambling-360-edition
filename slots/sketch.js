//Project: Interactive Scene
//Jonathan Hlady
// March 2nd 2026
//Goal: To create a functioning slots machine with a draggable lever and random odds for wining
//where users can place bets based on the amount of money that they have.

//Extra for experts: For my extra for experts I managed to use scroll wheel as an input for changing 
//how much the user is betting. By using mouse wheel events, with a negative event.delta 
//meaning that the user is scrolling up and a positive event.delta meaning the user is scrolling down
//I was able to make the scroll wheel change the amount of the bet. I also worked on having the visuals
//still work when the window is resized with the windowResized function, though it is not flawless.



//game state variable that lets the program know if the user is playing
let gameState = "start screen";

//money and bet variables
let money = 1000;
let bet = 25;
let betMax = 500;
let betMin = 25;
let activeBet = 0;

//spinning variables, sets up the delay and checks if the machine is spinning
let spinning = false;
let spinStartTime = 0;
let delay = 3000;
let allIn = false;

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

  handleX = windowWidth*0.8; // moves the handle when the window is resized
  originalHandleY= windowHeight / 2;
  diameter = windowWidth * 0.05;
  if(!dragging){
    handleY = originalHandleY;
  }
}


function draw() {
  if (gameState === "start screen"){
    drawStartScreen();
  } 
  else if (gameState === "playing"){
    
    if(allIn){
      background(255,255,0);
    }
    else {
      background(0);
    }
    drawText();
    spinDelay();
    drawSlotMachine();  

    if (spinning) {
      shapeOne = random(symbols);
      shapeTwo = random(symbols);
      shapeThree = random(symbols);

    }
  }
}

//draws the start screen with the game title
function drawStartScreen(){
  background(0,0,100);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(60); 
  textStyle(BOLD);
  text("SLOTS MACHINE", windowWidth/2, windowHeight/2);

  textSize(40);
  text("Press SPACE to start!", windowWidth/2, windowHeight/2 + 100); 
}

//function for when the spacec key is pressed, change the game state to playing
function keyPressed(){ 
  if (gameState === "start screen" && key === ' '){ 
    gameState = "playing"; 
  }
  if (keyCode === SHIFT && gameState === "playing" && !spinning){
    allIn = !allIn;
  }
  if (gameState === "playing" && key === "r" && !spinning){
    money = 1000;
    bet = betMin;
  }
}



//updates and displays all money, bet, and result text
//also shows legend for possible outcomes and instructions
function drawText(){
  fill(0, 150, 0);
  textSize(windowWidth*0.015);
  textStyle(BOLD);
  text("Money $" + money, windowWidth*0.8, windowHeight* 0.05);

  let displayBet;
  if(allIn){
    displayBet = money;
  }
  else{
    displayBet = bet;
  }

  fill(200, 150, 0);
  text("Bet: $"+ displayBet, windowWidth*0.8, windowHeight*0.09); 
  
  if(allIn){
    fill(0);
  }
  else{
    fill(255);
  }
  textAlign(LEFT, TOP);
  textSize(windowWidth*0.01);
  
  let xOffset = windowWidth *0.01;
  //draws the legend for the users
  text("JACKPOT 100x BET: ⚠️⚠️⚠️", xOffset, windowHeight/2 - windowHeight *0.15 );
  text("BIG WIN 25x BET: 🟢🟢🟢" ,xOffset, windowHeight/2 - windowHeight * 0.1);
  text("WIN 2x BET: 🟥🟥🟥", xOffset, windowHeight/2 - windowHeight * 0.05);
  text("BREAK EVEN: 🟥🟥", xOffset, windowHeight/2);
  text("PRESS SHIFT TO GO ALL IN", xOffset, windowHeight/2 + windowHeight * 0.05);
  text("PRESS R TO RESET MONEY", xOffset, windowHeight/2 + windowHeight *0.1);

  text(result, windowWidth/2, windowHeight * 0.95); // text for the result of the spin
 
  text(pullHere, handleX*0.95, handleY*0.85  );
 
} 


//function that will determine the result
//updates money based on active bet
function randomOdds(){
  let odds = floor(random(1000)); // odds from 1-1000, using floor so that I only get integers
  
  if (odds === 999){ // jackpot, pays out 100x
    money = money + 100*activeBet; 
    result = "JACKPOT!";
  }  
  else if (odds >= 975){ // big win odds, pays out 25x
    money = money + 25*activeBet;
    result = "BIG WIN!";
  }
  else if (odds >= 900){ // normal win pays out 2x, but is highly rigged
    money = money + 2*activeBet;
    result = "WIN";
  }
  else if (odds >= 600){ // breaking even
    money = money + activeBet;
    result = "BROKE EVEN";
  }
  else{
    result = "BUST";
  }
}


//function that places the users bet if they have enough money and starts the spin
//
function placeBet(){ 
  if (money === 0){
    result = "No Money Left!";
    return; 
  }
  
  if(!spinning && bet<=money ){ 
    if (allIn) { // uses allIn toggle to bet all money if activated
      activeBet = money;
    }   
    else {
      activeBet = bet;
    }
    money -= activeBet;
    spinning = true;
    spinStartTime = millis();
    result = "";
  }
  
  else if (money < bet){
    result = "Not Enough Funds";
  }
}




// function that changes the bet if the mouse wheel is scrolled up/down, when not spinning and not all in
function mouseWheel(event){  
  if (spinning === false && !allIn){ 
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
    randomOdds();
    spinning = false;
    pullHere = "Pull To Spin!";
    setFinalShapes(); // once the result is given after the delay, set the graphics for the final shapes
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
  if (handleDist <= diameter/2){// if the mouse is within the red circle
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
    shapeOne = shapeTwo = shapeThree = "triangle";
  }
  else if (result === "BIG WIN!"){
    shapeOne = shapeTwo = shapeThree = "circle";
  }
  else if (result === "WIN"){ 
    shapeOne = shapeTwo = shapeThree = "square";
  }
  else if (result === "BROKE EVEN"){
    shapeOne = shapeTwo = "square"; 
    shapeThree = random(["circle", "triangle"]);
  }
  

  // on a bust sets the slots to random but doesnt allow for a result that overlaps with a win result
  else{
    shapeOne = random(["triangle", "circle"]); 
    shapeTwo = random(["triangle", "square"]);
    shapeThree = random(["circle", "square"]);
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
