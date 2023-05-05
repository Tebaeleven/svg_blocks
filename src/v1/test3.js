let svg = document.getElementById("svg")
var originalRect = document.getElementById("rect");
var originalConnect = document.getElementById("connect");

let zoom = 1
let cameraX = 0
let cameraY = 0
let svgArray = []
let SvgXY = []
let drawArea = 200
let groupBlocks = []
let cloneCount = 0

// for (let i = 0; i <200; i++) {
//     makeClone(getRandomArbitrary(-drawArea, drawArea), getRandomArbitrary(-drawArea, drawArea))
// }
drawXYAxis()

makeClone(0, 0)
makeClone(200, 0)
makeClone(0, 200)
makeClone(200, 200)

function makeClone(x, y) {
    originalRect.style.opacity = 1
    originalConnect.style.display = "none";
    var clone = originalRect.cloneNode(true);
    // setWidth(clone, getRandomArbitrary(50, 100))
    // setHeight(clone, getRandomArbitrary(50, 100))
    // console.log(clone)
    // let text = svgArray[i].getElementsByTagName("text")
    // text[0].setAttribute("transform", "scale(" + zoom + ")")
    // SvgXY.push({ x: x, y: y });

    let width = getWidth(clone)
    let height = getHeight(clone)
    width /= 2
    height /= 2
    clone.setAttribute("x", x)
    clone.setAttribute("y", y)
    SvgXY.push({ idx: cloneCount, x: x, y: y, preBlock: null, postBlock: null, connect: null });
    cloneCount++;

    svgArray.push(clone);
    originalRect.parentNode.appendChild(clone);
    originalRect.style.opacity = 0.5
    updateEventListeners();
    moveClone()
}

function moveClone() {
    for (let i = 0; i < svgArray.length; ++i) {
        // SvgXY[i].idx = i
        let localX = SvgXY[i].x
        let localY = SvgXY[i].y
        let HalfWidth = getWidth(svgArray[i]) / 2
        let HalfHeight = getHeight(svgArray[i]) / 2
        let g = svgArray[i].getElementsByTagName("g")
        g[0].setAttribute("transform", "scale(" + zoom + ")")
        svgArray[i].getElementById("dummy").textContent = i + "_⬆️" + SvgXY[i].preBlock + "⬇️" + SvgXY[i].postBlock;
        svgArray[i].getElementById("xy").textContent = "x:" + SvgXY[i].x + "y:" + SvgXY[i].y
        // var upText = svgArray[i].getElementById("up");
        // upText.textContent = (typeof SvgXY[i].preBlock === "object" ? "null" : SvgXY[i].preBlock);
        // var bottomText = svgArray[i].getElementById("bottom");
        // bottomText.textContent = (typeof SvgXY[i].postBlock === "object" ? "null" : SvgXY[i].postBlock);
        svgArray[i].setAttribute("x", ((localX - cameraX) * zoom) + 250 - HalfWidth * zoom - 5 * zoom)
        svgArray[i].setAttribute("y", ((localY - cameraY) * zoom) + 250 - HalfHeight * zoom - 5 * zoom)

    }
}



