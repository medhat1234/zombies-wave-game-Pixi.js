let SW = window.innerWidth,
  SH = window.innerHeight;
let pressedButtons = [];
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
  "https://lh3.googleusercontent.com/drive-viewer/AEYmBYRzbNkTua4JyWsGHwieNay_GchUw6EyS71CPs3jCVAYPqfN95gWSD1HA_I1nypxM-7Du27U16TAns9UBcr6SPvNI1XO7g=s2560";

let player = PIXI.Sprite.from(playerTexURL);
let speed = 5,
  shotspeed = 20;
app.stage.addChild(player);

player.anchor.set(0.5);
player.position.set(SW / 2, SH / 2);
player.scale.set(0.3, 0.3);
app.stage.eventMode = "static";
app.stage.on("globalpointermove", (e) => {
  mouse.position = e.data.global;
});
window.addEventListener("click", (e) => {
  console.log("shot");
});
app.ticker.add((delta) => update(delta));

function update(delta) {
  collided(player, SW, SH);
  movement(delta);
  player.rotation = LookAt(player, mouse);
}
function movement(delta) {
  //CSB = [0-collided right border,1-collided left border,2-collided lower border,3-collided upper border]
  if (pressedButtons.includes(87)) {
    if (CSB[3]) {
      return;
    }
    if (player.position.y - player.height / 2 < speed) {
      player.position.y = player.height / 2;
    } else {
      player.position.y -= speed * delta;
    }
  }
  if (pressedButtons.includes(83)) {
    if (CSB[2]) {
      return;
    }
    if (SH - (player.position.y + player.height / 2) < speed) {
      player.position.y = SH - player.height / 2;
    } else {
      player.position.y += speed * delta;
    }
  }
  if (pressedButtons.includes(65)) {
    if (CSB[1]) {
      return;
    }
    if (player.position.x - player.width / 2 < speed) {
      player.position.x = player.width / 2;
    } else {
      player.position.x -= speed * delta;
    }
  }
  if (pressedButtons.includes(68)) {
    if (CSB[0]) {
      return;
    }
    if (SW - (player.position.x + player.width / 2) < speed) {
      player.position.x = SW - player.width / 2;
    } else {
      player.position.x += speed * delta;
    }
  }
  if (pressedButtons.includes(16)) {
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
  pressedButtons.push(e.keyCode);
});
window.addEventListener("keyup", (e) => {
  pressedButtons = pressedButtons.filter((chr) => {
    return chr !== e.keyCode;
  });
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
function LookAt(main, target) {
  //return angle between two points
  if (
    main.position.y > target.position.y &&
    main.position.x < target.position.x
  ) {
    return Math.asin(
      Math.sqrt((main.position.x - target.position.x) ** 2) /
        Math.sqrt(
          (main.position.x - target.position.x) ** 2 +
            (main.position.y - target.position.y) ** 2
        )
    );
  } else if (
    main.position.y < target.position.y &&
    main.position.x < target.position.x
  ) {
    return (
      Math.PI -
      Math.asin(
        Math.sqrt((main.position.x - target.position.x) ** 2) /
          Math.sqrt(
            (main.position.x - target.position.x) ** 2 +
              (main.position.y - target.position.y) ** 2
          )
      )
    );
  } else if (
    main.position.y <= target.position.y &&
    main.position.x >= target.position.x
  ) {
    return (
      Math.PI +
      Math.asin(
        Math.sqrt((main.position.x - target.position.x) ** 2) /
          Math.sqrt(
            (main.position.x - target.position.x) ** 2 +
              (main.position.y - target.position.y) ** 2
          )
      )
    );
  } else if (
    main.position.y >= target.position.y &&
    main.position.x >= target.position.x
  ) {
    return (
      2 * Math.PI -
      Math.asin(
        Math.sqrt((main.position.x - target.position.x) ** 2) /
          Math.sqrt(
            (main.position.x - target.position.x) ** 2 +
              (main.position.y - target.position.y) ** 2
          )
      )
    );
  }
}
