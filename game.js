window.onload = function () {
  function startGame() {
    gameOver = false; // Reset game over flag
    enemies = []; // Clear enemies
    projectiles = []; // Clear projectiles
    //initializeCharacter(); // Reset or initialize the character
    gameLoop(); // Start the game loop
    score = 0;
    window.scrollTo(0, document.body.scrollHeight);
  }

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const map = document.getElementById("mapImage");

  canvas.width = map.width;
  canvas.height = map.height;

  let scoreX = 20;
  let scoreY = canvas.height - 100;

  let gameOverX = canvas.width / 2;
  let gameOverY = canvas.height / 2 - 20;

  const ciottiImg = new Image();
  ciottiImg.src = "ciotti.png";

  let enemyImages = [];
  const enemyImageSources = [
    "wauquiez.png",
    "pecresse.png",
    "bellamy.png",
    "larcher.png",
  ];

  function loadEnemyImages() {
    enemyImageSources.forEach((src) => {
      let img = new Image();
      img.src = src;
      enemyImages.push(img);
    });
  }
  loadEnemyImages();

  const ciotti = {
    x: 360,
    y: 1300,
    size: 64,
    image: ciottiImg,
  };

  let projectiles = [];
  let enemies = [];

  let gameOver = false;
  let score = 0;

  ciottiImg.onload = function () {
    ctx.drawImage(
      ciottiImg,
      ciotti.x - ciotti.size / 2,
      ciotti.y - ciotti.size / 2,
      ciotti.size,
      ciotti.size,
    );
  };

  function createEnemy() {
    const enemySize = 64; // This might be adjusted based on the image size
    let enemyX, enemyY;

    // Spawn the enemy at a random edge of the canvas
    enemyX = Math.random() * canvas.width;
    enemyY = 100;

    const angle = Math.atan2(ciotti.y - enemyY, ciotti.x - enemyX);
    const speed = 3 + score * 0.1; // Adjust speed as necessary

    // Randomly select an image for the enemy
    const imageIndex = Math.floor(Math.random() * enemyImages.length);
    const enemyImage = enemyImages[imageIndex];

    return {
      x: enemyX,
      y: enemyY,
      size: enemySize,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      image: enemyImage,
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

  function checkCollision(entity1, entity2) {
    const xDist = entity1.x - entity2.x;
    const yDist = entity1.y - entity2.y;
    const distance = Math.sqrt(xDist * xDist + yDist * yDist);
    return distance < entity1.size / 2 + entity2.size / 2;
  }

  //#region Projectiles
  function shootProjectile(mouseX, mouseY) {
    const angle = Math.atan2(
      mouseY - ciotti.y /*character.y*/,
      mouseX - ciotti.x /*character.x*/,
    );
    const speed = 5;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    const projectile = {
      x: ciotti.x, //character.x,
      y: ciotti.y, //character.y,
      size: 10, //radius*2
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
        projectile.size / 2,
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

  function drawScore() {
    ctx.save(); // Save current state

    ctx.fillStyle = "white"; // Choose a color that stands out
    ctx.font = "40px Arial"; // Set the size and font of the score text
    ctx.strokeStyle = "black"; // Color of the outline
    ctx.lineWidth = 3; // Width of the outline
    ctx.strokeText("Score: " + score, scoreX, scoreY);
    ctx.fillText("Score: " + score, scoreX, scoreY); // Draw the score in the top-left corner

    ctx.restore();
  }

  function endGame() {
    ctx.save();
    // Stop the animation/game loop by not calling requestAnimationFrame
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; // Semi-transparent black overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game Over Text
    ctx.fillStyle = "white"; // White text color
    ctx.font = "48px Arial"; // Font size and family
    ctx.textAlign = "center"; // Center the text horizontally
    ctx.strokeStyle = "black"; // Color of the outline
    ctx.lineWidth = 3;
    ctx.strokeText("Game Over", gameOverX, gameOverY);
    ctx.fillText("Game Over", gameOverX, gameOverY); // Positioning the text

    // Click to Restart Text
    ctx.font = "24px serif"; // Smaller font size for the restart prompt
    ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 40);

    ctx.restore(); // Save current state

    // Add click event listener to the canvas to handle restart
    canvas.addEventListener("click", restartGame, { once: true });
  }

  function restartGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset game state
    gameOver = false;
    enemies = []; // Reset enemies array
    projectiles = []; // Reset projectiles array
    score = 0;
    //ciotti.x = 750; // Optionally reset the character's position
    //ciotti.y = 950;

    // Remove any event listeners if necessary (handled by 'once', but here for completeness)
    canvas.removeEventListener("click", restartGame);
    window.scrollTo(0, document.body.scrollHeight);

    // Restart the game loop
    gameLoop();
  }

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
          score = score + 1;
        }
      });
    });

    // Check for collisions between the main character and enemies
    enemies.forEach((enemy) => {
      if (checkCollision(ciotti, enemy)) {
        gameOver = true;
      }
    });

    // Remove projectiles and enemies that were marked for removal
    projectiles = projectiles.filter(
      (_, index) => !projectilesToRemove.has(index),
    );
    enemies = enemies.filter((_, index) => !enemiesToRemove.has(index));

    if (gameOver) {
      endGame();
    }
  }

  // Game loop
  function gameLoop() {
    if (!gameOver) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.01 + score * 0.001) {
        // Adjust spawn rate as needed
        enemies.push(createEnemy());
      }
      //updateEnemies();

      ctx.drawImage(
        ciottiImg,
        ciotti.x - ciotti.size / 2,
        ciotti.y - ciotti.size / 2,
        ciotti.size,
        ciotti.size,
      );

      //updateProjectiles();

      drawProjectiles();
      drawEnemies();
      drawScore();
      updateGame();
      requestAnimationFrame(gameLoop);
    }
  }

  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    shootProjectile(mouseX, mouseY);
  });

  // Start the game loop
  startGame();
};
