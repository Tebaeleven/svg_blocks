// 要素を取得
var original = document.getElementById("rect");
let zoom = 0

let svgArray = []
let SvgXY = []

// makeClone(0, 100)
// makeClone(100, 100)
// makeClone(100, 0)
// makeClone(100, 0)
makeClone(100, 0)
makeClone(200, 100)

function makeClone(x,y) {
    var clone = original.cloneNode(true);

    // 要素の位置を変更
    svgArray.push(clone);
    clone.setAttribute("x", x)
    clone.setAttribute("y", y)
    SvgXY.push({ x: x, y: y });
    original.parentNode.appendChild(clone);
}

function moveClone() {
    for (let i = 0; i < svgArray.length; i++) {
        svgArray[i].setAttribute("x", x)
        svgArray[i].setAttribute("y", y)

    }
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