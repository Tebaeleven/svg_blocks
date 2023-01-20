// Snap.svg の初期化
var s = Snap('#svg');

// クローン用のsvg要素
var cloneSvg = s.rect(10, 10, 40, 20);
cloneSvg.drag()
var count = 0
var newSvg
var newSvgsArray = []
var x1 = 5
var y1 = 5

// ボタンがクリックされた時の処理
document.getElementById("add_btn").addEventListener("click", function () {
    // クローンを作成
    newSvg = cloneSvg.clone();
    // クローンを追加
    s.append(newSvg);
    // ランダムな座標を取得
    var x = Math.random() * (s.node.clientWidth - newSvg.getBBox().width);
    var y = Math.random() * (s.node.clientHeight - newSvg.getBBox().height);
    // ランダムな座標に移動
    newSvg.transform('t' + x  + ',' + y );
    newSvg.data("count", count)
    count++;
    newSvg.drag()
    newSvgsArray.push(newSvg);

    newSvg.click(function () {
        alert(this.data("count"));
    });
});
document.getElementById("move").addEventListener("click", function () {
    console.log(newSvgsArray);
    for (var i = 0; i < newSvgsArray.length; i++){
        let localX = newSvgsArray[i].transform().localMatrix.e;
        let localY = newSvgsArray[i].transform().localMatrix.f;
        newSvgsArray[i].transform('t' + (localX + x1) + ',' + (localY + y1));
    }

})
document.getElementById("speed").addEventListener("click", function () {
    x1 += 10
    y1 += 10
    console.log(x1)
})