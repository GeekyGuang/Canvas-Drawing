let canvas = document.getElementById("canvas");

// 获取文档宽度和高度，设置canvas的html属性
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let ctx = canvas.getContext("2d");

ctx.lineWidth = 6; // 设置画线宽度
ctx.lineCap = "round"; // 防止转折处断开

let painting = false;
let last = [0, 0];

// 画线函数
function drawLine(lastX, lastY, newX, newY) {
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(newX, newY);
  ctx.stroke();
}

// 检测是否支持触屏
var isTouchDevice = "ontouchstart" in document.documentElement;

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    last = [x, y];
  };
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    drawLine(last[0], last[1], x, y);
    last = [x, y];
  };
} else {
  canvas.onmousedown = (e) => {
    painting = true;
    last = [e.clientX, e.clientY];
  };

  canvas.onmousemove = (e) => {
    if (painting === true) {
      drawLine(last[0], last[1], e.clientX, e.clientY);
      last = [e.clientX, e.clientY];
    }
  };

  canvas.onmouseup = () => {
    painting = false;
  };
}