let svgArea = document.getElementById("svg")
let BlockDom = document.getElementById("rect");
const svgWidth=svgArea.clientWidth

console.log(svgArea)
console.log(svgWidth)
console.log(BlockDom)

let globalCameraX = 0
let globalCameraY = 0

class Block{
    constructor(x, y) {
        this.element = BlockDom.cloneNode(true);
        this.x = x
        this.y = y        
        this.startDragX = 0
        this.startDragY = 0
        this.isDrag = false
        this.newX = 0
        this.newY = 0
        let self = this
        this.blockWidth = (() => {
            let rect = self.element.getElementsByTagName("rect")
            let width = rect[0].getAttribute("width")
            return Number(width)
        })();
        console.log("ブロックの幅", this.blockWidth)
        this.blockHeight = (() => {
            let rect = self.element.getElementsByTagName("rect")
            let height = rect[0].getAttribute("height")
            return Number(height)
        })()
        console.log("ブロックの高さ", this.blockHeight)

        this.moveXY(x,y)
        this.setTextXY()

        this.element.addEventListener("mousedown", function (e) {
            e.stopPropagation()
            console.log("マウスダウン")
            self.isDrag = true
            self.bringToFront()
            self.changeText()
        })

        document.addEventListener("mousemove", function (e) {
            if (self.isDrag) {
                self.startDragX = e.clientX
                self.startDragY = e.clientY
                let dx = self.newX - self.startDragX
                let dy = self.newY - self.startDragY
                self.moveBlock(dx, dy)
                self.setTextXY()
            }
            self.newX = e.clientX
            self.newY = e.clientY
        })
        
        document.addEventListener("mouseup", function (e) {
            e.stopPropagation()
            if (self.isDrag) {
                console.log("終了")
                self.isDrag = false
            }
        })
    }
    setTextXY() {
        this.element.getElementById("xy").textContent = "x:" + this.x + "y:" + this.y
    }
    bringToFront() {
        svgArea.removeChild(this.element)
        svgArea.appendChild(this.element)
    }
    moveBlock(dx, dy) {
        this.x = this.x - dx
        this.y = this.y - dy
        this.moveXY(this.x, this.y)
    }
    changeText() {
        // console.log(this.element)
        this.element.getElementById("dummy").textContent="クリックされた"
    }
    
    appendTo(parentElement) {
        parentElement.appendChild(this.element);
    }
    moveXY(x,y) {
        this.element.setAttribute("x", this.calculateX(x))
        this.element.setAttribute("y", this.calculateY(y))
    }
    calculateX(x) {
        return (x + globalCameraX) + (svgWidth/2) - (this.blockWidth/2) - 5
    }
    calculateY(y) {
        return (y + globalCameraY) + (svgWidth/2) - (this.blockHeight/2) - 5
    }
    scrollBlock() {
        this.moveXY(this.x,this.y)
    }
}

class Editor {
    constructor(x, y,block) {
        this.element = svgArea
        this.cameraX = x
        this.cameraY = y
        this.block = block
        console.log(block)
        this.startDragX = 0
        this.startDragY = 0
        this.isDrag = false
        this.newX = 0
        this.newY = 0
        let self = this

        this.element.addEventListener("mousedown", function (e) {
            e.stopPropagation()
            console.log("エディタマウスダウン")
            self.isDrag = true
        })

        document.addEventListener("mousemove", function (e) {
            if (self.isDrag) {
                self.startDragX = e.clientX
                self.startDragY = e.clientY
                let dx = self.newX - self.startDragX
                let dy = self.newY - self.startDragY
                self.cameraX = self.cameraX - dx
                self.cameraY = self.cameraY - dy
                console.log(self.cameraX, self.cameraY)
                globalCameraX = self.cameraX
                globalCameraY = self.cameraY
                console.log(globalCameraX)
                document.getElementById("camera_data").textContent = "camera_x: " + self.cameraX + "camera_y: " + self.cameraY
                self.block.forEach(function (b) {
                    b.scrollBlock();
                });
            }
            self.newX = e.clientX
            self.newY = e.clientY
        })

        document.addEventListener("mouseup", function (e) {
            e.stopPropagation()
            if (self.isDrag) {
                console.log("エディタ終了")
                self.isDrag = false
            }

        })
    }
}
let blocks = []

let myBlock = new Block(0, 0)
let myBlock2 = new Block(0, 200)

blocks.push(myBlock)
blocks.push(myBlock2)
myBlock.appendTo(svgArea)
myBlock2.appendTo(svgArea)

let myEditor = new Editor(0, 0, blocks)

drawXYAxis()


function drawXYAxis() {
    // X軸の描画
    var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "0");
    xAxis.setAttribute("y1", svg.getAttribute("height") / 2);
    xAxis.setAttribute("x2", svg.getAttribute("width"));
    xAxis.setAttribute("y2", svg.getAttribute("height") / 2);
    xAxis.setAttribute("stroke", "blue");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    // Y軸の描画
    var yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", svg.getAttribute("width") / 2);
    yAxis.setAttribute("y1", "0");
    yAxis.setAttribute("x2", svg.getAttribute("width") / 2);
    yAxis.setAttribute("y2", svg.getAttribute("height"));
    yAxis.setAttribute("stroke", "red");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);
}