window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const map = document.getElementById("mapImage");

  canvas.width = map.width;
  canvas.height = map.height;

  const ciotti = new Image();
  ciotti.src = "./ciotti.png";

  ciotti.onload = function () {
    ctx.drawImage(ciotti, 750, 950, 64, 64);
  };
};
