'use strict'

// Snap.svg の初期化
let s = Snap('#svg');

// クローン用のsvg要素
let cloneSvg = s.rect(10, 10, 100, 40, 8, 8);
cloneSvg.attr({ stroke: '#f00', strokeWidth: 2, fill: '#f00', "fill-opacity": 0.5 });

let count = 0
let newSvgsArray = []
let x1 = 5
let y1 = 0

let mouseX = 0
let mouseY = 0

cloneSvg.click(function () {
    alert(this.data("count"));
});

// ボタンがクリックされた時の処理
document.getElementById("add_btn").addEventListener("click", function () {
    makeClone()
    // newSvg.click(function () {
    //     alert(this.data("count"));
    // });
});

document.getElementById("move").addEventListener("click", function () {
    moveClone()
})

document.getElementById("speed").addEventListener("click", function () {
    x1 += 10
    y1 += 10
    console.log(x1)
})

function makeClone() {
    //クローンを作成
    let newSvg = cloneSvg.clone(); 
    // クローンを追加
    s.append(newSvg); 
    // ランダムな座標を取得
    let x = Math.random() * (s.node.clientWidth - newSvg.getBBox().width);
    let y = Math.random() * (s.node.clientHeight - newSvg.getBBox().height);

    // ランダムな座標に移動
    newSvg.transform('t' + x + ',' + y);
    newSvg.data("count", count)
    count++;
    newSvg.drag()
    newSvgsArray.push(newSvg);
}

function moveClone() {
    for (let i = 0; i < newSvgsArray.length; i++) {
        let localX = newSvgsArray[i].transform().localMatrix.e;
        let localY = newSvgsArray[i].transform().localMatrix.f;
        newSvgsArray[i].transform('T' + (localX + mouseX) + ',' + (localY + mouseY));
    }
}

document.addEventListener('mousedown', function (event) {
    console.log('x: ' + mouseX + ', y: ' + mouseY);
    mouseX = -(event.clientX/100)
    mouseY = -(event.clientY / 100)

});

//TODO ブロックをスクロールできるようにする。htmlにスクロールバーを追加し、デバッグしやすくする

//TODO オリジナルを隠すorオリジナルを作成しないようにする

//TODO ボタンを押すとその位置からクローンを選択した状態でエディタ画面におけるようにする
    //TODO Drag関数を自作した方が良いかもしれない
    //(エディタ画面に置かれたクローンのドラッグ、ボタンからクローンされた時のドラッグの挙動を実装した方がわかりやすいかも)