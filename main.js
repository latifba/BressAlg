let point1El = document.getElementById('point1')
let point2El = document.getElementById('point2')
let dxEl = document.getElementById('dx')
let dyEl = document.getElementById('dy')
let xEl = document.getElementById('x')
let yEl = document.getElementById('y')
let dEl = document.getElementById('d')

function updateXYD(x, y, d) {
    xEl.innerHTML = x
    yEl.innerHTML = y
    dEl.innerHTML = d
}

function Canvas(pWidth, pHeight, pId) {
    this.id = pId
    this.tag = document.createElement("canvas")
    this.ctx = this.tag.getContext("2d")
    this.width = pWidth
    this.height = pHeight

    this.tag.width = this.width
    this.tag.height = this.height

    this.ctx.lineWidth = 1

    let parTag = document.getElementById(this.id)
    if (parTag)
        parTag.appendChild(this.tag)
    else
        document.body.appendChild(this.tag)
}

const canvas = new Canvas(500, 500, 'canvas')
let grid = new Grid(50, canvas)
grid.draw()

function setGrid() {
    let dim = document.getElementById('grid-dim').value
    grid = new Grid(dim, canvas)
    grid.draw()
}

function inSquare(square, x, y) {
    if (x > square.x && x < (square.x + square.size) &&
        y > square.y && y < (square.y + square.size))
        return true
    return false
}

function updatePoints() {
    if (grid.selected == 1) {
        let coord = grid.getCoord(grid.squareA)
        let info = "(" + coord[0] + ", " + coord[1] + ")"
        point1El.innerHTML = info
    }

    if  (grid.selected == 2) {
        let coord = grid.getCoord(grid.squareB)
        let info = "(" + coord[0] + ", " + coord[1] + ")"
        point2El.innerHTML = info
    }
}

canvas.tag.addEventListener('mousedown', (e) => {
    let canvasRect = canvas.tag.getBoundingClientRect()
    let mouseX = e.x - canvasRect.left
    let mouseY = e.y - canvasRect.top

    let square = grid.getSquare(mouseX, mouseY)
    grid.drawSquare(square)
    updatePoints()
})
