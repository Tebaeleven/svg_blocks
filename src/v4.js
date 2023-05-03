let svgArea = document.getElementById("svg")
let BlockDom = document.getElementById("rect");
const svgWidth=svgArea.clientWidth
const svgHeight=svgArea.clientHeight
console.log(svgArea)
console.log(svgWidth)
console.log(BlockDom)

let globalCameraX = 0
let globalCameraY = 0
let globalZoom = 1
let globalIsDrag = false

class Block{
    static counter=0
    constructor(x, y, width, height, fill, stroke) {
        this.x = x
        this.y = y
        this.id = Block.counter++
        this.element = BlockDom.cloneNode(true);
        this.rect = this.element.getElementsByTagName("rect")
        this.connect = this.element.getElementById("connect")
        this.connect.style.display = "none";

        this.isTopBlock=false
        this.parent = null
        this.children = null
        this.isDrag = false
        let self = this

        this.rect[0].setAttribute("width", width)
        this.rect[0].setAttribute("height", height)
        this.rect[0].setAttribute("fill", fill)
        this.rect[0].setAttribute("stroke", stroke)

        this.blockWidth = (() => {
            let width = this.rect[0].getAttribute("width")
            return Number(width)
        })();
        console.log("ブロックの幅", this.blockWidth)
        this.blockHeight = (() => {
            let height = this.rect[0].getAttribute("height")
            return Number(height)
        })()
        console.log("ブロックの高さ", this.blockHeight)

        this.moveXY(x, y)
        this.setSize()
        this.setTextXY()

        this.element.addEventListener("mousedown", function (e) {
            e.stopPropagation()
            globalIsDrag = true
            console.log("マウスダウン")
            self.isDrag = true
            self.bringToFront()
            self.changeText()
        })

        let newX = 0
        let newY = 0
        document.addEventListener("mousemove", function (e) {
            if (self.isDrag) {
                let dx = newX - e.clientX
                let dy = newY - e.clientY
                self.moveBlock(dx, dy)
                self.setTextXY()
            }
            newX = e.clientX
            newY = e.clientY
        })
        
        document.addEventListener("mouseup", function (e) {
            e.stopPropagation()
            globalIsDrag = false
            self.connect.style.display = "none"
            if (self.isDrag) {
                console.log("終了")
                self.isDrag = false
            }
            self.changeText()
        })
    }

    setTextXY() {
        this.element.getElementById("xy").textContent = "x:" + Math.floor(this.x) + "y:" + Math.floor(this.y)
    }
    bringToFront() {
        svgArea.removeChild(this.element)
        svgArea.appendChild(this.element)
    }
    moveBlock(dx, dy) {
        this.x = this.x - dx / globalZoom
        this.y = this.y - dy / globalZoom
        this.moveXY(this.x, this.y)
    }
    changeText() {
        this.element.getElementById("dummy").textContent = "ID:" + this.id + ", " + this.isDrag
    }
    appendTo(parentElement) {
        parentElement.appendChild(this.element);
    }
    moveXY(x,y) {
        this.element.setAttribute("x", this.calculateX(x))
        this.element.setAttribute("y", this.calculateY(y))
    }
    calculateX(x) {
        return ((x + globalCameraX) * globalZoom) + (svgWidth / 2)  - (this.blockWidth / 2) * globalZoom - 5 * globalZoom
    }
    calculateY(y) {
        return ((y + globalCameraY) * globalZoom) + (svgHeight / 2)  - (this.blockHeight / 2) * globalZoom - 5 * globalZoom
    }
    scrollBlock() {
        this.setSize()
        this.moveXY(this.x,this.y)
    }
    setSize() {
        let g = this.element.getElementsByTagName("g")
        g[0].setAttribute("transform", "scale(" + globalZoom + ")")
    }
}

