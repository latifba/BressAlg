// square obj
function Square(size, x, y) {
    this.size = size
    this.x = x
    this.y = y
    this.fill = "#000"
}

// grid obj
function Grid(size, canvas) {
    this.size = size // size of all squares (uniform)
    this.canvas = canvas
    this.arr = [] // 2D array of squares
    this.dim = canvas.width / this.size
    this.selected = 0 // squares selected
    this.bressMode = true // true: draw line at once, false: step
    this.drawingFirstPixel = false // 1st pixel in step mode
    this.squareA = null // 1st square selected
    this.squareB = null // 2nd square selected

    // algorithm variables (to capture in step mode)
    this.x0 = null, this.y0 = null
    this.x1 = null, this.y1 = null
    this.x = null, this.y = null, this.d = null
    this.xi = null, this.xi = null

    // create all the squares of the grid (size^2 squares)
    for (var i = 0; i < size; i++) {
        this.arr.push([])
        for (var j = 0; j < size; j++) {
            this.arr[i].push(new Square(this.dim, i*this.dim, j*this.dim))
        }
    }

    // draw empty grid
    this.draw = function() {
        // squares have black outline and white fill
        canvas.ctx.strokeStyle = "#000"
        canvas.ctx.fillStyle = "#fff"

        // clear canvas
        canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

        // draw each square
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                let square = this.arr[i][j]
                canvas.ctx.strokeRect(square.x, square.y, square.size, square.size)
            }
        }
    }

    // deselect squares and reset algorithm variables
    this.reset = function() {
        this.draw()
        this.squareA = null
        this.squareB = null
        this.selected = 0
        this.x = null
        this.y = null
        this.d = null
        this.bressMode = true
    }

    // initialize the start & end point
    this.init = function() {
        let coordA = this.getCoord(this.squareA)
        let coordB = this.getCoord(this.squareB)

        this.x0 = coordA[0], this.y0 = coordA[1]
        this.x1 = coordB[0], this.y1 = coordB[1]
        this.xi = 1, this.yi = 1
    }

    // select square
    this.drawSquare = function(square) {
        canvas.ctx.fillStyle = square.fill // color

        // record 1st or 2nd square
        if (!this.squareA)
            this.squareA = square
        else if (!this.squareB)
            this.squareB = square

        canvas.ctx.fillRect(square.x, square.y, square.size, square.size) // draw
        this.selected++
    }

    // get square from local coordinates
    this.getSquare = function(x, y) {
        let i = parseInt(x / this.dim)
        let j = parseInt(y / this.dim)
        return this.arr[i][j]
    }

    // get standard plane coordinates from a square
    this.getCoord = function(square) {
        return [parseInt(square.x / square.size),
                parseInt((canvas.height - square.size - square.y) / square.size)] // reflection over x-axis
    }

    // get square from standard plane coordinates
    this.getSquareFromCoord = function(x, y) {
        return this.arr[x][size - 1 - y]
    }

    // draw green guideline between two selected squares
    this.drawGuideline = function() {
        canvas.ctx.strokeStyle = "#00ff00"
        let off = this.squareA.size/2
        // draw from the middle of the 1st square to the middle of the 2nd square
        canvas.ctx.beginPath()
        canvas.ctx.moveTo(this.squareA.x + off, this.squareA.y + off)
        canvas.ctx.lineTo(this.squareB.x + off, this.squareB.y + off)
        canvas.ctx.stroke()
    }

    // drwc 2 red dots on each square drawn
    this.drawDots = function(square) {
        let off = this.squareA.size
        this.canvas.ctx.fillStyle = "#ff0000"
        // first circle is on the right side of the square in the middle
        // second circle is between the first & top right corner
        this.canvas.ctx.beginPath()
        this.canvas.ctx.arc(square.x + off, square.y, off/4, 0, 2 * Math.PI)
        this.canvas.ctx.arc(square.x + off, square.y + off/2, off/4, 0, 2 * Math.PI)
        this.canvas.ctx.fill()
    }


    // draw line between two squares using the empty squares between them
    this.drawLine = function(bressMode) {
        this.init()
        // if user selected step mode but wasn't already in step mode
        this.drawingFirstPixel = this.bressMode == true && bressMode == false
        this.bressMode = bressMode

        // from init
        let x0 = this.x0, y0 = this.y0,
            x1 = this.x1, y1 = this.y1

        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) { // if dy < dx, then 1 > slope > -1
            if (x0 > x1) // which point was placed first
                this.drawLineLow(x1, y1, x0, y0) // placed backwards
            else
                this.drawLineLow(x0, y0, x1, y1) // placed fowards
        }
        else { // if dy > dx, then 1 < slope < -1
            if (y0 > y1)
                this.drawLineHigh(x1, y1, x0, y0)
            else
                this.drawLineHigh(x0, y0, x1, y1)
        }

        if (!this.bressMode) // if step mode
            this.drawGuideline()
    }

    // draw a line with a flatter slope
    this.drawLineLow = function(x0, y0, x1, y1) {
        let dx = x1 - x0
        let dy = y1 - y0

        dxEl.innerHTML = dx
        dyEl.innerHTML = dy

        if (dy < 0) { // if slope < 0
            this.yi *= -1
            dy *= -1
        }

        let d = 2 * dy - dx // see bress algorithm documentation
        let y = y0 // y may increment or stay the same as x increments

        if (!this.bressMode) { // step mode
            if (this.drawingFirstPixel) {  // if first step
                this.d = 2 * dy - dx
                this.x = x0
                this.y = y0
            }

            if (this.x < x1) { // if x behind the end point
                let square = this.getSquareFromCoord(this.x, this.y)
                this.drawSquare(square)
                if (this.yi > 0) // don't draw dots for negative slopes
                    this.drawDots(square)
                updateXYD(this.x, this.y, this.d)

                if (this.d > 0) { // see bress algorithm documentation
                    this.y += this.yi
                    this.d -= (2 * dx)
                }
                this.d += (2 * dy)
            }
            this.x++ // onto the next x
            return
        }

        for (var x = x0; x < x1; x++) { // draw line all at once
            let square = this.getSquareFromCoord(x, y)
            this.drawSquare(square)

            // see bress algorithm documentation
            if (d > 0) {
                y += this.yi
                d -= (2 * dx)
            }
            d += (2 * dy)
        }
    }

    // draw a line with a steeper slope
    // same concepts from the function above except we constantly increment y
    this.drawLineHigh = function(x0, y0, x1, y1) {
        let dx = x1 - x0
        let dy = y1 - y0

        dxEl.innerHTML = dx
        dyEl.innerHTML = dy

        if (dx < 0) {
            this.xi *= -1
            dx *= -1
        }

        let d = 2 * dx - dy // different
        let x = x0

        if (!this.bressMode) {
            if (this.drawingFirstPixel) {
                this.d = 2 * dx - dy
                this.x = x0
                this.y = y0
            }

            if (this.y < y1) {
                let square = this.getSquareFromCoord(this.x, this.y)
                this.drawSquare(square)
                updateXYD(this.x, this.y, this.d)

                if (this.d > 0) {
                    this.x += this.xi
                    this.d -= (2 * dy)
                }
                this.d += (2 * dx)
            }
            this.y++
            return
        }

        for (var y = y0; y < y1; y++) {
            let square = this.getSquareFromCoord(x, y)
            this.drawSquare(square)

            if (d > 0) {
                x += this.xi
                d -= (2 * dy)
            }
            d += (2 * dx)
        }
    }
}
