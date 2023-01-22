let svg = document.getElementById("svg")
// 要素を取得
var original = document.getElementById("rect");

let zoom = 1
let cameraX = 0
let cameraY = 0
let svgArray = []
let SvgXY = []
let drawArea = 200
let cloneCounter = 0

// for (let i = 0; i <200; i++) {
//     makeClone(getRandomArbitrary(-drawArea, drawArea), getRandomArbitrary(-drawArea, drawArea))
// }
drawXYAxis()

makeClone(0, 0)
makeClone(200, 0)
// makeClone(0, 200)
// makeClone(200, 200)

function makeClone(x, y) {
    original.style.opacity = 1
    var clone = original.cloneNode(true);
    // setWidth(clone, getRandomArbitrary(50, 100))
    // setHeight(clone, getRandomArbitrary(50, 100))
    // console.log(clone)
    // let text = svgArray[i].getElementsByTagName("text")
    // text[0].setAttribute("transform", "scale(" + zoom + ")")
    // SvgXY.push({ x: x, y: y });
    var text = clone.querySelector("#rect text");
    text.textContent = cloneCounter;
    let width = getWidth(clone)
    let height = getHeight(clone)
    width /= 2
    height /= 2
    clone.setAttribute("x", x)
    clone.setAttribute("y", y)
    SvgXY.push({ x: x, y: y, connected: false });
    svgArray.push(clone);
    original.parentNode.appendChild(clone);
    original.style.opacity = 0.5
    updateEventListeners();
    moveClone()
    cloneCounter++;
}

function moveClone() {
    for (let i = 0; i < svgArray.length; ++i) {
        let localX = SvgXY[i].x
        let localY = SvgXY[i].y
        let HalfWidth = getWidth(svgArray[i]) / 2
        let HalfHeight = getHeight(svgArray[i]) / 2
        let g = svgArray[i].getElementsByTagName("g")
        g[0].setAttribute("transform", "scale(" + zoom + ")")
        svgArray[i].setAttribute("x", ((localX - cameraX) * zoom) + 250 - HalfWidth * zoom - 5 * zoom)
        svgArray[i].setAttribute("y", ((localY - cameraY) * zoom) + 250 - HalfHeight * zoom - 5 * zoom)
        // svgArray[i].setAttribute("transform", "scale(3)");
    }
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
// const zoomElem = document.getElementById('zoom');
// zoomElem.addEventListener('input', zoomOnChange);

// function zoomOnChange(e) {
//     zoom = Number(e.target.value)
//     console.log(zoom)
//     moveClone()
// }

//TODO 拡大縮小を原点を中央にしてできるようにする
//TODO スクロールを原点を中央にしてできるようにする
//TODO ドラッグ、ブロックの吸着機能追加

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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const inputElem = document.getElementById('x');
inputElem.addEventListener('input', rangeOnChange);

function rangeOnChange(e) {
    cameraX = Number(e.target.value)
    console.log(cameraX)
    moveClone()
}
const zoomElem = document.getElementById('zoom');
zoomElem.addEventListener('input', zoomOnChange);

function zoomOnChange(e) {
    zoom = clamp(Number(e.target.value), 0.1, 5)
    moveClone()
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
var dd = false
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

            // console.log(canConnect)
            document.addEventListener("mousemove", moveElement);
            // mouseupイベントを追加
            document.addEventListener("mouseup", stopDrag);

            function moveElement(event) {
                let dragIndex = index
                let cloneIndex=0
                svgArray.forEach(function (svgClone, cloneIndex) {

                })
                if (cloneIndex === dragIndex) {

                } else {
                    document.addEventListener("mouseup", moveConnect);
                    function moveConnect() {
                        if (cloneIndex === dragIndex) {
                        } else {
                            canConnect = connect(index, cloneIndex)
                            if (canConnect === true) {
                                let cloneX = SvgXY[cloneIndex].x
                                let cloneY = SvgXY[cloneIndex].y
                                SvgXY[index].x = cloneX
                                SvgXY[index].y = cloneY + 50
                                moveClone()
                            }
                        }
                    }
                }
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
                // console.log("index: " + index)
                moveClone();


            }
            function stopDrag() {
                dragBlock = false;
                document.removeEventListener("mousemove", moveElement);
                document.removeEventListener("mouseup", stopDrag);
            }
            function bringToFront(svg) {
                var parent = svg.parentNode;
                parent.removeChild(svg);
                parent.appendChild(svg);
            }
        });
    });
}


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
function connect(draggingIndex, cloneIndex) {

    // ドラッグしているクローンの位置
    let margin = 20
    var draggingX = SvgXY[draggingIndex].x
    var draggingY = SvgXY[draggingIndex].y
    let cloneX = SvgXY[cloneIndex].x
    let cloneY = SvgXY[cloneIndex].y
    let distanceX = Math.abs(cloneX - draggingX)
    let distanceY = Math.abs(cloneY - draggingY)-50
    // return Math.abs(cloneX - draggingX) - 170 <= margin && Math.abs(cloneY + 0 - draggingY) <= margin;
    // return distanceY
    // console.log("x:" + distanceX + " y:" + distanceY)
    // console.log(distanceX <= margin && distanceY <= margin)
    return distanceX <= margin && distanceY <= margin
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

let addButton = document.getElementById("add_btn")
addButton.addEventListener("click", onClickHandler);
function onClickHandler(event) {
    makeClone(getRandomArbitrary(-drawArea, drawArea), getRandomArbitrary(-drawArea, drawArea))
}

let resetXYButton = document.getElementById("reset")
resetXYButton.addEventListener("click", resetHandler);
function resetHandler() {
    cameraX = 0
    cameraY = 0
    moveClone()
}
let indexButton = document.getElementById("index")
indexButton.addEventListener("click", onClickHandler);
function onClickHandler(event) {
    cloneIndex += 1
    console.log(cloneIndex)
}
