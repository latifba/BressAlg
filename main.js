// output divs
let point1El = document.getElementById('point1')
let point2El = document.getElementById('point2')
let dxEl = document.getElementById('dx')
let dyEl = document.getElementById('dy')
let xEl = document.getElementById('x')
let yEl = document.getElementById('y')
let dEl = document.getElementById('d')

// update the following algorithm variables
function updateXYD(x, y, d) {
    xEl.innerHTML = x
    yEl.innerHTML = y
    dEl.innerHTML = d
}

// canvas obj
function Canvas(pWidth, pHeight, pId) {
    this.id = pId // id of a parent element
    this.tag = document.createElement("canvas")
    this.ctx = this.tag.getContext("2d")
    this.width = pWidth
    this.height = pHeight

    // set css width/height
    this.tag.width = this.width
    this.tag.height = this.height

    this.ctx.lineWidth = 1

    // place canvas in the parent element if no parent is given, appendC to body
    let parTag = document.getElementById(this.id)
    if (parTag)
        parTag.appendChild(this.tag)
    else
        document.body.appendChild(this.tag)
}

// create grid
const canvas = new Canvas(500, 500, 'canvas')
let grid = new Grid(50, canvas)
grid.draw()

// set grid pixel size
function setGrid() {
    let dim = document.getElementById('grid-dim').value
    grid = new Grid(dim, canvas)
    grid.draw()
}

// update the coordinate info
function updatePoints() {
    if (grid.selected == 1) { // if first point
        let coord = grid.getCoord(grid.squareA)
        let info = "(" + coord[0] + ", " + coord[1] + ")"
        point1El.innerHTML = info
    }

    if  (grid.selected == 2) { // if second
        let coord = grid.getCoord(grid.squareB)
        let info = "(" + coord[0] + ", " + coord[1] + ")"
        point2El.innerHTML = info
    }
}

// when the user clicks on the canvas
canvas.tag.addEventListener('mousedown', (e) => {
    // do nothing after 2 squares are selected
    if (grid.selected > 2)
        return

    // convert from window to local coordinates
    let canvasRect = canvas.tag.getBoundingClientRect()
    let mouseX = e.x - canvasRect.left
    let mouseY = e.y - canvasRect.top

    // fill in the selected square
    let square = grid.getSquare(mouseX, mouseY)
    grid.drawSquare(square)
    updatePoints()
})
