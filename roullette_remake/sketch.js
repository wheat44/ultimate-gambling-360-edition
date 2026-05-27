///Global Variables
let playerMoney;
state = 'main';

const REDNUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACKNUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
let bettingGrid = [];
const ROWS = 12;
const COLS = 3;
let betX;
let betY;
let cellX;
let cellY;

function setup() {
  createCanvas(windowWidth, windowHeight - 80);
  betX = windowWidth/2;
  betY = windowHeight/5;
  cellX = windowWidth/30;
  cellY = windowHeight/9;
}



function draw() {
  background("#374243");
  updateLocalStorage();
  circle(mouseX,mouseY, 20);
  createGrid();
  drawGrid();
  createExtraSquares();
}


function updateLocalStorage(){
  ///updates 
  localStorage.setItem("money", playerMoney);
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;
  }
}


function createGrid(){
  ///creates the grid based on grid height/ width
  let index = 1;
  for (let y = 0; y < ROWS; y++) {
    bettingGrid.push([]);
    for (let x = 0; x < COLS; x++) {
      bettingGrid[y].push(index);
      index ++;
    }
  }
}

function drawGrid() {
  if (state === 'main') {

    // draw main 12 x 3 number grid
    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {

        let boxX = x * cellX + betX;
        let boxY = y * cellY + betY;

        betTextX = boxX + cellX / 2;
        betTextY = boxY + cellY / 2;

        /// alternate colours based on box for roulette pattern
        let currentNumber = bettingGrid[x][y];

        if (REDNUMBERS.includes(currentNumber)) {
          colour = 'red';
        }
        else if (BLACKNUMBERS.includes(currentNumber)) {
          colour = 'black';
        }


        ///draw each square
        fill(colour);
        rect(boxX, boxY, cellX, cellY);

        ///number each box
        fill('white');
        textSize(20);
        textAlign(CENTER, CENTER);
        text(bettingGrid[x][y], betTextX, betTextY);
      }
    }
  }
}


function createExtraSquares(){
  ///creates all accessory squares that exist outside the main grid
  /// two to one 
  for (let y = 0; y < COLS; y++){
    fill('green');
    rect(betX + cellX * ROWS , betY + cellY * y,cellX,cellY);
    fill('black');
    textSize(20);
    textAlign(CENTER, CENTER);
    text("2 to 1", betX + cellX * ROWS + cellX/2,betY + cellY * y + cellY/2);
  }
  /// 0's and 00's
  for (let y = 0; y < 2; y++){
    fill('green');
    rect(betX - cellX , betY + cellY *1.5 * y ,cellX,cellY* 1.5);
    fill('black');
    textSize(20);
    textAlign(CENTER, CENTER);
    // text("2 to 1", betX + cellX * ROWS + cellX/2,betY + cellY * y + cellY/2);
  }

  /// dozens
  for (let x = 0; x < 3; x++){
    fill('green');
    rect(betX + 4*cellX * x , betY + cellY * COLS,cellX * 4  ,cellX);
    fill('black');
    textSize(20);
    textAlign(CENTER, CENTER);
    text(x + 1 +" Dozen", betX + 4*cellX * x + cellX*2, (cellX/2 , betY + cellY *COLS) + cellX/2);
  }

  /// bottom row
  for (let x = 0; x < 6; x++){
    fill('green');
    rect(betX + 2*cellX * x , betY + cellY * COLS + cellX ,cellX * 2 ,cellX);
    fill('black');
    textSize(20);
    textAlign(CENTER, CENTER);
    // text(x + 1 +" Dozen", betX + 4*cellX * x + cellX*2, (cellX/2 , betY + cellY *COLS) + cellX/2);
  }

}


function windowResized(){
  createCanvas(windowWidth, windowHeight - 80);
  betX = windowWidth/2;
  betY = windowHeight/5;
  cellX = windowWidth/30;
  cellY = windowHeight/9;
  scaleText();
}

function scaleText(){

}