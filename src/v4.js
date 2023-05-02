let svgArea = document.getElementById("svg")
let BlockDom = document.getElementById("rect");
const svgWidth=svgArea.clientWidth/2

console.log(svgArea)
console.log(svgWidth)
console.log(BlockDom)


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
        this.moveX(x)
        this.moveY(y)

        this.element.addEventListener("mousedown", function (e) {
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
            }
            self.newX = e.clientX
            self.newY = e.clientY
        })
        
        document.addEventListener("mouseup", function (e) {
            console.log("終了")
            self.isDrag = false
        })
    }
    
    bringToFront() {
        svgArea.removeChild(this.element)
        svgArea.appendChild(this.element)
    }
    moveBlock(dx, dy) {
        this.x = this.x - dx
        this.y = this.y - dy
        this.moveX(this.x)
        this.moveY(this.y)
    }
    changeText() {
        // console.log(this.element)
        this.element.getElementById("dummy").textContent="クリックされた"
    }
    
    appendTo(parentElement) {
        parentElement.appendChild(this.element);
    }

    moveX(x) {
        this.element.setAttribute("x", this.calculateX(x))
    }
    moveY(y) {
        this.element.setAttribute("y", this.calculateY(y))
    }
    calculateX(x) {
        return x + svgWidth/2
    }
    calculateY(y) {
        return y + svgWidth / 2
    }
}
let myBlock = new Block(0, 0)
let myBlock2 = new Block(10, 30)
myBlock.appendTo(svgArea)
myBlock2.appendTo(svgArea)
