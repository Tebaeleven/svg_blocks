// // 頂点の座標を配列で定義
// const vertices = [
//     [50, 50],
//     [150, 50],
//     [150, 100],
//     [10, 100],
//     [150, 150],
//     [50, 150]
// ];

// // SVG 要素の選択
// const svg = d3.select("svg");

// // path 要素の追加
// const path = d3.path();
// path.moveTo(...vertices[0]);
// vertices.slice(1).forEach(vertex => {
//     path.lineTo(...vertex);
// });
// path.closePath();

// svg.append("path")
//     .attr("d", path)
//     .attr("fill", "red")
//     .attr("stroke", "black")
//     .attr("stroke-width", "2")
//     .attr("id", "2");
const svg = d3.select("#block-path");

let output = 2
function drawBlock() {
    const path = d3.path();

    path.moveTo(5, 5)

    path.lineTo(205, 5)

    switch (output) {
        case 1:
            path.lineTo(205, 20)
            path.lineTo(225, 25)
            path.lineTo(225, 45)
            path.lineTo(205, 50)
            break;
        case 2:
            path.lineTo(205, 20)
            path.lineTo(185, 25)
            path.lineTo(185, 45)
            path.lineTo(205, 50)
            break
        default:
            break;
    }


    path.lineTo(205, 65)
    path.lineTo(5, 65)


    path.closePath();
    svg
        .attr("d", path)
        .attr("fill", "#e74c3c")
        .attr("stroke", "red")
        .attr("stroke-width", "5")
}


drawBlock()
let block = document.getElementById("block-path")
block.addEventListener("click", function () {
    if (output===1) {
        output=2
    } else {
        output=1
    }
    drawBlock()

})