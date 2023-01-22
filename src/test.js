let svg = document.getElementById("svg")
// 要素を取得
var original = document.getElementById("rect");

let zoom = 0

let svgArray = []
let SvgXY = []
drawXYAxis()

makeClone(0, 0)
// makeClone(100, 0)
// makeClone(0, 100)
// makeClone(100, 100)


function makeClone(x, y) {
    original.style.opacity = 1
    var clone = original.cloneNode(true);
    // setWidth(clone, getRandomArbitrary(50, 100))
    // setHeight(clone, getRandomArbitrary(50, 100))
    // console.log(clone)

    // SvgXY.push({ x: x, y: y });
    let width = getWidth(clone)
    let height = getHeight(clone)
    width /= 2
    height /= 2
    clone.setAttribute("x", x - 5 - width)
    clone.setAttribute("y", y - 5 - height)
    svgArray.push(clone);

    original.parentNode.appendChild(clone);
    original.style.opacity = 0.3
    moveClone()

}

function moveClone() {
    for (let i = 0; i < svgArray.length; ++i) {
        let localX = Number(svgArray[i].getAttribute("x"))
        let localY = Number(svgArray[i].getAttribute("y"))
        svgArray[i].setAttribute("x", (localX +250))
        svgArray[i].setAttribute("y", (localY +250))
        console.log(i+"番目")
        console.log(svgArray[i].getAttribute("x"))
        console.log(svgArray[i].getAttribute("y"))
        console.log(svgArray[i])
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
function setWidth(clone,width) {
    let rect = clone.getElementsByTagName("rect")
    rect[0].setAttribute("width",width)
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