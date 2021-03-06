//player
let player = $("#player");
let playerTop = player.position().top;
cycleAnimationPlayer = 1;

//windows
let w = window.innerWidth;
let h = window.innerHeight;

//balls
let balls = [];

//score
let score = 0;
let elementScore = $("#score");

//perdu
let lose = false;

//invinsible
let invincible = false;
let timeInvincible = 10;
let elementInvinsible = $("#invinsible");

//sound
let audio = new Audio("./sound/Crocrodile_instru.mp3");

//gameOver
let elementGameOver = $("#game-over");
let elementFinalScore = $("#final-score");
let btnGameOver = $("#btn-game-over");

//intervall
let listIntervall = [];

console.log(elementScore);

let typeBalls = [
  '<div class="ball-red"></div>',
  '<div class="ball-blue"></div>',
  '<div class="ball-black"></div>',
  '<div class="ball-green"></div>',
];

//set position player
player.offset({ top: playerTop, left: 50 });

//init Function
moveRight();
moveLeft();
generateBalls();
DownBall();
playSound();

function playSound() {
  $(document).keydown(function (e) {
    audio.play();
    audio.loop = true; 
  });
}

/**
 * Move Right player
 */
function moveRight() {
  console.log("test");
  $(document).keydown(function (e) {
    if (e.key == "d" || e.key == "D") {
      let coordinates = player.offset();
      let left = coordinates.left + 10;

      if (w - left > player.height() && !lose) {
        player.offset({ top: playerTop, left: left });
        animationPlayer();
        player.removeClass("miroir-player");
      }
    }
  });
}

/**
 * Move Left player
 */
function moveLeft() {
  $(document).keypress(function (e) {
    if (e.key == "q" || e.key == "Q") {
      let coordinates = player.offset();
      let left = coordinates.left - 10;
      if (left > 0 && !lose) {
        player.offset({ top: playerTop, left: left });
        animationPlayer();
        player.addClass("miroir-player");
      }
    }
  });
}

function animationPlayer() {

  const armor = invincible ? '_armor' : "";

  if (cycleAnimationPlayer === 1) {
    player.attr("src", `./image/crocro${armor}_2.png`);
    cycleAnimationPlayer = 2;
  } else {
    player.attr("src", `./image/crocro${armor}.png`);
    cycleAnimationPlayer = 1;
  }
}

function generateBalls() {
  listIntervall.push(
    setInterval(function () {
      if (balls.length < 25) {
        let randomColors = randomInt(0, 3);

        let randomPositions = generalPositionBall();

        let newBall = $(typeBalls[randomColors]);
        $("body").append(newBall);
        newBall.offset({ top: 0, left: randomPositions });

        balls.push(newBall);
      }
    }, 200)
  );
}

function generalPositionBall() {
  let randomPositions = randomInt(0, w - 30);
  let randomRight = randomPositions + 30;

  balls.forEach((element) => {
    const coordinates = element.offset();
    const top = coordinates.top;
    const left = coordinates.left - 5;
    const right = coordinates.left + 35;

    if (top < 40 && randomRight > left && randomRight < right) {
      console.log("collision");

      randomPositions = generalPositionBall();
    } else if (top < 40 && randomPositions > left && randomPositions < right) {
      console.log("collision");
      randomPositions = generalPositionBall();
    }
  });

  return randomPositions;
}

function DownBall() {
  listIntervall.push(
    setInterval(function () {
      balls.forEach((element, index) => {
        const coordinates = element.offset();
        const top = coordinates.top + 5;
        const left = coordinates.left;

        if (collisionBalls(element)) {
          console.log("CRASH");

          effectBall(element, index);
        }

        if (top + 30 > innerHeight) {
          removeBall(element, index);
          // balls.splice(index, 1);
          // element.remove();
        } else {
          element.offset({ top, left });
        }
      });
    }, 20)
  );
}

/**
 *
 * @param {Element} element
 */
function collisionBalls(balls) {
  const coordinates = balls.offset();

  const top = coordinates.top;
  const left = coordinates.left;
  const right = coordinates.left + 30;
  const bottom = coordinates.top + 30;

  const coordoPlayer = player.offset();

  const topPlayer = coordoPlayer.top;
  const leftPlayer = coordoPlayer.left;
  const rightPlayer = coordoPlayer.left + player.width();
  const bottomPlayer = coordoPlayer.top + player.height();

  let crash = true;

  if (bottom < topPlayer || top > bottomPlayer || right < leftPlayer || left > rightPlayer) {
    crash = false;
  }

  console.log(crash);

  return crash;
}

function effectBall(element, index) {
  const classBalls = $(element).attr("class");
  switch (classBalls) {
    case "ball-red":
      score++;
      elementScore.text(score);
      this.player.height = this.player.height + 10;
      playerTop = playerTop - 10;
      player.offset({ top: playerTop });
      console.log(playerTop);
      break;
    case "ball-blue":
      if (score == 0) {
        if (!invincible) {
          lose = true;
          gameOver();
        }
      } else if(!invincible) {
        score--;
        elementScore.text(score);
        this.player.height = this.player.height - 10;
        playerTop = playerTop + 10;
        player.offset({ top: playerTop });
        console.log(playerTop);
      }

      break;
    case "ball-green":
      if (!invincible) {
        invincible = true;

        cycleAnimationPlayer === 1
          ? player.attr("src", "./image/crocro_armor.png")
          : player.attr("src", "./image/crocro_armor_2.png");

        elementInvinsible.css("display", "inline");

        const interval = setInterval(() => {
          if (timeInvincible !== 0) {
            timeInvincible--;
            elementInvinsible.text(`invinsible: ${timeInvincible} sec`);
          }
        }, 1000);

        listIntervall.push(interval);

        setTimeout(() => {
          elementInvinsible.css("display", "none");
          cycleAnimationPlayer === 1
          ? player.attr("src", "./image/crocro.png")
          : player.attr("src", "./image/crocro_2.png");

          timeInvincible = 10;
          invincible = false;
          clearInterval(interval);
        }, 10000);
      }

      break;
    case "ball-black":
      if (!invincible) {
        gameOver();
        lose = true;
      }
      break;
  }

  removeBall(element, index);
}

function removeBall(ball, index) {
  balls.splice(index, 1);
  ball.remove();
}

function gameOver() {
  lose = true;

  audio.pause();

  listIntervall.forEach((element) => {
    clearInterval(element);
  });

  elementGameOver.css("display", "block");

  console.log(elementFinalScore);
  elementFinalScore.text(`Nombre de point : ${score}`);

  btnGameOver.click(() => {
    document.location.reload();
  });
}

/**
 * Generate random int
 * @param {number} min
 * @param {number} max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
