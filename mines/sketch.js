//Mines
// Jonathan Hlady
// April 15th 2026
//
// Extra for Experts:
// 


// Tracks whether the player is in a round; controls input + UI state
let gameState = "stopped";

//bet variables
const BET_MAX = 500;
const BET_MIN = 25;
let bet = 25;
let money = 500;
let winMultiplier = 1;
let safeClicks = 0;


//grid size
let rows = 5;
let cols = 5;

//tile positioning 
let tileX;
let tileY;
let startX;
let startY;

//spacing and cal
let totalTiles = rows * cols;
let spacingX;
let spacingY;

//slider variables/UI elements
let slider;
let numberOfBombs;
let sliderSize;

//bet button variables
let betButton;
let cashOutButton;

//grid data
let revealedTiles;
let grid = [];

let revealAllTiles = false;

//sound variables
let dingSound;
let wrongTileSound;


function preload(){
  //loads audio for correct/incorrect tile clicks
  dingSound = loadSound("mines/correctTileSound.wav");
  wrongTileSound = loadSound("mines/wrongTileSound.wav");
  
  //loads images used in the game
  bombImage = loadImage("mines/bomb.jpg");
  questionMarkImage = loadImage("mines/unknownTile.png");
  diamondImage = loadImage("mines/diamondTileImage.avif");
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  //tile size scales with the screen
  tileY = windowHeight* 0.12;
  tileX = windowWidth * 0.07;
 
  //makes all tiles(images) the same size
  bombImage.resize(tileX, tileY);
  questionMarkImage.resize(tileX, tileY);
  diamondImage.resize(tileX,tileY);
  
  //slider scales with the window
  sliderSize = windowWidth *0.33;
  
  //creates a slider up to a max of 24 so there is still one safe tile left and sets size
  slider = createSlider(1, totalTiles - 1, 1, 1);
  slider.size(sliderSize);
  slider.position(windowWidth/2 - sliderSize/2, windowHeight * 0.95);
  

}

function windowResized(){
  //keeps layout responsive when screen changes size
  resizeCanvas(windowWidth, windowHeight);
  tileY = windowHeight* 0.12;
  tileX = windowWidth * 0.07;
  
  sliderSize = windowWidth *0.33;
  slider.size(sliderSize);

  slider.position(windowWidth/2 - sliderSize/2, windowHeight * 0.95);
}


function draw() {
  background(0);

  //draws the game elements 
  drawGrid();
  drawButton();
  drawText();
  numberOfBombs = slider.value();

  //locks the slider during gameplay to prevent cheating
  if(gameState === "stopped"){
    slider.removeAttribute('disabled');
  }
  else if (gameState === "playing"){
    slider.attribute('disabled', '');
  }
}



function drawGrid(){
  //grid spacing adapts to screen size
  spacingX = windowWidth/55;
  spacingY = windowHeight/55;

  //calculates the total grid sizes to help acturately center the grid
  totalGridW = cols*tileX + (cols -1)* spacingX;
  totalGridH = rows*tileY + (rows -1)* spacingY;

  startX = windowWidth/2 - totalGridW /2;
  startY = windowHeight/2 - totalGridH /2;
  
  //loops through all columns and rows to create a 5x5 grid
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      let x = startX + c * (tileX + spacingX);
      let y = startY + r * (tileY + spacingY);
      
      //when the game is stopped set the default image to be a question mark tile
      if (gameState === "stopped"){
        image(questionMarkImage, x ,y, tileX, tileY);

      }
      //while playing if an image gets revealed and is safe set to a diamond
      if (gameState === "playing"){
        if (revealedTiles[r][c] === false) {
          image(questionMarkImage, x, y, tileX, tileY);
        }
        else{
          image(diamondImage, x, y, tileX, tileY);
        }
      }

      //end state that will reveal what every tile was to tell the user where they could have clicked
      if (revealAllTiles){
        if (grid[r][c] === "bomb"){
          image(bombImage, x ,y, tileX, tileY);
        }
        if (grid[r][c] === "safe"){
          image(diamondImage, x ,y, tileX, tileY);
        }
      }
    }
  }
}


function drawButton(){
  //sets up location and size of both the bet button and the cashout Button
  betButton = {
    x: windowWidth * 0.45,
    y: startY + totalGridH + tileY/5,
    w: windowWidth * 0.1,
    h: windowHeight * 0.05,
  };
  cashOutButton = {
    x: windowWidth * 0.1,
    y: windowHeight/2,
    w: windowWidth * 0.1,
    h: windowHeight * 0.05,
  };


  //decides what button should show up based on the game state
  if (gameState === "stopped"){
    fill("green");
    rect(betButton.x, betButton.y, betButton.w, betButton.h, 8);
  }
  else if (gameState === "playing"){
    fill("red");
    rect(cashOutButton.x, cashOutButton.y, cashOutButton.w, cashOutButton.h, 8);

  }

}

// function to determine whether the users mouse is within one of the buttons
function inButton(button){
  return mouseX > button.x && mouseX < button.x + button.w && mouseY > button.y && mouseY < button.y + button.h;
}


