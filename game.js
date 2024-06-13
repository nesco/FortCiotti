window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const map = document.getElementById("mapImage");

  canvas.width = map.width;
  canvas.height = map.height;

  const ciottiImg = new Image();
  ciottiImg.src = "./ciotti.png";

  const wauquiezImg = new Image();
  wauquiezImg.src = "./wauquiez.png";

  const ciotti = {
    x: 750,
    y: 950,
    width: 64,
    height: 64,
    image: ciottiImg,
  };

  let projectiles = [];
  let enemies = [];

  ciottiImg.onload = function () {
    ctx.drawImage(
      ciottiImg,
      ciotti.x - ciotti.width / 2,
      ciotti.y - ciotti.height / 2,
      ciotti.width,
      ciotti.height,
    );
  };

  wauquiezImg.onerror = function () {
    console.error("Failed to load the enemy image.");
  };

  function createEnemy() {
    const enemySize = 64; // This might be adjusted based on the image size
    let enemyX, enemyY;

    // Spawn the enemy at a random edge of the canvas
    if (Math.random() < 0.5) {
      enemyX = 100; //Math.random() < 0.5 ? 0 - enemySize : canvas.width + enemySize;
      enemyY = 100; //Math.random() * canvas.height;
    } else {
      enemyX = 800; //Math.random() * canvas.width;
      enemyY = 100; //Math.random() < 0.5 ? 0 - enemySize : canvas.height + enemySize;
    }

    const angle = Math.atan2(ciotti.y - enemyY, ciotti.x - enemyX);
    const speed = 2; // Adjust speed as necessary

    return {
      x: enemyX,
      y: enemyY,
      size: enemySize,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      image: wauquiezImg,
    };
  }

  function drawEnemies() {
    enemies.forEach((enemy) => {
      ctx.drawImage(
        enemy.image,
        enemy.x - enemy.size / 2,
        enemy.y - enemy.size / 2,
        enemy.size,
        enemy.size,
      );
    });
  }

  function updateEnemies(enemiesToRemove) {
    enemies.forEach((enemy, index) => {
      enemy.x += enemy.velocity.x;
      enemy.y += enemy.velocity.y;

      // Remove enemies that are too far off-screen
      if (
        enemy.x <= -50 ||
        enemy.x >= canvas.width + 50 ||
        enemy.y <= -50 ||
        enemy.y >= canvas.height + 50
      ) {
        enemiesToRemove.add(index);
      }
    });
  }

  function checkCollision(projectile, enemy) {
    const xDist = projectile.x - enemy.x;
    const yDist = projectile.y - enemy.y;
    const distance = Math.sqrt(xDist * xDist + yDist * yDist);
    return distance < projectile.radius + enemy.size / 2;
  }

  //#region Projectiles
  function shootProjectile(mouseX, mouseY) {
    const angle = Math.atan2(
      mouseY - 950 /*character.y*/,
      mouseX - 750 /*character.x*/,
    );
    const speed = 5;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    const projectile = {
      x: 750, //character.x,
      y: 950, //character.y,
      radius: 5,
      color: "red",
      velocity,
    };
    projectiles.push(projectile);
  }

  function drawProjectiles() {
    projectiles.forEach((projectile) => {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(
        projectile.x,
        projectile.y,
        projectile.radius,
        0,
        Math.PI * 2,
        true,
      );
      ctx.fill();
    });
  }

  function updateProjectiles(projectilesToRemove) {
    projectiles.forEach((projectile, index) => {
      projectile.x += projectile.velocity.x;
      projectile.y += projectile.velocity.y;

      // Remove the projectile if it goes off screen
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        projectilesToRemove.add(index);
      }
    });
  }
  //#endregion

  function updateGame() {
    // Update projectiles
    const projectilesToRemove = new Set();
    const enemiesToRemove = new Set();

    updateProjectiles(projectilesToRemove);
    updateEnemies(enemiesToRemove);

    // Check for collisions with enemies
    projectiles.forEach((projectile, pIndex) => {
      enemies.forEach((enemy, eIndex) => {
        if (checkCollision(projectile, enemy)) {
          projectilesToRemove.add(pIndex);
          enemiesToRemove.add(eIndex);
        }
      });
    });

    // Remove projectiles and enemies that were marked for removal
    projectiles = projectiles.filter(
      (_, index) => !projectilesToRemove.has(index),
    );
    enemies = enemies.filter((_, index) => !enemiesToRemove.has(index));
  }

  // Game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.01) {
      // Adjust spawn rate as needed
      enemies.push(createEnemy());
    }
    console.log(enemies.length);

    //updateEnemies();

    ctx.drawImage(
      ciottiImg,
      ciotti.x - ciotti.width / 2,
      ciotti.y - ciotti.height / 2,
      ciotti.width,
      ciotti.height,
    );

    //updateProjectiles();

    updateGame();
    drawProjectiles();
    drawEnemies();
    requestAnimationFrame(gameLoop);
  }

  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    shootProjectile(mouseX, mouseY);
  });

  // Start the game loop
  gameLoop();
};
