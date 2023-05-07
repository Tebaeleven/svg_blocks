let svgArea = document.getElementById("svg")
let BlockDom = document.getElementById("top-rect");
const svgWidth=svgArea.clientWidth
const svgHeight=svgArea.clientHeight
console.log(svgArea)
console.log(svgWidth)
console.log(BlockDom)

let globalCameraX = 0
let globalCameraY = 0
let globalZoom = 1
let globalIsDrag = false
let dx, dy

class Block{
    static counter = 1
    constructor(x, y, width, height, fill, stroke, dummyText, leftConnect, rightConnect) {
        this.x = x
        this.y = y
        this.id = Block.counter++
        this.element = BlockDom.cloneNode(true);
        this.connect = this.element.getElementById("connect")
        this.text = this.element.getElementById("dummy")
        this.svg = this.element.getElementById("block-path")
        this.left = this.element.getElementById("left")
        this.right = this.element.getElementById("right")
        this.fill = fill
        this.stroke = stroke
        this.leftConnect = leftConnect
        this.rightConnect = rightConnect
        this.text.textContent = dummyText
        this.connect.style.display = "none";
        this.isTopBlock=false
        this.parent = null
        this.children = null
        this.isDrag = false
        this.blockRadius=10
        let self = this
        let newX = 0
        let newY = 0
        this.dummyText=dummyText

        this.connect.setAttribute("x", width + 15)
        let textWidth
        document.addEventListener("DOMContentLoaded", function () {
            textWidth=self.text.getBBox()
            console.log("読み終わった", textWidth)

        })
        this.blockWidth = width
        console.log("ブロックの幅", this.blockWidth)
        this.blockHeight = height
        console.log("ブロックの高さ", this.blockHeight)

        this.moveXY(x, y)
        this.setSize()
        this.setTextXY()
        this.drawBlock(this.blockWidth, this.blockHeight, this.blockRadius,this.leftConnect,this.rightConnect)

        this.element.addEventListener("mousedown", function (e) {
            globalIsDrag = true
            console.log("マウスダウン")
            self.isDrag = true
            self.bringToFront()
            self.changeText()
        })


        document.addEventListener("mousemove", function (e) {
            if (self.isDrag) {
                dx = newX - e.clientX
                dy = newY - e.clientY
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

    drawBlock(blockWidth, blockHeight, blockRadius,leftConnect,rightConnect) {
        const path = d3.path();
        console.log(this.dummyText, path)
        let startX=5
        path.moveTo(5 + blockRadius, 5)
        path.arcTo(5 + blockWidth, 5, 5 + blockWidth, 15, blockRadius)

        switch (rightConnect) {
            case 1:
                this.makeRightConnect(0, 10, 0, path, 1, blockWidth, blockHeight)
                break;
            case -1:
                this.makeRightConnect(0, -10, 0, path, 1, blockWidth, blockHeight)
                break
            case 2:
                this.makeRightConnect(-5, 10, -15, path, 1, blockWidth, blockHeight)
                this.makeRightConnect(20, 10, -15, path, 1, blockWidth, blockHeight)
                break
            case -2:
                this.makeRightConnect(-5, -10, -15, path, 1, blockWidth, blockHeight)
                this.makeRightConnect(20, -10, -15, path, 1, blockWidth, blockHeight)
                break
            default:
                break;
        }
        // if (rightConnect === 1) {
        //     this.makeRightConnect(0, 10, 0, path, 1, blockWidth, blockHeight)
        // } else {
        //     this.makeRightConnect(-5, 10, -15, path, 1, blockWidth, blockHeight)
        //     this.makeRightConnect(20, 10, -15, path, 1, blockWidth, blockHeight)
        // }

        path.arcTo(blockWidth + 5, blockHeight + 5, blockWidth + 5 - 5, blockHeight + 5, blockRadius)
        path.arcTo(5, blockHeight + 5, 5, blockHeight, blockRadius)
        
        switch (leftConnect) {
            case 1:
                this.makeLeftConnect(0, 10, 0, path, 1, blockWidth, blockHeight)

                break;
            case -1:
                this.makeLeftConnect(0, -10, 0, path, 1, blockWidth, blockHeight)

                break
            case 2:
                this.makeLeftConnect(20, 10, -15, path, 1, blockWidth, blockHeight)
                this.makeLeftConnect(-5, 10, -15, path, 1, blockWidth, blockHeight)
                break
            case -2:
                this.makeLeftConnect(20, -10, -15, path, 1, blockWidth, blockHeight)
                this.makeLeftConnect(-5, -10, -15, path, 1, blockWidth, blockHeight)
                break
            default:
                break;
        }
        // if (leftConnect === 1) {
        // } else {

        // }

        path.arcTo(5, 5, 10, 5, blockRadius)
        path.closePath()

        this.svg.setAttribute("d", path)
        this.svg.setAttribute("fill", this.fill)
        this.svg.setAttribute("stroke", this.stroke)
        this.svg.setAttribute("stroke-width", "5")
    }
    makeRightConnect(y, width, height, path, type, blockWidth, blockHeight) {
        switch (type) {
            case 1:
                path.lineTo((blockWidth + 5), (blockHeight - 40) + y)
                path.lineTo((blockWidth + 5) + width, (blockHeight - 35) + y)
                path.lineTo((blockWidth + 5) + width, (blockHeight - 15 + height) + y)
                path.lineTo((blockWidth + 5), (blockHeight - 10 + height) + y)
                break;
            default:
                break;
        }
    }
    makeLeftConnect(y, width, height, path, type, blockWidth, blockHeight) {
        switch (type) {
            case 1:
                path.lineTo(5, (blockHeight - 10 + height) + y)
                path.lineTo(5 + width, (blockHeight - 15 + height) + y)
                path.lineTo(5 + width, (blockHeight - 35) + y)
                path.lineTo(5, (blockHeight - 40) + y)
                break;
            default:
                break;
        }
    }
    setTextXY() {
        // this.element.getElementById("xy").textContent = "x:" + Math.floor(this.x) + "y:" + Math.floor(this.y)
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
        this.left.textContent = "←" + this.parent
        this.right.textContent = "→" + this.children

    }
    appendTo(parentElement) {
        parentElement.appendChild(this.element);
    }
    moveXY(x, y) {
        this.x = x
        this.y = y
        this.element.setAttribute("x", this.calculateX(x))
        this.element.setAttribute("y", this.calculateY(y))
    }
    calculateX(x) {
        return ((x + globalCameraX) * globalZoom) + (svgWidth / 2)  - (this.blockWidth / 2) * globalZoom - 15 * globalZoom
    }
    calculateY(y) {
        return ((y + globalCameraY) * globalZoom) + (svgHeight / 2)  - (this.blockHeight / 2) * globalZoom - 20 * globalZoom
    }
    scrollBlock() {
        this.setSize()
        this.moveXY(this.x,this.y)
    }
    setSize() {
        let g = this.element.getElementsByTagName("g")
        g[0].setAttribute("transform", "scale(" + globalZoom + ")" +"translate(10,20)")
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
        let newX = 0
        let newY = 0
        let draggedBlock = false
        let globalDraggedBlock
        let canConnectBlock = false

        this.element.addEventListener("mousedown", function (e) {
            if (!globalIsDrag) {
                console.log("エディタマウスダウン")
                self.isDrag = true
            } else {
                console.log("エディタ：ブロックドラッグ中")
                //操作しているブロックを全て上に持ってくる
                globalDraggedBlock = self.findDraggedBlock(self.block)
                if (globalDraggedBlock.children) {
                    let bottomBlocks = self.searchBottomBlocks(globalDraggedBlock)
                    if (bottomBlocks) {
                        bottomBlocks.forEach(item => { 
                            item.bringToFront()
                        })
                    }
                }
                console.log("ドラッグ中(配下含め)", globalDraggedBlock)
                self.deleteConnect(globalDraggedBlock)
            }
        })

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
            } else if (globalIsDrag) { //ブロックをドラッグしている時のみ動く
                globalDraggedBlock = self.findDraggedBlock(self.block)
                canConnectBlock = self.isConnectBlock(globalDraggedBlock)

                //ドラッグしているブロックに子があるか判定
                let bottomBlocks
                if (globalDraggedBlock.children) {
                    bottomBlocks = self.searchBottomBlocks(globalDraggedBlock)
                }
                if (bottomBlocks) {
                    bottomBlocks.forEach(item => { //配下を全て動かす
                        item.moveBlock(dx, dy)
                    })
                }
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
        this.element.addEventListener("mouseup", function (e) {
            if (self.isDrag) { //エディタの処理
                console.log("エディタ終了")
                self.isDrag = false
            } else { //ブロックのクリック処理終了時に実行
                //TODO ドラッグしていたものがおかしい
                canConnectBlock = self.isConnectBlock(globalDraggedBlock)
                if (globalDraggedBlock && canConnectBlock) { //接続できる状態だったら
                    self.connectBlock(globalDraggedBlock, canConnectBlock)
                    console.log("ドラッグしていたもの", globalDraggedBlock)

                    console.log("接続先が見つかっていました", canConnectBlock)
                }
            }
            globalDraggedBlock = null
        })
    }
    getTextSize() {
        
    }
    searchBottomBlocks(draggedBlock) {
        let bottomBlocks=[]
        let myObject = this.block
        let currentObject = myObject.find(obj => obj.id === draggedBlock.id); // idが1のオブジェクトを取得
        let childId = currentObject.children; // 子要素のIDを取得
        if (childId === null) {
            return 
        }
        let childObject
        while (childId !== null) {
            childObject = myObject.find(obj => obj.id === childId); // 子要素のオブジェクトを取得
            childId = childObject.children; // 次の子要素のIDを取得
            bottomBlocks.push(childObject)
        }
        return bottomBlocks
    }
    deleteConnect(draggedBlock) {
        console.log("結果", draggedBlock.parent !== null)
        //ドラッグしたブロックの親から子を削除
        if (draggedBlock && draggedBlock.parent !== null) {
            this.block.forEach(item => { //検索
                if (item.id === draggedBlock.parent) {
                    item.children = null
                    item.changeText()
                }
            })
            //ドラッグしたブロックの親を削除
            draggedBlock.parent = null
            draggedBlock.changeText()
        } else {
            console.log("接続先がない", draggedBlock.parent)
        }
    }
    connectBlock(draggedBlock, canConnectBlock) { //ブロックを接続する
        let connectMargin=5
        if (canConnectBlock.children === null) { //接続先がnullかどうか
            /**
             * 1ブロックに接続
             */
            console.log("接続できる")
            draggedBlock.parent = canConnectBlock.id //ドラッグしたブロックの親を設定
            canConnectBlock.children = draggedBlock.id //接続先の子を設定
            let newX = canConnectBlock.x + canConnectBlock.blockWidth / 2 + draggedBlock.blockWidth / 2
            let newY = canConnectBlock.y 

            let dx = newX - draggedBlock.x+ connectMargin
            let dy = newY - draggedBlock.y 
            //ブロックを移動させる
            draggedBlock.x = newX + connectMargin
            draggedBlock.y = newY
            draggedBlock.moveBlock(0, 0)

            let bottomBlocks
            if (draggedBlock.children) {
                bottomBlocks = this.searchBottomBlocks(draggedBlock)
            }
            console.log(bottomBlocks)
            if (bottomBlocks) {
                bottomBlocks.forEach(item => {
                    item.moveBlock(-dx * globalZoom, -dy * globalZoom )
                })
            }

            draggedBlock.changeText()
            canConnectBlock.changeText()
            console.log("1ブロックに接続")

        } else {
            console.log(canConnectBlock)
            console.log("間に挟もうとしています")
            let bottomBlocks
            if (draggedBlock.children) {
                bottomBlocks = this.searchBottomBlocks(draggedBlock)
            } else {
                bottomBlocks=null
            }

            let myObject = this.block
            let betweenTopID = canConnectBlock.id
            let draggedTopID = draggedBlock.id
            let draggedBottomID = null

            if (bottomBlocks){
                draggedBottomID = bottomBlocks[bottomBlocks.length - 1].id
            }
            let betweenBottomID = canConnectBlock.children
            console.log("bottom", bottomBlocks)
            console.log("draggedBottomID", draggedBottomID)
            if (bottomBlocks === null) {
                /**
                 * 1ブロックを2つの間に挟む
                 */
                let betweenTop = canConnectBlock
                let draggedTop = draggedBlock
                let betweenBottom = myObject.find(obj => obj.id === betweenBottomID); 
                
                let group

                if (betweenBottom.children) {
                    group = this.searchBottomBlocks(betweenBottom)
                } 

                betweenTop.children = draggedTopID
                draggedTop.parent = betweenTopID
                draggedTop.children = betweenBottomID
                betweenBottom.parent = draggedTopID

                let newX = betweenTop.x + betweenTop.blockWidth / 2 + draggedTop.blockWidth / 2
                let newY = betweenTop.y
                //ドラッグしている一つ動かす
                draggedTop.x = newX + connectMargin
                draggedTop.y = newY
                draggedTop.moveBlock(0, 0)
                console.log("betweenbottom", betweenBottom)
                //ドラッグしている直下のブロックを移動
                betweenBottom.x = betweenBottom.x + draggedTop.blockWidth + connectMargin
                betweenBottom.moveBlock(0, 0)
                //ドラッグしている直下のブロックの配下のブロックを全て移動
                if (group) {
                    group.forEach(item => {
                        item.moveBlock((-draggedTop.blockWidth - connectMargin) * globalZoom , 0)
                    })
                }

                console.log("1ブロックを2つの間に挟む")
            }
            else {
                /**
                 * 複数ブロックを2つの間に挟む
                 */
                console.log("複数ブロックを2つの間に挟む")

                let betweenTop = canConnectBlock
                let draggedTop = draggedBlock
                let draggedBottom = myObject.find(obj => obj.id === draggedBottomID); 
                let betweenBottom = myObject.find(obj => obj.id === betweenBottomID); 

                let group

                if (draggedTop.children) {
                    group = this.searchBottomBlocks(draggedTop)
                } 
                console.log("ドラッグ中", group)

                betweenTop.children = draggedTopID //子
                betweenBottom.parent = draggedBottomID //親
                draggedBottom.children = betweenBottomID //子
                draggedTop.parent = betweenTopID //親

                let newX = betweenTop.x + betweenTop.blockWidth / 2 + draggedTop.blockWidth / 2 
                let newY = betweenTop.y 
                let dx = newX - draggedTop.x + connectMargin
                let dy = newY - draggedTop.y

                //ドラッグしている一つ動かす
                draggedTop.x = newX + connectMargin
                draggedTop.y = newY
                draggedTop.moveBlock(0, 0)
                
                //ドラッグしている操作中のものを全て移動させる
                if (group) {
                    group.forEach(item => {
                        item.moveBlock(-dx * globalZoom, -dy * globalZoom)
                    })
                }
                
                let totalWidth = bottomBlocks.reduce((total, obj) => {
                    if (obj.blockWidth !== null) {
                        return total + obj.blockWidth + connectMargin
                    } else {
                        return total;
                    }
                }, 0);
                console.log("合計幅", totalWidth)

                //ドラッグしている直下のブロックを移動
                console.log("下ブロック",betweenBottom)
                betweenBottom.x = betweenBottom.x + totalWidth + draggedTop.blockWidth + connectMargin
                betweenBottom.moveBlock(0, 0)

                //ドラッグしている直下のブロックの配下のブロックを全て移動
                if (betweenBottom.children) {
                    let search = this.searchBottomBlocks(betweenBottom)
                    search.forEach(item => {
                        item.moveBlock( -(totalWidth + draggedTop.blockWidth + connectMargin) * globalZoom, 0)
                    })
                } 
            }
        }
    }
    findDraggedBlock(blocks) {
        let draggedBlock
        blocks.forEach(block => {
            if (block.isDrag) { //ドラッグされているブロックを見つける
                draggedBlock = block
            }
        })
        return draggedBlock
    }
    isConnectBlock(dragged) { //接続できるか判定
        let draggedBlock = dragged
        let canConnect

        this.block.forEach(b => { //ドラッグされていないブロックを見つける
            if (!b.isDrag) {
                let nearBlock = b
                nearBlock.connect.style.display = "none"
                let margin = 50
                let rightX = Math.abs((draggedBlock.x - draggedBlock.blockWidth / 2) - (nearBlock.x + nearBlock.blockWidth / 2))
                let rightY = Math.abs(draggedBlock.y - nearBlock.y)
                let right = rightX < margin && rightY < margin
                if (right) {
                    canConnect = nearBlock
                }
            }
        })

        if (canConnect) { //接続先が見つかった場合
            canConnect.connect.style.display = "block"
            return canConnect
        } else { //接続先がなかった場合
            return false
        }
    }
}
drawXYAxis()


let blocks = []

// for (let i = 0; i < 5; i++) {
//     blocks.push(
//         // new Block(
//         //     getRandomArbitrary(-300, 300),
//         //     getRandomArbitrary(-300, 300),
//         //     260,//getRandomArbitrary(100, 200),
//         //     50,//getRandomArbitrary(50, 50),
//         //     "#e74c3c",
//         //     "red",
//         // )
//         new Block(
//             getRandomArbitrary(-300, 300),
//             getRandomArbitrary(-300, 300),
//             getRandomArbitrary(50, 200),
//             getRandomArbitrary(50, 50),
//             "#e74c3c",
//             "red",
//         )
//     )
// }
// blocks.push(
//     new Block(0, 0, 100, 50, "#e74c3c", "red","主語"),
//     new Block(200, 0, 150, 50, "#5252ff", "blue","一般動詞"),
//     new Block(0, 200, 150, 50, "#00c921", "green","be動詞"),
//     new Block(200, 200, 250, 50, "#F9BE01", "#CD8813","目的語"),
//     new Block(300, 200, 150, 50, "#9967FE", "#7B52CD","補語"),
// )
blocks.push(
    // new Block(-430 + 75 / 2, -250, 75, 60, "#e74c3c", "red", "He", 2, 2),
    new Block(0, 0, 75, 60, "#e74c3c", "red", "He", -1, 1),
    new Block(-430 + 110 / 2, -150, 110, 60, "#5252ff", "blue", "gives", 2,1),
    new Block(-430 + 50 / 2, -50, 50, 60, "#00c921", "green", "is", 1, 1),
    new Block(-430 + 80 / 2, 50, 80, 60, "#F9BE01", "#CD8813", "me", 1, 1),
    new Block(-430 + 220 / 2, 150, 220, 60, "#F9BE01", "#CD8813", "some advice", 1, 1),
    new Block(-430 + 205 / 2, 250, 205, 60, "#9967FE", "#7B52CD", "未踏ジュニア", 1, 1),
)
blocks.forEach(function (block) {
    block.appendTo(svgArea)
})

let myEditor = new Editor(0, 0, blocks)


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