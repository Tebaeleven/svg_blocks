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
    // makeClone(0, 0)
    // makeClone(0, 100)
    makeBlocks()
    // newSvg.click(function () {
    //     alert(this.data("count"));
    // });
});

function makeBlocks() {
    for (let i = 0; i < 10; i++) {
        let max = 300
        let min = -300
        let x = Math.random() * (max - min) + min;
        let y = Math.random() * (max - min) + min;
        makeClone(parseInt(x), parseInt(y))
    }
}
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
    // let newSvg = cloneSvg.clone();
    // var text = s.text(0, 0, "Hello World!");
    // // クローンを追加
    // newSvg.append(text);
    // s.append(newSvg);

    // newSvg.transform('t' + ((x)) + ',' + ((y)));
    // newSvg.data("count", count)
    // SvgArray.push(newSvg);
    // let localX = newSvg.transform().localMatrix.e;
    // let localY = newSvg.transform().localMatrix.f;
    // SvgXY.push({ x: localX, y: localY });
    // count++;
    // newSvg.drag()
    // moveClone()
    // console.log(count)
    // SVGファイルのパス
    var svgPath = './2.svg';
    var g = s.group(); // 追加したグループを作成

    // SVGファイルを読み込み、クローンを作成
    Snap.load(svgPath, function (svg) {
        var clone = svg.select('svg').clone();
        g.append(clone);
        console.log(clone)
        // g.select("tspan").node.textContent = "キタコレ！"
        g.transform('t' + ((x)) + ',' + ((y)));
        SvgArray.push(g)
        let localX = g.transform().localMatrix.e;
        let localY = g.transform().localMatrix.f;
        SvgXY.push({ x: localX, y: localY });
        g.drag()
        moveClone()
        console.log(SvgArray)
    });

}

function moveClone() {
    for (let i = 0; i < SvgArray.length; i++) {
        let localX = SvgXY[i].x;
        let localY = SvgXY[i].y;
        // SvgArray[i].select("tspan").node.textContent = localX +","+localY;
        SvgArray[i].transform('T' + ((localX * zoom - cameraX * zoom)+300 ) + ',' + ((localY * zoom - cameraY * zoom)+300)+",s"+zoom);
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

//TODO snap.svgライブラリを使わずに、生のjsで直接divなどにsvgを埋め込んでテストしてみる
    //snap.svgを使うと、inputを使っても値を入力することができないため、直接htmlに埋め込んだ方が良さそう
    //問題
        //svgの座標、複製、配列に入れて扱うことができるか。

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
makeBlocks()