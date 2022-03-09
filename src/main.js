const canvas = document.getElementById('canvas')

// 获取文档宽度和高度，设置canvas的html属性
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

const ctx = canvas.getContext('2d')

const pen = document.querySelector('#pen')
const eraser = document.querySelector('#eraser')

let lineWidth = 6

ctx.lineWidth = lineWidth // 设置画线宽度
ctx.lineCap = 'round' // 防止转折处断开

let painting = false
let eraserEnabled = false
let last = [0, 0]

pen.onclick = () => {
  eraserEnabled = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}

eraser.onclick = () => {
  eraserEnabled = true
  pen.classList.remove('active')
  eraser.classList.add('active')
}

// 画线函数
function drawLine(lastX, lastY, newX, newY) {
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(newX, newY)
  ctx.stroke()
}

// 画圆
function drawCircle(x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true)
  ctx.fill()
}

// 检测是否支持触屏
var isTouchDevice = 'ontouchstart' in document.documentElement

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    last = [x, y]
    if (eraserEnabled) {
      ctx.clearRect(x - 10, y - 10, 20, 20)
    } else {
      drawCircle(x, y, lineWidth / 2)
    }
  }
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (eraserEnabled) {
      ctx.clearRect(x - 10, y - 10, 20, 20)
    } else {
      drawLine(last[0], last[1], x, y)
      last = [x, y]
    }
  }
} else {
  canvas.onmousedown = (e) => {
    painting = true
    last = [e.clientX, e.clientY]
    if (eraserEnabled) {
      ctx.clearRect(e.clientX - 10, e.clientY - 10, 20, 20)
    } else {
      drawCircle(e.clientX, e.clientY, lineWidth / 2)
    }
  }

  canvas.onmousemove = (e) => {
    if (painting === true) {
      if (eraserEnabled) {
        ctx.clearRect(e.clientX - 10, e.clientY - 10, 20, 20)
      } else {
        drawLine(last[0], last[1], e.clientX, e.clientY)
        last = [e.clientX, e.clientY]
      }
    }
  }

  canvas.onmouseup = () => {
    painting = false
  }
}
