window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const map = document.getElementById("mapImage");

  canvas.width = map.width;
  canvas.height = map.height;

  const ciotti = new Image();
  ciotti.src = "./ciotti.png";

  const projectiles = [];

  ciotti.onload = function () {
    ctx.drawImage(ciotti, 750, 950, 64, 64);
  };

  // Function to shoot projectiles
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

  function updateProjectiles() {
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
        projectiles.splice(index, 1);
      }
    });
  }

  // Game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(ciotti, 750, 950, 64, 64);
    updateProjectiles();
    drawProjectiles();
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
