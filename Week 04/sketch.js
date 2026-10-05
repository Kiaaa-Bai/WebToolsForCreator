window.numPerType = 30;
window.speed = 1;

let emojis = [];
let effects = [];

// collision
let collisionDistance = 18;

// sound
let rockSound, paperSound, scissorsSound;

function preload() {
  rockSound = loadSound("assets/rock.mp3");
  paperSound = loadSound("assets/paper.mp3");
  scissorsSound = loadSound("assets/scissors.mp3");
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textSize(22);

  restartBattle();
}

// one new agent at its type's start point
function spawnAgent(type) {
  let x, y;
  if (type === "rock") { x = 300; y = 100; }
  else if (type === "scissors") { x = 150; y = 500; }
  else if (type === "paper") { x = 450; y = 500; }

  emojis.push(new EmojiAgent(x + random(-15, 15), y + random(-15, 15), type));
}

function restartBattle() {
  emojis = [];
  effects = [];

  for (let i = 0; i < window.numPerType; i++) {
    spawnAgent("rock");
    spawnAgent("scissors");
    spawnAgent("paper");
  }
}
window.restartBattle = restartBattle;

// called while the count slider moves: add or remove agents, keep the battle going
function adjustPopulation() {
  let target = window.numPerType * 3;
  let types = ["rock", "scissors", "paper"];

  // too few: add one of each type in turn at the start points
  let i = 0;
  while (emojis.length < target) {
    spawnAgent(types[i % 3]);
    i++;
  }

  // too many: remove random agents
  while (emojis.length > target) {
    emojis.splice(floor(random(emojis.length)), 1);
  }
}
window.adjustPopulation = adjustPopulation;

// sound only plays after the first click
function mousePressed() {
  userStartAudio();
}

function draw() {
  background(245);

  // update each agent
  for (let i = 0; i < emojis.length; i++) {
    emojis[i].updateMotion();
    emojis[i].checkEdges();
    emojis[i].display();
  }

  // collisions + interaction rules
  for (let i = 0; i < emojis.length; i++) {
    for (let j = i + 1; j < emojis.length; j++) {
      let a = emojis[i];
      let b = emojis[j];

      let distanceValue = dist(a.position.x, a.position.y, b.position.x, b.position.y);

      if (distanceValue < collisionDistance) {
        let winner = interact(a, b); // convert types

        if (winner) {
          collideBounce(a, b); // bounce

          // effect color
          let effectColor;
          if (winner === "rock") effectColor = color(80);
          else if (winner === "paper") effectColor = color(120, 180, 255);
          else if (winner === "scissors") effectColor = color(255, 0, 0);

          effects.push({
            x: (a.position.x + b.position.x) / 2,
            y: (a.position.y + b.position.y) / 2,
            alpha: 255,
            col: effectColor
          });

          // sound
          if (winner === "rock" && rockSound.isLoaded()) rockSound.play();
          if (winner === "paper" && paperSound.isLoaded()) paperSound.play();
          if (winner === "scissors" && scissorsSound.isLoaded()) scissorsSound.play();
        }
      }
    }
  }

  // draw effects
  for (let i = effects.length - 1; i >= 0; i--) {
    let e = effects[i];
    noFill();
    stroke(red(e.col), green(e.col), blue(e.col), e.alpha);
    strokeWeight(2);
    circle(e.x, e.y, map(e.alpha, 255, 0, 10, 40));
    e.alpha -= 10;
    if (e.alpha <= 0) effects.splice(i, 1);
  }

  // counter
  let c = countTypes();
  noStroke();
  fill(0);
  textSize(16);
  text(`🪨: ${c.rock}   ✂️: ${c.scissors}   📄: ${c.paper}`, width / 2, 25);
  textSize(22);
}

class EmojiAgent {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(0.5, 1.5));
    this.type = type;
  }

  // speed slider scales how far everyone moves each frame
  updateMotion() {
    this.position.add(p5.Vector.mult(this.velocity, window.speed));
  }

  checkEdges() {
    if (this.position.x < collisionDistance) {
      this.position.x = collisionDistance;
      this.velocity.x *= -1;
    }
    if (this.position.x > width - collisionDistance) {
      this.position.x = width - collisionDistance;
      this.velocity.x *= -1;
    }
    if (this.position.y < collisionDistance) {
      this.position.y = collisionDistance;
      this.velocity.y *= -1;
    }
    if (this.position.y > height - collisionDistance) {
      this.position.y = height - collisionDistance;
      this.velocity.y *= -1;
    }
  }

  display() {
    noStroke();
    if (this.type === "rock") text("🪨", this.position.x, this.position.y);
    else if (this.type === "paper") text("📄", this.position.x, this.position.y);
    else if (this.type === "scissors") text("✂️", this.position.x, this.position.y);
  }
}

function interact(a, b) {
  if (a.type === b.type) return null;
  let winner = null;

  if (a.type === "rock" && b.type === "scissors") { b.type = "rock"; winner = "rock"; }
  else if (a.type === "scissors" && b.type === "paper") { b.type = "scissors"; winner = "scissors"; }
  else if (a.type === "paper" && b.type === "rock") { b.type = "paper"; winner = "paper"; }

  if (b.type === "rock" && a.type === "scissors") { a.type = "rock"; winner = "rock"; }
  else if (b.type === "scissors" && a.type === "paper") { a.type = "scissors"; winner = "scissors"; }
  else if (b.type === "paper" && a.type === "rock") { a.type = "paper"; winner = "paper"; }

  return winner;
}

function collideBounce(a, b) {
  let direction = p5.Vector.sub(b.position, a.position);
  direction.normalize();

  let speed = 2;
  a.velocity = p5.Vector.mult(direction, -speed);
  b.velocity = p5.Vector.mult(direction, speed);
}


function countTypes() {
  let count = { rock: 0, paper: 0, scissors: 0 };
  for (let i = 0; i < emojis.length; i++) {
    count[emojis[i].type]++;
  }
  return count;
}
