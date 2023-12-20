let SW = window.innerWidth,
  SH = window.innerHeight;

let CSB = [false, false, false, false];
const app = new PIXI.Application({
  height: SH,
  width: SW,
  backgroundColor: "FBF6EE",
});

app.renderer.view.style.position = "absolute";
document.body.appendChild(app.view);
const playerTex = PIXI.Texture.from(
  "https://lh3.googleusercontent.com/drive-viewer/AEYmBYSZ2EcfvWDYAmFdkgfzGahNcOp3lI9EnN4eiYy_jrglYYIxp80kX6fM8UJPJAKCCIGbzbJmi5DdkOrT7a-YzjMEd7PvOQ=s2560"
);
const ZombieTex = PIXI.Texture.from(
  "https://lh3.googleusercontent.com/drive-viewer/AEYmBYQvyS9Tm8H7bYAxhb9JjnuoyCIF6CWHe0yeGp9MHVArYOmGu0YDjrf8RzZcppuAFExPP8__UnQTBc-Tdve6LT_3tS8egQ=s2560"
);
const bulletTex = PIXI.Texture.from(
  "https://lh3.googleusercontent.com/drive-viewer/AEYmBYTGfbKfioP03I0I275dPKA74Db5-l0mmOSM1xUAF7923Dv4u730WdPb9j9f2gLJEttcH8rMmseaMI5igruwQiupNrys4A=s2560"
);
//const lightTex = PIXI.Texture.from(
("https://e1.pngegg.com/pngimages/217/260/png-clipart-luces-round-white-blur-spot.png");
//);
//let light = PIXI.Sprite.from(lightTex);
let player = PIXI.Sprite.from(playerTex);
let zombies = [];
let bullet = PIXI.Sprite.from(bulletTex);

let speed = 3;

app.stage.addChild(player);
player.anchor.set(0.5);
player.position.set(SW / 2, SH / 2);
player.scale.set(0.3, 0.3);

//add zombies
for (i = 0; i < 20; i++) {
  const zombie = PIXI.Sprite.from(ZombieTex);
  zombie.anchor.set(0.5);
  zombie.position.set(Math.random() * SW, Math.random() * SH);
  zombie.scale.set(0.5 + Math.random() * 0.5);
  app.stage.addChild(zombie);
  zombies.push(zombie);
}

app.ticker.add(update);
function update() {
  collided(player, SW, SH);
  movement();
  Shooting();
  player.rotation = lookAt(player, mouse);
  zombies.forEach((e) => {
    e.rotation = lookAt(e, player);
    VectorMove(e, 1);
  });
}
function Shooting() {
  if (pressedButtons.has(0)) {
  }
}
function VectorMove(object, magnitude) {
  //moves in constant direction in this case it moves in direction of object face
  object.position.x -= magnitude * Math.cos(Math.PI / 2 + object.rotation);
  object.position.y -= magnitude * Math.sin(Math.PI / 2 + object.rotation);
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
    speed = 5;
  } else {
    speed = 3;
  }
}

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

function lookAt(main, target) {
  //return angle between two points
  return Math.PI / 2 + Math.atan2(target.y - main.y, target.x - main.x);
}

///////////********/////// input system  /////*********////////
let pressedButtons = new Set();
let mouse = {
  x: 0,
  y: 0,
};

//mouse

window.addEventListener("pointermove", (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

window.addEventListener("mousedown", (e) => {
  pressedButtons.add(0);
});
window.addEventListener("mouseup", (e) => {
  if (e.button === 2) {
    pressedButtons.delete(1);
  } else {
    pressedButtons.delete(0);
  }
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  pressedButtons.add(1);
});

//keyboard
window.addEventListener("keydown", (e) => {
  if (!e.repeat) {
    pressedButtons.add(e.keyCode);
  }
});
window.addEventListener("keyup", (e) => {
  pressedButtons.delete(e.keyCode);
});
