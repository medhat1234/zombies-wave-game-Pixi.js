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
let player = PIXI.Sprite.from(playerTex),
  speed = 3;
let healthbar = PIXI.Sprite.from(PIXI.Texture.WHITE),
  back = PIXI.Sprite.from(PIXI.Texture.WHITE);
healthbar.tint = "green";
back.tint = "red";
back.width = 400;
healthbar.width = 400;
app.stage.addChild(back);
app.stage.addChild(healthbar);
player["health"] = 1000;
app.stage.addChild(player);
player.anchor.set(0.5);
player.position.set(SW / 2, SH / 2);
player.scale.set(0.3, 0.3);

const entities = {
  entitieSpeed: 3,
  entities: new Set(),
  spawning: function (texture, count, size, speed) {
    for (i = 0; i < count; i++) {
      const entitie = PIXI.Sprite.from(texture);
      entitie.health = 1000;
      entitie.speed = speed + 2 * Math.random();
      entitie.anchor.set(0.5);
      entitie.position.set(Math.random() * SW, Math.random() * SH);
      entitie.scale.set(size + Math.random() * 0.3);
      app.stage.addChild(entitie);
      this.entities.add(entitie);
    }
  },
  Main: function () {
    this.entities.forEach((entitie) => {
      entitie.rotation = lookAt(entitie, player);
      ParticleSystem.parts.forEach((part) => {
        if (distanceBetween(entitie, part) <= entitie.width / 2) {
          if (entitie.health > 0) {
            entitie.health -= 1;
          } else {
            this.entities.delete(entitie);
            app.stage.removeChild(entitie);
          }
        }
      });
      if (
        distanceBetween(player, entitie) + 15 >
        (entitie.width + player.width) / 2
      ) {
        VectorMove(entitie, entitie.speed);
      } else {
        player.health -= 1;
      }
    });
  },
};

const ParticleSystem = {
  projectileSpeed: 50,
  frequency: 9000,
  parts: new Set(),
  partsreapeter: null,

  main: function () {
    if (this.parts.size > 0) {
      this.parts.forEach((part) => {
        VectorMove(part, this.projectileSpeed);
        if (part.x > SW || part.x < 0 || part.y > SH || part.y < 0) {
          this.parts.delete(part);
          app.stage.removeChild(part);
        }
      });
    }
  },
  addparts: function (emitter) {
    const bullet = PIXI.Sprite.from(bulletTex);
    bullet.anchor.set(0.5);
    bullet.position.set(emitter.x, emitter.y);
    bullet.scale.set(0.35);
    bullet.rotation = emitter.rotation;
    app.stage.addChild(bullet);
    this.parts.add(bullet);
  },
  Toggle: function (on) {
    if (on) {
      this.partsreapeter = setInterval(
        () => this.addparts(player),
        10000 / this.frequency
      );
    } else if (!on) {
      clearInterval(this.partsreapeter);
    }
  },
};

entities.spawning(ZombieTex, 10, 0.5, 3);

app.ticker.add(update);

function update() {
  healthbar.width = (4 / 10) * player.health;
  if (player.health < 0) {
    return;
  }
  collided(player, SW, SH);
  movement();
  player.rotation = lookAt(player, mouse);
  entities.Main();
  ParticleSystem.main();
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
function distanceBetween(first, second) {
  return Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2);
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
  if (e.button === 0) {
    ParticleSystem.Toggle(true);
    pressedButtons.add(0);
  }
});
window.addEventListener("mouseup", (e) => {
  if (e.button === 2) {
    pressedButtons.delete(1);
  } else {
    ParticleSystem.Toggle(false);
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