function updateEventListeners() {
    svgArray.forEach(function (clone, index) {
        clone.addEventListener("mousedown", function (event) {
            event.stopPropagation(); //背景がクリックされたと認識されないように伝播を切断
            bringToFront(this)
            // ドラッグ開始時のマウス位置
            var startX = event.clientX;
            var startY = event.clientY;
            var elementX = SvgXY[index].x;
            var elementY = SvgXY[index].y;

            document.addEventListener("mousemove", moveElement);
            document.addEventListener("mouseup", stopDrag);

            function moveElement(event) {
                // 現在のマウス位置
                var currentX = event.clientX;
                var currentY = event.clientY;
                // ドラッグした距離
                var dx = currentX - startX;
                var dy = currentY - startY;
                // 要素の新しい位置
                var newX = elementX + dx / zoom;
                var newY = elementY + dy / zoom;
                // 要素の位置を更新
                SvgXY[index].x = newX;
                SvgXY[index].y = newY;


                /**
                 * ブロックの接続をする
                 */
                document.addEventListener("mouseup", beginConnect);
                /**
                 * 
                 * 下にくっついているブロックを見つける
                 */
                makeGroup()
                // moveGroup(newX, newY)
                moveClone()
                canConnect(index)

            }

            function stopDrag() {
                document.removeEventListener("mousemove", moveElement);
                document.removeEventListener("mouseup", stopDrag);
            }
            function bringToFront(svg) {
                var parent = svg.parentNode;
                parent.removeChild(svg);
                parent.appendChild(svg);
            }
            function moveGroup(newX, newY) {
                groupBlocks.forEach(function (groupBlock, index) {
                    // console.log(groupBlocks[index].idx)
                    let moveBlockIndex = groupBlocks[index].idx
                    SvgXY[moveBlockIndex].x = newX;
                    SvgXY[moveBlockIndex].y = newY + index * 55;
                    // SvgXY[moveBlockIndex].x = newX;
                })
                moveClone()
            }
            function makeGroup() {
                groupBlocks = []
                groupBlocks.push(SvgXY[index])
                if (typeof SvgXY[index].postBlock === "number") {
                    //postgBlockがnullまで（下にブロックがない）まで繰り返す
                    //現在ドラッグ中のpostBlock
                    let postIndex = Number(SvgXY[index].postBlock)
                    groupBlocks.push(SvgXY[postIndex])
                    //現在ドラッグ中のpostBlockがあるなら
                    if (typeof SvgXY[postIndex].postBlock === "number") {
                        while (typeof SvgXY[postIndex].postBlock === "number") {
                            postIndex = Number(SvgXY[postIndex].postBlock)
                            groupBlocks.push(SvgXY[postIndex])
                            // console.log(postIndex)
                        }
                    }
                }
            }
            function beginConnect() {
                let [canConnect, cloneIndex] = connect(index)
                console.log(cloneIndex)
                resetColor(cloneIndex)
                let dragIndex = index
                if (canConnect === "bottom") {
                    //上のブロック
                    let cloneX = SvgXY[cloneIndex].x
                    let cloneY = SvgXY[cloneIndex].y
                    // //ドラッグしていたブロックを移動
                    // SvgXY[dragIndex].x = cloneX
                    // SvgXY[dragIndex].y = cloneY + 55

                    let rootPost = SvgXY[cloneIndex].postBlock
                    console.log("root")
                    console.log(rootPost)
                    if (typeof rootPost === "number") {

                        if (typeof SvgXY[rootPost].preBlock === "number") {
                            SvgXY[rootPost].preBlock = dragIndex
                        }
                    }

                    //上のブロックのpostを変更
                    SvgXY[cloneIndex].postBlock = dragIndex
                    //ドラッグしていたブロックの上を変更
                    SvgXY[dragIndex].preBlock = cloneIndex


                }

            }
        });
    });
}
svgArray.forEach(function (clone, index) {
    clone.addEventListener("mouseup", function (event) {
        SvgXY.forEach(function (svgClone, cloneIndex) {
            if (typeof SvgXY[cloneIndex].postBlock === "number") {
                // SvgXY[postIndex].postBlock = null;
                SvgXY[cloneIndex].postBlock = null;
            }
            if (typeof SvgXY[cloneIndex].preBlock === "number") {
                SvgXY[cloneIndex].preBlock = null;
            }
        });
    });
});

