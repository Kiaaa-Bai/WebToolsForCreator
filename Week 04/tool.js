let rockInput = document.getElementById("rockInput");
let scissorsInput = document.getElementById("scissorsInput");
let paperInput = document.getElementById("paperInput");
let countSlider = document.getElementById("countSlider");
let restartButton = document.getElementById("restartButton");
let gifButton = document.getElementById("gifButton");

rockInput.addEventListener("change", onRockChange);
scissorsInput.addEventListener("change", onScissorsChange);
paperInput.addEventListener("change", onPaperChange);
countSlider.addEventListener("change", onCountChange);
restartButton.addEventListener("click", onRestart);
gifButton.addEventListener("click", onGif);

function onRockChange(ev) {
  if (rockInput.value !== "") {
    window.emojiFor.rock = rockInput.value;
  }
}

function onScissorsChange(ev) {
  if (scissorsInput.value !== "") {
    window.emojiFor.scissors = scissorsInput.value;
  }
}

function onPaperChange(ev) {
  if (paperInput.value !== "") {
    window.emojiFor.paper = paperInput.value;
  }
}

function onCountChange(ev) {
  let sliderValue = countSlider.value;
  window.numPerType = sliderValue;
}

function onRestart(ev) {
  window.restartBattle();
}

function onGif(ev) {
  saveGif("emoji-battle", 3);
}