class Editor {
    constructor(x, y, block) {
        this.element = svgArea
        this.cameraX = x
        this.cameraY = y
        this.block = block
        console.log(block)

        this.isDrag = false

        let self = this
        this.element.addEventListener("mousedown", function (e) {
            e.stopPropagation()
            console.log("エディタマウスダウン")
            self.isDrag = true
        })
        let newX = 0
        let newY = 0
        document.addEventListener("mousemove", function (e) {
            if (self.isDrag) {
                let dx = newX - e.clientX
                let dy = newY - e.clientY
                self.cameraX = self.cameraX - dx / globalZoom
                self.cameraY = self.cameraY - dy / globalZoom
                globalCameraX = self.cameraX
                globalCameraY = self.cameraY
                document.getElementById("camera_data").textContent = "camera_x: " + Math.floor(self.cameraX) + "camera_y: " + Math.floor(self.cameraY)
                self.block.forEach(function (b) {
                    b.scrollBlock();
                });

            } else if (globalIsDrag) { //ブロックをドラッグしている時のみ
                self.checkDistance()
            }
            newX = e.clientX
            newY = e.clientY
        })
        document.getElementById('zoom').addEventListener('input', function zoomOnChange(e) {
            globalZoom = Number(e.target.value)
            self.block.forEach(function (b) {
                b.scrollBlock();
            });
        });
        document.addEventListener("mouseup", function (e) {
            e.stopPropagation()
            if (self.isDrag) {
                console.log("エディタ終了")
                self.isDrag = false
            }
        })
    }
    checkDistance() {
        
        let draggedBlock
        this.block.forEach(block => {
            if (block.isDrag) { //ドラッグされているブロックを見つける
                draggedBlock=block
            }
        })

        let nearBlock

        let result
        this.block.forEach(b => {
            if (!b.isDrag) { //ドラッグされていないブロックを見つける
                nearBlock = b
                nearBlock.connect.style.display = "none"
                let margin = 50
                let rightX = Math.abs((draggedBlock.x - draggedBlock.blockWidth / 2) - (nearBlock.x + nearBlock.blockWidth / 2))
                let rightY = Math.abs(draggedBlock.y - nearBlock.y)
                let right = rightX < margin && rightY < margin
                if (right) {
                    result = nearBlock
                }
            }
        })
        if (result) {
            result.connect.style.display = "block"
        }

        // let leftDistance = Math.abs((draggedBlock.x + draggedBlock.blockWidth / 2) - (nearBlock.x - nearBlock.blockWidth / 2))
        // let bottomDistance = Math.abs((draggedBlock.y - draggedBlock.blockHeight / 2) - (nearBlock.y + nearBlock.blockHeight / 2))
        // let topDistance = Math.abs((draggedBlock.y + draggedBlock.blockHeight / 2) - (nearBlock.y - nearBlock.blockHeight / 2))

    }
}

let blocks = []

for (let i = 0; i < 3; i++) {
    let value =1// Math.floor(Math.random() * 4) + 1;
    let stroke, fill
    switch (value) {
        case 1:
            stroke = "red"
            fill = "#e74c3c"
            break;
        case 2:
            stroke = "blue"
            fill = "#5252ff"
            break;
        case 3:
            stroke = "green"
            fill = "#00c921"
            break;
        case 4:
            stroke = "orange"
            fill = "yellow"
            break;
        default:
            stroke = "blue"
            fill = "#5252ff"
            break;
    }
    blocks.push(
        new Block(
            getRandomArbitrary(-300, 300),
            getRandomArbitrary(-300, 300),
            260,//getRandomArbitrary(100, 200),
            50,//getRandomArbitrary(50, 50),
            fill,
            stroke,
        )
    )
}

blocks.forEach(function (block) {
    block.appendTo(svgArea)
})

let myEditor = new Editor(0, 0, blocks)

drawXYAxis()

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function drawXYAxis() {
    // X軸の描画
    var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "0");
    xAxis.setAttribute("y1", svgArea.getAttribute("height") / 2);
    xAxis.setAttribute("x2", svgArea.getAttribute("width"));
    xAxis.setAttribute("y2", svgArea.getAttribute("height") / 2);
    xAxis.setAttribute("stroke", "blue");
    xAxis.setAttribute("stroke-width", "2");
    svgArea.appendChild(xAxis);

    // Y軸の描画
    var yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", svgArea.getAttribute("width") / 2);
    yAxis.setAttribute("y1", "0");
    yAxis.setAttribute("x2", svgArea.getAttribute("width") / 2);
    yAxis.setAttribute("y2", svgArea.getAttribute("height"));
    yAxis.setAttribute("stroke", "red");
    yAxis.setAttribute("stroke-width", "2");
    svgArea.appendChild(yAxis);
}