svg.addEventListener("mousedown", function (event) {
    // ドラッグ開始時のマウス位置
    var startX = event.clientX;
    var startY = event.clientY;
    var elementX = cameraX
    var elementY = cameraY

    document.addEventListener("mousemove", moveElement);
    // mouseupイベントを追加
    document.addEventListener("mouseup", stopDrag);
    function moveElement(event) {
        // 現在のマウス位置
        var currentX = event.clientX;
        var currentY = event.clientY;
        // ドラッグした距離
        var dx = currentX - startX;
        var dy = currentY - startY;
        // 要素の新しい位置
        var newX = elementX - dx / zoom;
        var newY = elementY - dy / zoom;
        // 要素の位置を更新
        cameraX = newX
        cameraY = newY
        moveClone()
    }
    function stopDrag() {
        document.removeEventListener("mousemove", moveElement);
        document.removeEventListener("mouseup", stopDrag);
    }
    // alert("clone clicked!" + index);
});
function connect(draggingIndex) {
    let return_results = 0
    let return_cloneIndex = 0
    svgArray.forEach(function (a, cloneIndex) {
        if (cloneIndex !== draggingIndex) {
            // ドラッグしているクローンの位置
            let margin = 50
            var draggingX = SvgXY[draggingIndex].x
            var draggingY = SvgXY[draggingIndex].y
            let cloneX = SvgXY[cloneIndex].x
            let cloneY = SvgXY[cloneIndex].y

            let bottomX = Math.abs(cloneX - draggingX)
            let bottomY = Math.abs(cloneY + 40 - draggingY)
            let bottom = bottomX <= margin && bottomY <= margin

            let topX = Math.abs(cloneX - draggingX)
            let topY = Math.abs(cloneY - 40 - draggingY)
            let top = topX <= margin && topY <= margin


            let result = false

            if (bottom) {
                result = "bottom"
                return_results = result
                return_cloneIndex = cloneIndex
            }

        }
    })
    return [return_results, return_cloneIndex]

}
function canConnect(draggingIndex) {
    let connectBlock = []
    for (let i = 0; i < svgArray.length; i++) {
        if (i !== draggingIndex) {
            let margin = 50
            var draggingX = SvgXY[draggingIndex].x
            var draggingY = SvgXY[draggingIndex].y
            let cloneX = SvgXY[i].x
            let cloneY = SvgXY[i].y

            let bottomX = Math.abs(cloneX - draggingX)
            let bottomY = Math.abs(cloneY + 40 - draggingY)
            let bottom = bottomX <= margin && bottomY <= margin

            let leftX = Math.abs(cloneX - 170 - draggingX)
            let leftY = Math.abs(cloneY - draggingY)
            let left = leftX <= margin && leftY <= margin

            let topX = Math.abs(cloneX - draggingX)
            let topY = Math.abs(cloneY - 40 - draggingY)
            let top = topX <= margin && topY <= margin

            let rightX = Math.abs(cloneX + 170 - draggingX)
            let rightY = Math.abs(cloneY - draggingY)
            let right = rightX <= margin && rightY <= margin

            resetColor()
            if (bottom) {
                changeColor(i)
                connectBlock.push(i)
                console.log(connectBlock)
                break
            }
        }
    }


}
function changeColor(index) {
    svgArray[index].getElementById("connect").style.display = "block";
}
function resetColor() {
    svgArray.forEach(function (a, b) {
        svgArray[b].getElementById("connect").style.display = "none";

    })
}
document.addEventListener("mousewheel", function (event) {
    let delta = -event.deltaY
    let deltaLimit = 0.2;

    // 一定数を超えないようにする
    delta = clamp(delta, -deltaLimit, deltaLimit);
    zoom += delta * zoom / 2
    zoom = clamp(Number(zoom), 0.1, 5)
    moveClone()
});

document.getElementById("add_btn").addEventListener("click", function () {
    makeClone(getRandomArbitrary(-drawArea, drawArea), getRandomArbitrary(-drawArea, drawArea))
});
document.getElementById("reset").addEventListener("click", function () {
    cameraX = 0
    cameraY = 0
    moveClone()
});
document.getElementById("index").addEventListener("click", function () {
    cloneIndex += 1
});
document.getElementById('zoom').addEventListener('input', function zoomOnChange(e) {
    zoom = clamp(Number(e.target.value), 0.1, 5)
    moveClone()
});
document.getElementById('x').addEventListener('input', function rangeOnChange(e) {
    cameraX = Number(e.target.value)
    console.log(cameraX)
    moveClone()
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function getWidth(clone) {
    let rect = clone.getElementsByTagName("rect")
    let width = rect[0].getAttribute("width")
    return Number(width)
}
function getHeight(clone) {
    let rect = clone.getElementsByTagName("rect")
    let height = rect[0].getAttribute("height")
    return Number(height)
}
function setWidth(clone, width) {
    let rect = clone.getElementsByTagName("rect")
    rect[0].setAttribute("width", width)
}
function setHeight(clone, height) {
    let rect = clone.getElementsByTagName("rect")
    rect[0].setAttribute("height", height)
}

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

function mouseDown() {
    console.log("マウスが押されました")
}
function mouseMove() {
    console.log("マウスが動きました")
}
function mouseUp() {
    console.log("マウスが上がりました")
}