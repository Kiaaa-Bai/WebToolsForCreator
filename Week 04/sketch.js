window.numPerType = 30;
window.emojiFor = { rock: "🪨", scissors: "✂️", paper: "📄" };

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

function restartBattle() {
  emojis = [];
  effects = [];

  // start point
  let rockX = 300, rockY = 100;
  let scissorsX = 150, scissorsY = 500;
  let paperX = 450, paperY = 500;

  // rocks
  for (let i = 0; i < window.numPerType; i++) {
    emojis.push(new EmojiAgent(rockX + random(-15, 15), rockY + random(-15, 15), "rock"));
  }

  // scissors
  for (let i = 0; i < window.numPerType; i++) {
    emojis.push(new EmojiAgent(scissorsX + random(-15, 15), scissorsY + random(-15, 15), "scissors"));
  }

  // papers
  for (let i = 0; i < window.numPerType; i++) {
    emojis.push(new EmojiAgent(paperX + random(-15, 15), paperY + random(-15, 15), "paper"));
  }
}
window.restartBattle = restartBattle;

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
  let face = window.emojiFor;
  noStroke();
  fill(0);
  textSize(16);
  text(`${face.rock}: ${c.rock}   ${face.scissors}: ${c.scissors}   ${face.paper}: ${c.paper}`, width / 2, 25);
  textSize(22);
}


class EmojiAgent {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(0.5, 1.5));
    this.type = type;
  }

  updateMotion() {
    this.position.add(this.velocity);
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
    fill(0);
    text(window.emojiFor[this.type], this.position.x, this.position.y);
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
