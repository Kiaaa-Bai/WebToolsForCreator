let countSlider = document.getElementById("countSlider");
let countValue = document.getElementById("countValue");
let speedSlider = document.getElementById("speedSlider");
let speedValue = document.getElementById("speedValue");
let restartButton = document.getElementById("restartButton");
let gifButton = document.getElementById("gifButton");

// "input" fires the whole time the slider is being dragged
countSlider.addEventListener("input", onCountInput);
speedSlider.addEventListener("input", onSpeedInput);
restartButton.addEventListener("click", onRestart);
gifButton.addEventListener("click", onGif);

function onCountInput(ev) {
  let sliderValue = Number(countSlider.value);
  window.numPerType = sliderValue;
  countValue.textContent = sliderValue;
  window.adjustPopulation();
}

function onSpeedInput(ev) {
  let sliderValue = Number(speedSlider.value);
  window.speed = sliderValue;
  speedValue.textContent = sliderValue + "×";
}

function onRestart(ev) {
  window.restartBattle();
}

function onGif(ev) {
  saveGif("emoji-battle", 3);
}
