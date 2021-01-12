//player
let player = $("#player");
let playerTop = player.position().top;

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

console.log(elementScore);

let typeBalls = [
  '<div class="ball-red"></div>',
  '<div class="ball-blue"></div>',
  '<div class="ball-black"></div>',
];

//set position player
player.offset({ top: playerTop, left: 50 });

//init Function
moveRight();
moveLeft();
generateBalls();
DownBall();

/**
 * Move Right player
 */
function moveRight() {
  console.log("test");
  $(document).keypress(function (e) {
    if (e.key == "d" || e.key == "D") {
      let coordinates = player.offset();
      let left = coordinates.left + 10;

      if (w - left > 65) {
        player.offset({ top: playerTop, left: left });
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

      if (left > 0) {
        player.offset({ top: playerTop, left: left });
      }
    }
  });
}

function generateBalls() {
  setInterval(function () {
    let generateNewBall = randomInt(1, 3);

    if (generateNewBall == 1 && balls.length < 15) {
      let randomColors = randomInt(0, 2);

      let randomPositions = generalPositionBall();

      let newBall = $(typeBalls[randomColors]);
      $("body").append(newBall);
      newBall.offset({ top: 0, left: randomPositions });

      balls.push(newBall);
    }
  }, 200);
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
  setInterval(function () {
    balls.forEach((element, index) => {
      const coordinates = element.offset();
      const top = coordinates.top + 5;
      const left = coordinates.left;

      if (collisionBalls(element)) {
        console.log("CRASH");
        const classBalls = $(element).attr("class");

        switch (classBalls) {
          case "ball-red":
            score++;
            elementScore.text(score);
            this.player.height = this.player.height + 10;
            playerTop = playerTop - 10;
            player.offset({top:playerTop }); 
            console.log(playerTop);
            break;
          case "ball-blue":
            if (score == 0) {
              lose = true;
              alert("Vous avez perdu");
            } else {
              score--;
              elementScore.text(score);
              this.player.height = this.player.height - 10;
              playerTop = playerTop + 10;
              player.offset({top:playerTop });
              console.log(playerTop);
            }

            break;
          case "ball-black":
            lose = true;
            alert("Vous avez perdu !");
            break;
        }

        removeBall(element, index);
      }

      if (top + 30 > innerHeight) {
        removeBall(element, index);
        // balls.splice(index, 1);
        // element.remove();
      } else {
        element.offset({ top, left });
      }
    });
  }, 20);
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

function removeBall(ball, index) {
  balls.splice(index, 1);
  ball.remove();
}

/**
 * Generate random int
 * @param {number} min
 * @param {number} max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