function mousePressed(){

  //starts the round if the game is stopped and user has enough money
  if (inButton(betButton) && gameState === "stopped" && bet <= money){
    placeBet(); // places the users bet
    generateGrid(); // once the game starts the grid gets randomized for a new grid each game
    gameState = "playing";
    revealAllTiles = false;
  }

  //lets user cash out at anytime, ends the game and lets user take their rewards
  if (inButton(cashOutButton) && gameState === "playing"){
    gameState = "stopped";
    cashOut();
  }



  if (gameState === "playing"){
    //loops through every tile to check if a player clicked on one during gameplay
    for (let r = 0; r < rows; r++){
      for (let c = 0; c < cols; c++){
        let x = startX + c * (tileX + spacingX);
        let y = startY + r * (tileY + spacingY);

        // check if mouse is inside a tile
        if (mouseX > x && mouseX < x + tileX &&
          mouseY > y && mouseY < y + tileY){

          if (!revealedTiles[r][c]){
            revealedTiles[r][c] = true;

            // clicking on a bomb will immediately end the round and reveal all the other tiles
            if (grid[r][c] === "bomb"){
              gameState = "stopped";
              revealAllTiles = true;
              wrongTileSound.play();
            }
            else{
              //safe tiles increase reward potential 
              safeClicks++;
              updateMultiplier();
              dingSound.play();

            }
            
            //if user selects all the safe tiles, the game ends and auto cashes out
            if(safeClicks === totalTiles - numberOfBombs){
              revealAllTiles = true;
              cashOut();
            }
          }
        }
      }
    }
  }
}

//function that draws all text for buttons, money and slider UI
function drawText(){
  textAlign(LEFT);
  fill("white");
  textSize(windowWidth*0.01);
  text("Number Of Bombs: " + numberOfBombs, windowWidth*0.45, windowHeight*0.93);

  textSize(windowWidth*0.015);
  if (gameState === "stopped"){
    text("Place Bet", betButton.x + windowWidth/64, betButton.y + windowHeight/32);
  }
  else if (gameState === "playing"){
    text("Cash Out", cashOutButton.x + windowWidth/64, cashOutButton.y + windowHeight/30);
  }
  fill(10, 12, 18);
  rect(0, 0, width, height * 0.08);

  fill(0, 255, 100);
  textSize(windowWidth*0.02);
  textAlign(LEFT, CENTER);
  text("Balance: $" + money.toFixed(2), width*0.02, height*0.04);

  fill(255);
  textAlign(RIGHT, CENTER);
  text("Multiplier: " + winMultiplier.toFixed(2) + "x", width*0.98, height*0.04);
  
  fill(255, 200, 0);
  textSize(windowWidth * 0.02);
  text("BET: $" + bet, windowWidth * 0.5, windowHeight * 0.04);

}

function generateGrid(){
  // clears the arrays for a new game each time 
  grid = []; //stores where bombs are located
  revealedTiles = []; // tracks which tiles have been clicked

  //loops through each row of the tower to build the 2d grid
  for (let r = 0; r < rows; r ++){
    grid[r] = []; // makes each row a new array inside the main array
    revealedTiles[r]= [];
    for (let c = 0; c < cols; c++){
      grid[r][c] = "safe"; // sets each tile to be safe
      revealedTiles[r][c] = false; // no tiles have been revealed yet
    }
  }
  //tracks amount of bombs that have been placed
  let bombsPlaced = 0;

  //continues placing bombs randomly until required number is reached
  while (bombsPlaced < numberOfBombs){

    let randomPlacementX = floor(random(cols)); //chooses random column within the row
    let randomPlacementY = floor(random(rows));  

    //only place a bomb if the tile is currently safe so multiple bombs dont end up on the same tile
    if (grid[randomPlacementY][randomPlacementX] === "safe"){
      grid[randomPlacementY][randomPlacementX] = "bomb";
      bombsPlaced ++;
    }

  }
}

function placeBet(){
  safeClicks = 0;
  winMultiplier = 1;
  if (bet <= money){ // ensures the player cannot bet more money than they currently have
    money -= bet;
  }
}

//returns the users money + any money they made off their bet
function cashOut(){
  gameState = "stopped";
  money += bet * winMultiplier;
  winMultiplier = 1;
}

function updateMultiplier(){
  // safe tiles defines maximum possible progression
  let safeTiles = rows * cols - numberOfBombs;

  //creates a number between 0 and 1 to determine how far into the round the user is
  let progress = safeClicks / safeTiles;

  // max multiplier scales with bomb count
  let maxMultiplier = 3 + numberOfBombs * 0.9;

  //starts multiplier at 1x and increases it based on bomb count and the progression of the user
  // more bombs and the further in the higher the multiplier can be
  winMultiplier = 1 + (maxMultiplier - 1) * Math.pow(progress, 1.5); // math.pow raises the progression to power of 1.5
}

function mouseWheel(event){  
  if (gameState === "stopped"){
    if (event.delta < 0 && bet < BET_MAX){ // can't bet over $500
      bet+=5;
    }
    else if(event.delta > 0 && bet > BET_MIN){ // can't bet under $25
      bet -=5;
    }  
  }
  return false; // so that the screen doesn't scroll when the mouse wheel scrolls.
}

//pressing r will reset users money to $500
function keyPressed(){
  if (gameState === "stopped"){
    if (key === "r"){
      money = 500;
    }
  }
}