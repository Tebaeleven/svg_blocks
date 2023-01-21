'use strict'

// Snap.svg の初期化
let s = Snap('#svg');

// クローン用のsvg要素
let cloneSvg = s.rect(10, 10, 35, 15, 4, 4);
cloneSvg.attr({ stroke: '#f00', strokeWidth: 2, fill: '#f00', "fill-opacity": 0.5 });

let count = 0
let SvgArray = []
let SvgXY = []
let x1 = 5
let y1 = 0

let mouseX = 0
let mouseY = 0

let cameraX = 0
let cameraY = 0
let mouseDown = false
let zoom = 1
let modifiedCameraX = 0
let modifiedCameraY = 0
cloneSvg.click(function () {
    alert(this.data("count"));
});

// ボタンがクリックされた時の処理
document.getElementById("add_btn").addEventListener("click", function () {
    makeClone(0, 0)

    for (let i = 0; i < 50; i++) {
        let max = 300
        let min = -300
        let x = Math.random() * (max - min) + min;
        let y = Math.random() * (max - min) + min;
        makeClone(x,y)
    }
    // newSvg.click(function () {
    //     alert(this.data("count"));
    // });
});

document.getElementById("move").addEventListener("click", function () {
    moveClone()
})

document.getElementById("reset").addEventListener("click", function () {
    cameraX = 0
    cameraY = 0
    moveClone()

})
function makeClone(x,y) {
    // let x = Math.random() * (s.node.clientWidth - newSvg.getBBox().width);
    // let y = Math.random() * (s.node.clientHeight - newSvg.getBBox().height);
    //クローンを作成
    let newSvg = cloneSvg.clone();
    // クローンを追加
    s.append(newSvg);
    newSvg.transform('t' + ((x)) + ',' + ((y)));
    newSvg.data("count", count)
    SvgArray.push(newSvg);
    let localX = newSvg.transform().localMatrix.e;
    let localY = newSvg.transform().localMatrix.f;
    SvgXY.push({ x: localX, y: localY });
    count++;
    newSvg.drag()
    moveClone()
    console.log(count)
}

function moveClone() {
    for (let i = 0; i < SvgArray.length; i++) {
        let localX = SvgXY[i].x;
        let localY = SvgXY[i].y;
        SvgArray[i].transform('T' + ((localX * zoom - cameraX * zoom) + 270) + ',' + ((localY * zoom - cameraY * zoom) + 270)+",s"+zoom);
    }
}

document.addEventListener("mousedown", function () {
    mouseDown = true;
})
document.addEventListener("mouseup", function () {
    mouseDown = false;
})
// document.addEventListener('mousemove', function (event) {
//     if (mouseDown){
//         console.log('x: ' + mouseX + ', y: ' + mouseY);
//         mouseX = event.clientX - 300
//         mouseY = event.clientY - 300
//         moveClone(mouseX, mouseY)
//     }

// });

//TODO ブロックをスクロールできるようにする。htmlにスクロールバーを追加し、デバッグしやすくする
const inputElem = document.getElementById('x');
inputElem.addEventListener('input', rangeOnChange);

function rangeOnChange(e) {
    cameraX = Number(e.target.value)
    moveClone()
}

const zoomElem = document.getElementById('zoom');
zoomElem.addEventListener('input', zoomOnChange);

function zoomOnChange(e) {
    zoom = Number(e.target.value)
    moveClone()
}

//TODO オリジナルを隠すorオリジナルを作成しないようにする

//TODO ボタンを押すとその位置からクローンを選択した状態でエディタ画面におけるようにする
    //TODO Drag関数を自作した方が良いかもしれない
    //(エディタ画面に置かれたクローンのドラッグ、ボタンからクローンされた時のドラッグの挙動を実装した方がわかりやすいかも)


window.onmousewheel = function () {
    if (event.wheelDelta > 0) {
        //mainCamera.zoomTo(4, 100);
    } else {
        //mainCamera.zoomTo(1, 100);
    }
}
document.addEventListener("mousewheel", function (event) {
    let delta = -event.deltaY
    let deltaLimit = 0.3;
    let zoomMax = 20;
    let zoomMin = 0.1;

    // 一定数を超えないようにする
    delta = clamp(delta, -deltaLimit, deltaLimit);
    zoom += delta * zoom/2
    zoom = clamp(zoom, zoomMin, zoomMax);

    console.log(zoom)
    moveClone()
});

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}