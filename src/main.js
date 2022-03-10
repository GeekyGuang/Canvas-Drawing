const canvas = document.getElementById('canvas')

// 获取文档宽度和高度，设置canvas的html属性
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

const ctx = canvas.getContext('2d')

const pen = document.querySelector('#pen')
const eraser = document.querySelector('#eraser')
const deleteBtn = document.querySelector('#delete')
const save = document.querySelector('#save')

ctx.lineWidth = 10 // 设置画线宽度
ctx.lineCap = 'round' // 防止转折处断开

let painting = false
let eraserEnabled = false
let last = [0, 0]
let pickedColor = '#000'

const initBG = () => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = pickedColor
}

initBG()

const colors = {
  black: '#000',
  red: '#ff1a40',
  blue: '#1a8cff',
  green: '#2bd965',
  yellow: '#ffdd33',
}

const colorPicker = document.querySelector('.colorPicker')
colorPicker.addEventListener('click', (e) => {
  if (e.target !== e.currentTarget) {
    const oldPicked = document.querySelector('.colorPicker > li.active')
    if (oldPicked) oldPicked.classList.remove('active')
    e.target.classList.add('active')
    const classname = e.target.className.replace('active', '').trim()
    pickedColor = colors[classname]
    ctx.strokeStyle = pickedColor
    ctx.fillStyle = pickedColor
  }
})

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

deleteBtn.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  initBG()
}

save.onclick = () => {
  const url = canvas.toDataURL('image/jpeg')
  const a = document.createElement('a')
  document.body.append(a)
  a.href = url
  a.download = 'my-drawing'
  a.target = '_blank'
  a.click()
}

const thicknessBtn = document.querySelector('.thickness')
const thicknessPickerWrapper = document.querySelector(
  '.thickness-picker-wrapper'
)
thicknessBtn.onclick = () => {
  thicknessPickerWrapper.classList.add('visible')
}

thicknessPickerWrapper.onclick = (e) => {
  if (e.target === e.currentTarget)
    thicknessPickerWrapper.classList.remove('visible')
}

const closeBtn = document.querySelector('#close')
closeBtn.onclick = () => {
  thicknessPickerWrapper.classList.remove('visible')
}

const thicknessHash = {
  1: 4,
  2: 7,
  3: 10,
  4: 13,
  5: 16,
}

const thicknessCircle = document.querySelector(
  '.thickness > .circle-wrapper > .circle'
)
const thicknessNumber = document.querySelector('.thickness > .number')

const thicknessPicker = document.querySelector('.thickness-picker > ul')
thicknessPicker.onclick = (e) => {
  if (e.target.nodeName === 'LI') {
    const oldPicked = document.querySelector(
      '.thickness-picker > ul > li.active'
    )
    oldPicked.classList.remove('active')
    e.target.classList.add('active')

    const num = e.target.innerText
    ctx.lineWidth = thicknessHash[num]
    thicknessCircle.style.width = thicknessHash[num] + 'px'
    thicknessCircle.style.height = thicknessHash[num] + 'px'
    thicknessNumber.innerText = num
  }
}

// 画线函数
function drawLine(lastX, lastY, newX, newY) {
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(newX, newY)
  ctx.stroke()
}

// 画圆
function drawCircle(x, y) {
  ctx.beginPath()
  ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI, true)
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
      drawCircle(x, y)
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
      drawCircle(e.clientX, e.clientY)
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
