let SW = window.innerWidth,
  SH = window.innerHeight;
let pressedButtons = new Set();
let mouse = {
  position: {
    x: 0,
    y: 0,
  },
};
let CSB = [false, false, false, false];
const app = new PIXI.Application({
  height: SH,
  width: SW,
  backgroundColor: "FBF6EE",
});

app.renderer.view.style.position = "absolute";
document.body.appendChild(app.view);
let playerTexURL =
    "https://lh3.googleusercontent.com/drive-viewer/AEYmBYRzbNkTua4JyWsGHwieNay_GchUw6EyS71CPs3jCVAYPqfN95gWSD1HA_I1nypxM-7Du27U16TAns9UBcr6SPvNI1XO7g=s2560",
  projectileTexUrl =
    "https://lh3.googleusercontent.com/drive-viewer/AEYmBYTKgkP40scMB8hK5UKB9nmqHWvJGLo4pTK95kqWsx9YQczw0IuBfMfdh0E-F1yQ4DylwhJbZWRm_vmC_zOO4CNXbaT2Nw=s2560";

let player = PIXI.Sprite.from(playerTexURL);
let bullet = PIXI.Sprite.from(projectileTexUrl),
  isShooting = false,
  dir = 0;
let speed = 5,
  shotspeed = 25;
let bulletsArr = [];
app.stage.addChild(player);

player.anchor.set(0.5);
player.position.set(SW / 2, SH / 2);
player.scale.set(0.3, 0.3);
app.stage.eventMode = "static";
app.stage.on("globalpointermove", (e) => {
  mouse.position = e.data.global;
});
window.addEventListener("mousedown", (e) => {
  console.log("shot");
  shot(player, bullet);
});
window.addEventListener("mouseup", (e) => {
  isShooting = false;
});
app.ticker.add(update);

function update() {
  collided(player, SW, SH);
  movement();

  player.rotation = LookAt2(player, mouse);
  if (isShooting) {
    particleSystem(dir, bulletsArr[bulletsArr.length - 1]);
  }
}
function shot(shooter, bullet) {
  bulletsArr.push(PIXI.Sprite.from(projectileTexUrl));
  dir = shooter.rotation;
  //intialize
  app.stage.addChild(bulletsArr[bulletsArr.length - 1]);
  bulletsArr[bulletsArr.length - 1].anchor.set(0.5);
  bulletsArr[bulletsArr.length - 1].scale.set(0.7);
  bulletsArr[bulletsArr.length - 1].position = shooter.position;
  bulletsArr[bulletsArr.length - 1].rotation = shooter.rotation;
  isShooting = true;
}
function particleSystem(direction, projectile) {
  if (
    projectile.position.x <= SW &&
    projectile.position.x >= 0 &&
    projectile.position.y <= SH &&
    projectile.position.y >= 0
  ) {
    projectile.position.x -= shotspeed * Math.cos(Math.PI / 2 + direction);
    projectile.position.y -= shotspeed * Math.sin(Math.PI / 2 + direction);
  } else {
    app.stage.removeChild(projectile);
    bulletsArr.pop();
  }
}
function movement() {
  //CSB = [0-collided right border,1-collided left border,2-collided lower border,3-collided upper border]
  if (pressedButtons.has(87)) {
    if (CSB[3]) {
      return;
    }
    if (player.position.y - player.height / 2 < speed) {
      player.position.y = player.height / 2;
    } else {
      player.position.y -= speed;
    }
  }
  if (pressedButtons.has(83)) {
    if (CSB[2]) {
      return;
    }
    if (SH - (player.position.y + player.height / 2) < speed) {
      player.position.y = SH - player.height / 2;
    } else {
      player.position.y += speed;
    }
  }
  if (pressedButtons.has(65)) {
    if (CSB[1]) {
      return;
    }
    if (player.position.x - player.width / 2 < speed) {
      player.position.x = player.width / 2;
    } else {
      player.position.x -= speed;
    }
  }
  if (pressedButtons.has(68)) {
    if (CSB[0]) {
      return;
    }
    if (SW - (player.position.x + player.width / 2) < speed) {
      player.position.x = SW - player.width / 2;
    } else {
      player.position.x += speed;
    }
  }
  if (pressedButtons.has(16)) {
    speed = 10;
  } else {
    speed = 5;
  }
}
// input system
window.addEventListener("keydown", (e) => {
  if (e.repeat) {
    return;
  }
  pressedButtons.add(e.keyCode);
});
window.addEventListener("keyup", (e) => {
  pressedButtons.delete(e.keyCode);
});
function collided(player, screenwidth, screenheight) {
  if (player.position.x >= screenwidth - player.width / 2) {
    CSB[0] = true;
    CSB[1] = false;
  } else if (player.position.x <= player.width / 2) {
    CSB[1] = true;
    CSB[0] = false;
  } else {
    CSB[1] = false;
    CSB[0] = false;
  }
  if (player.position.y >= screenheight - player.height / 2) {
    CSB[2] = true;
    CSB[3] = false;
  } else if (player.position.y <= player.height / 2) {
    CSB[3] = true;
    CSB[2] = false;
  } else {
    CSB[3] = false;
    CSB[2] = false;
  }
}
function LookAt2(main, target) {
  //return angle between two points
  return (
    Math.PI / 2 +
    Math.atan2(
      target.position.y - main.position.y,
      target.position.x - main.position.x
    )
  );
}
