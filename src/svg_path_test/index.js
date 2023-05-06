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

let rightConnect =1
let leftConnect = 1
let blockRadius = 10
let blockWidth = 200
let blockHeight = 60
function drawBlock() {
    const path = d3.path();

    path.moveTo(5+blockRadius, 5)

    // path.lineTo(5 + blockWidth, 5)
    // path.lineTo(5 + blockWidth - blockRadius, 5)
    path.arcTo(5 + blockWidth, 5, 5 + blockWidth, 15,blockRadius)
    
    if (rightConnect===1) {
        makeRightConnect(0, -5, 10, -15, path,1)
        makeRightConnect(0, 20, 10, -15, path,1)

    } else {
        makeRightConnect(0, -5, -10, -15, path,1)
        makeRightConnect(0, 20, -10, -15, path,1)
    }



    // path.lineTo(blockWidth + 5, blockHeight + 5)
    path.arcTo(blockWidth + 5, blockHeight + 5, blockWidth + 5 - 5, blockHeight + 5, blockRadius)
    
    path.arcTo(5, blockHeight + 5, 5, blockHeight, blockRadius)
    if (leftConnect===1) {
        makeLeftConnect(0, 20, 10, -15, path, 1)
        makeLeftConnect(0, -5, 10, -15, path, 1)
    } else {
        makeLeftConnect(0, 20, 10, -15, path, 1)
        makeLeftConnect(0, -5, -10, -15, path, 1)
    }

    path.arcTo(5,5,10,5, blockRadius)


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
    if (rightConnect===1) {
        rightConnect=-1
    } else {
        rightConnect=1
    }
    if (leftConnect === 1) {
        leftConnect = -1
    } else {
        leftConnect = 1
    }
    drawBlock()

})

function makeRightConnect(x, y, width, height, path,type) {

    switch (type) {
        case 1:
            path.lineTo((blockWidth + 5), (blockHeight - 40 ) + y)
            path.lineTo((blockWidth + 5) + width, (blockHeight - 35  ) + y)
            path.lineTo((blockWidth + 5) + width, (blockHeight - 15 + height ) + y)
            path.lineTo((blockWidth + 5), (blockHeight - 10 + height) + y)
            break;
        default:
            break;
    }
}

function makeLeftConnect(x, y, width, height, path, type) {
    switch (type) {
        case 1:
            path.lineTo(5, (blockHeight - 10 + height) + y)
            path.lineTo(5 + width, (blockHeight - 15 + height) + y)
            path.lineTo(5 + width, (blockHeight - 35) + y)
            path.lineTo(5, (blockHeight - 40) + y)
            break;
        default:
            break;
    }
}