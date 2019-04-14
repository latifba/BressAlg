
function Square(size, x, y) {
    this.size = size
    this.x = x
    this.y = y
    this.fill = "#000"
}

function Grid(size, canvas) {
    this.size = size
    this.canvas = canvas
    this.arr = []
    this.dim = canvas.width / this.size
    this.selected = 0
    this.bressMode = true
    this.drawingFirstPixel = false
    this.squareA = null
    this.squareB = null

    this.x0 = null, this.y0 = null
    this.x1 = null, this.y1 = null
    this.x = null, this.y = null, this.d = null
    this.xi = null, this.xi = null

    for (var i = 0; i < size; i++) {
        this.arr.push([])
        for (var j = 0; j < size; j++) {
            this.arr[i].push(new Square(this.dim, i*this.dim, j*this.dim))
        }
    }

    this.draw = function() {
        canvas.ctx.strokeStyle = "#000"
        canvas.ctx.fillStyle = "#fff"
        canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                let square = this.arr[i][j]
                canvas.ctx.strokeRect(square.x, square.y, square.size, square.size)
            }
        }
    }

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

    this.init = function() {
        let coordA = this.getCoord(this.squareA)
        let coordB = this.getCoord(this.squareB)

        this.x0 = coordA[0], this.y0 = coordA[1]
        this.x1 = coordB[0], this.y1 = coordB[1]
        this.xi = 1, this.yi = 1
    }

    this.drawSquare = function(square) {
        canvas.ctx.fillStyle = square.fill
    //    if (this.bressMode && this.selected < 2) {
            if (!this.squareA)
                this.squareA = square
            else if (!this.squareB)
                this.squareB = square

            canvas.ctx.fillRect(square.x, square.y, square.size, square.size)
            this.selected++
    //    }
    }

    this.getSquare = function(x, y) {
        let i = parseInt(x / this.dim)
        let j = parseInt(y / this.dim)
        return this.arr[i][j]
    }

    this.getCoord = function(square) {
        return [parseInt(square.x / square.size),
                parseInt((canvas.height - square.size - square.y) / square.size)]
    }

    this.getSquareFromCoord = function(x, y) {
        return this.arr[x][size - 1 - y]
    }

    this.drawGuideline = function() {
        canvas.ctx.strokeStyle = "#00ff00"
        let off = this.squareA.size/2
        canvas.ctx.beginPath()
        canvas.ctx.moveTo(this.squareA.x + off, this.squareA.y + off)
        canvas.ctx.lineTo(this.squareB.x + off, this.squareB.y + off)
        canvas.ctx.stroke()
    }

    this.drawDots = function(square) {
        let off = this.squareA.size
        this.canvas.ctx.fillStyle = "#ff0000"
        this.canvas.ctx.beginPath()
        this.canvas.ctx.arc(square.x + off, square.y, off/4, 0, 2 * Math.PI)
        this.canvas.ctx.arc(square.x + off, square.y + off/2, off/4, 0, 2 * Math.PI)
        this.canvas.ctx.fill()
    }


    this.drawLine = function(bressMode) {
        this.init()
        this.drawingFirstPixel = this.bressMode == true && bressMode == false
        this.bressMode = bressMode

        let x0 = this.x0, y0 = this.y0,
            x1 = this.x1, y1 = this.y1

        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
            if (x0 > x1)
                this.drawLineLow(x1, y1, x0, y0)
            else
                this.drawLineLow(x0, y0, x1, y1)
        }
        else {
            if (y0 > y1)
                this.drawLineHigh(x1, y1, x0, y0)
            else
                this.drawLineHigh(x0, y0, x1, y1)
        }

        if (!this.bressMode)
            this.drawGuideline()
    }

    this.drawLineLow = function(x0, y0, x1, y1) {
        let dx = x1 - x0
        let dy = y1 - y0

        dxEl.innerHTML = dx
        dyEl.innerHTML = dy

        if (dy < 0) {
            this.yi *= -1
            dy *= -1
        }

        let d = 2 * dy - dx
        let y = y0

        if (!this.bressMode) {
            if (this.drawingFirstPixel) {
                this.d = 2 * dy - dx
                this.x = x0
                this.y = y0
            }

            if (this.x < x1) {
                let square = this.getSquareFromCoord(this.x, this.y)
                this.drawSquare(square)
                if (this.yi > 0)
                    this.drawDots(square)
                updateXYD(this.x, this.y, this.d)

                if (this.d > 0) {
                    this.y += this.yi
                    this.d -= (2 * dx)
                }
                this.d += (2 * dy)
            }
            this.x++
            return
        }

        for (var x = x0; x < x1; x++) {
            let square = this.getSquareFromCoord(x, y)
            this.drawSquare(square)

            if (d > 0) {
                y += this.yi
                d -= (2 * dx)
            }
            d += (2 * dy)
        }
    }

    this.drawLineHigh = function(x0, y0, x1, y1) {
        let dx = x1 - x0
        let dy = y1 - y0

        dxEl.innerHTML = dx
        dyEl.innerHTML = dy

        if (dx < 0) {
            this.xi *= -1
            dx *= -1
        }

        let d = 2 * dx - dy
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
