///Global Variables
let playerMoney;



function setup() {
  createCanvas(windowWidth, windowHeight);
}



function draw() {
  background("#374243");
  updateLocalStorage();
  circle(mouseX,mouseY, 20);
}


function updateLocalStorage(){
  ///updates 
  localStorage.setItem("money", playerMoney);
  let moneyDisplay = document.getElementById("moneyDisplay");
  if (moneyDisplay) {
    moneyDisplay.textContent = "Money: $" + playerMoney;
  }
}