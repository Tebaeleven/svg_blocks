'use strict'

// Snap.svg の初期化
let s = Snap('#svg');

// クローン用のsvg要素
let cloneSvg = s.rect(10, 10, 25, 15, 8, 8);
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
    makeClone(0,0)
    makeClone(100, 0)
    makeClone(0, 100)
    makeClone(100, 100)
    // newSvg.click(function () {
    //     alert(this.data("count"));
    // });
});

document.getElementById("move").addEventListener("click", function () {
    moveClone()
})

document.getElementById("x+").addEventListener("click", function () {
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
    console.log(SvgXY)
    count++;
    
    moveClone()
    console.log(count)
}

function moveClone() {
    for (let i = 0; i < SvgArray.length; i++) {
        let localX = SvgXY[i].x;
        let localY = SvgXY[i].y;
        SvgArray[i].transform('T' + (localX * zoom + cameraX * zoom) + ',' + (localY * zoom + cameraY * zoom));
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
    console.log(e.target.value);
    cameraX = Number(e.target.value)
    moveClone()
}

const zoomElem = document.getElementById('zoom');
zoomElem.addEventListener('input', zoomOnChange);

function zoomOnChange(e) {
    zoom = e.target.value
    console.log(zoom);
    moveClone()
}

//TODO オリジナルを隠すorオリジナルを作成しないようにする

//TODO ボタンを押すとその位置からクローンを選択した状態でエディタ画面におけるようにする
    //TODO Drag関数を自作した方が良いかもしれない
    //(エディタ画面に置かれたクローンのドラッグ、ボタンからクローンされた時のドラッグの挙動を実装した方がわかりやすいかも)


